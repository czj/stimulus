import { ActionDescriptor, parseActionDescriptorString, stringifyEventTarget } from "./action_descriptor"
import { Token } from "../mutation-observers"
import { Schema } from "./schema"
import { camelize } from "./string_helpers"
import { hasProperty } from "./utils"

const allModifiers = ["meta", "ctrl", "alt", "shift"]

export class Action {
  readonly element: Element
  readonly index: number
  readonly eventTarget: EventTarget
  readonly eventName: string
  readonly eventOptions: AddEventListenerOptions
  readonly identifier: string
  readonly methodName: string
  readonly keyFilter: string
  readonly schema: Schema

  static forToken(token: Token, schema: Schema) {
    return new this(token.element, token.index, parseActionDescriptorString(token.content), schema)
  }

  constructor(element: Element, index: number, descriptor: Partial<ActionDescriptor>, schema: Schema) {
    this.element = element
    this.index = index
    this.eventTarget = descriptor.eventTarget || element
    this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name")
    this.eventOptions = descriptor.eventOptions || {}
    this.identifier = descriptor.identifier || error("missing identifier")
    this.methodName = descriptor.methodName || error("missing method name")
    this.keyFilter = descriptor.keyFilter || ""
    this.schema = schema
  }

  toString() {
    const eventFilter = this.keyFilter ? `.${this.keyFilter}` : ""
    const eventTarget = this.eventTargetName ? `@${this.eventTargetName}` : ""
    return `${this.eventName}${eventFilter}${eventTarget}->${this.identifier}#${this.methodName}`
  }

  shouldIgnoreKeyboardEvent(event: Event): boolean {
    if (!this.keyFilter) {
      return false
    }

    // Chrome dispatches a plain Event, not a KeyboardEvent, when the user accepts an autocomplete suggestion
    if (!(event instanceof KeyboardEvent)) {
      return true
    }

    const filters = this.keyFilter.split("+")
    if (this.keyFilterDissatisfied(event, filters)) {
      return true
    }

    const standardFilter = filters.filter((key) => !allModifiers.includes(key))[0]
    if (!standardFilter) {
      // missing non modifier key
      return false
    }

    if (!hasProperty(this.keyMappings, standardFilter)) {
      error(`contains unknown key filter: ${this.keyFilter}`)
    }

    const mappedKey = this.keyMappings[standardFilter].toLowerCase()
    const normalizedEventKey = this.normalizedKeyboardEventKey(event, mappedKey)

    return mappedKey !== normalizedEventKey
  }

  shouldIgnoreMouseEvent(event: MouseEvent): boolean {
    if (!this.keyFilter) {
      return false
    }

    const filters = [this.keyFilter]
    if (this.keyFilterDissatisfied(event, filters)) {
      return true
    }

    return false
  }

  get params() {
    const params: { [key: string]: any } = {}
    const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i")

    for (const { name, value } of Array.from(this.element.attributes)) {
      const match = name.match(pattern)
      const key = match && match[1]
      if (key) {
        params[camelize(key)] = typecast(value)
      }
    }
    return params
  }

  private get eventTargetName() {
    return stringifyEventTarget(this.eventTarget)
  }

  private get keyMappings() {
    return this.schema.keyMappings
  }

  private keyFilterDissatisfied(event: KeyboardEvent | MouseEvent, filters: Array<string>): boolean {
    const [meta, ctrl, alt, shift] = allModifiers.map((modifier) => filters.includes(modifier))

    return event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== alt || event.shiftKey !== shift
  }

  private normalizedKeyboardEventKey(event: KeyboardEvent, mappedKey: string): string {
    const eventKey = event.key.toLowerCase()
    const physicalKey = isPrintableASCIICharacter(mappedKey) ? physicalKeyFor(event) : null

    return physicalKey && !isMappedValue(this.keyMappings, eventKey) ? physicalKey : eventKey
  }
}

const defaultEventNames: { [tagName: string]: (element: Element) => string } = {
  a: () => "click",
  button: () => "click",
  form: () => "submit",
  details: () => "toggle",
  input: (e) => (e.getAttribute("type") == "submit" ? "click" : "input"),
  select: () => "change",
  textarea: () => "input",
}

export function getDefaultEventNameForElement(element: Element): string | undefined {
  const tagName = element.tagName.toLowerCase()
  if (tagName in defaultEventNames) {
    return defaultEventNames[tagName](element)
  }
}

function error(message: string): never {
  throw new Error(message)
}

function typecast(value: any): any {
  try {
    return JSON.parse(value)
  } catch (o_O) {
    return value
  }
}

interface KeyPatterns {
  letterOrMark: RegExp
  sharedScript: RegExp
  decimalDigit: RegExp
}

let keyPatterns: KeyPatterns | null | undefined

// Built lazily at runtime: the es2017 target rejects Unicode property escapes in regex literals, and older engines throw on them
function getKeyPatterns(): KeyPatterns | null {
  if (keyPatterns === undefined) {
    try {
      keyPatterns = {
        letterOrMark: new RegExp("^[\\p{L}\\p{M}]$", "u"),
        sharedScript: new RegExp("^[\\p{Script=Latin}\\p{Script=Common}\\p{Script=Inherited}]$", "u"),
        decimalDigit: new RegExp("^\\p{Nd}$", "u"),
      }
    } catch (o_O) {
      keyPatterns = null
    }
  }
  return keyPatterns
}

// A non-Latin layout's letter or mark stands for the US QWERTY key at its position, and a native digit for its value.
// Latin layouts keep what they type (é, ğ, ı, µ, €), and so do Alt/AltGraph combinations and IME keydowns (keyCode 229 on macOS).
function physicalKeyFor(event: KeyboardEvent): string | null {
  const { key } = event
  const patterns = getKeyPatterns()
  if (
    !patterns ||
    event.isComposing ||
    event.keyCode === 229 ||
    event.altKey ||
    event.getModifierState?.("AltGraph") ||
    isPrintableASCIICharacter(key)
  ) {
    return null
  }

  if (/^(Digit|Numpad)\d$/.test(event.code) && patterns.decimalDigit.test(key)) {
    return String(decimalDigitValue(key, patterns.decimalDigit))
  }

  const letterMatch = event.code.match(/^Key([A-Z])$/)
  if (letterMatch && patterns.letterOrMark.test(key) && !patterns.sharedScript.test(key)) {
    return letterMatch[1].toLowerCase()
  }

  return null
}

// Unicode encodes decimal digits in contiguous runs of 0 to 9, so a digit's value is its offset in its run, modulo 10
function decimalDigitValue(digit: string, decimalDigit: RegExp): number {
  const codePoint = digit.codePointAt(0) || 0
  let offset = 0
  while (decimalDigit.test(String.fromCodePoint(codePoint - offset - 1))) {
    offset++
  }
  return offset % 10
}

function isMappedValue(keyMappings: { [key: string]: string }, key: string): boolean {
  return Object.keys(keyMappings).some((filter) => {
    const value = keyMappings[filter]
    return typeof value == "string" && value.toLowerCase() == key
  })
}

function isPrintableASCIICharacter(value: string): boolean {
  return value.length === 1 && value >= " " && value <= "~"
}
