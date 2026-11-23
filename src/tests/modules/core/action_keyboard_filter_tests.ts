import { TestApplication } from "../../cases/application_test_case"
import { LogControllerTestCase } from "../../cases/log_controller_test_case"
import { Schema, defaultSchema } from "../../../core/schema"
import { Application } from "../../../core/application"

const customSchema = { ...defaultSchema, keyMappings: { ...defaultSchema.keyMappings, a: "a", b: "b" } }

export default class ActionKeyboardFilterTests extends LogControllerTestCase {
  schema: Schema = customSchema
  application: Application = new TestApplication(this.fixtureElement, this.schema)

  identifier = ["a"]
  fixtureHTML = `
    <div data-controller="a" data-action="keydown.esc@document->a#log">
      <button id="button1" data-action="keydown.enter->a#log keydown.space->a#log2 keydown->a#log3"></button>
      <button id="button2" data-action="keydown.tab->a#log   keydown.esc->a#log2   keydown->a#log3"></button>
      <button id="button3" data-action="keydown.up->a#log    keydown.down->a#log2  keydown->a#log3"></button>
      <button id="button4" data-action="keydown.left->a#log  keydown.right->a#log2 keydown->a#log3"></button>
      <button id="button5" data-action="keydown.home->a#log  keydown.end->a#log2   keydown->a#log3"></button>
      <button id="button6" data-action="keyup.end->a#log     keyup->a#log3"></button>
      <button id="button7"></button>
      <button id="button8" data-action="keydown.a->a#log keydown.b->a#log2"></button>
      <button id="button9" data-action="keydown.shift+a->a#log keydown.a->a#log2 keydown.ctrl+shift+a->a#log3">
      <button id="button10" data-action="jquery.custom.event->a#log jquery.a->a#log2">
      <button id="button11" data-action="keypress.enter->a#log keypress->a#log3"></button>
      <button id="button12" data-action="keydown.j->a#log"></button>
      <button id="k-filters" data-action="keydown.k->a#log keydown.ctrl+k->a#log2"></button>
      <button id="a-and-q-filters" data-action="keydown.a->a#log keydown.q->a#log2"></button>
      <button id="digit-and-accent-filters" data-action="keydown.2->a#log keydown.e->a#log2 keydown.i->a#log3"></button>
      <button id="digit-4-and-9-filters" data-action="keydown.4->a#log keydown.9->a#log2"></button>
      <button id="alt-j-filter" data-action="keydown.alt+j->a#log"></button>
      <button id="m-and-alt-p-filters" data-action="keydown.m->a#log keydown.alt+p->a#log2"></button>
      <button id="digit-1-and-2-filters" data-action="keydown.shift+1->a#log keydown.2->a#log2 keydown.shift+2->a#log3"></button>
    </div>
  `

  async "test ignore event handlers associated with modifiers other than Enter"() {
    const button = this.findElement("#button1")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "Enter" })
    this.assertActions(
      { name: "log", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than Space"() {
    const button = this.findElement("#button1")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: " " })
    this.assertActions(
      { name: "log2", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than Tab"() {
    const button = this.findElement("#button2")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "Tab" })
    this.assertActions(
      { name: "log", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than Escape"() {
    const button = this.findElement("#button2")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "Escape" })
    this.assertActions(
      { name: "log2", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowUp"() {
    const button = this.findElement("#button3")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ArrowUp" })
    this.assertActions(
      { name: "log", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowDown"() {
    const button = this.findElement("#button3")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ArrowDown" })
    this.assertActions(
      { name: "log2", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowLeft"() {
    const button = this.findElement("#button4")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ArrowLeft" })
    this.assertActions(
      { name: "log", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowRight"() {
    const button = this.findElement("#button4")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ArrowRight" })
    this.assertActions(
      { name: "log2", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than Home"() {
    const button = this.findElement("#button5")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "Home" })
    this.assertActions(
      { name: "log", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than End"() {
    const button = this.findElement("#button5")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "End" })
    this.assertActions(
      { name: "log2", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test keyup"() {
    const button = this.findElement("#button6")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keyup", { key: "End" })
    this.assertActions(
      { name: "log", identifier: "a", eventType: "keyup", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keyup", currentTarget: button }
    )
  }

  async "test global event"() {
    const button = this.findElement("#button7")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "Escape", bubbles: true })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: document })
  }

  async "test custom keymapping: a"() {
    const button = this.findElement("#button8")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "a" })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test custom keymapping: b"() {
    const button = this.findElement("#button8")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "b" })
    this.assertActions({ name: "log2", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test custom keymapping: unknown c"() {
    const button = this.findElement("#button8")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "c" })
    this.assertActions()
  }

  async "test ignore event handlers associated with modifiers other than shift+a"() {
    const button = this.findElement("#button9")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "A", shiftKey: true })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test ignore event handlers associated with modifiers other than a"() {
    const button = this.findElement("#button9")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "a" })
    this.assertActions({ name: "log2", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test ignore event handlers associated with modifiers other than ctrol+shift+a"() {
    const button = this.findElement("#button9")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "A", ctrlKey: true, shiftKey: true })
    this.assertActions({ name: "log3", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test ignore filter syntax when not a keyboard event"() {
    const button = this.findElement("#button10")
    await this.nextFrame
    await this.triggerEvent(button, "jquery.custom.event")
    this.assertActions({ name: "log", identifier: "a", eventType: "jquery.custom.event", currentTarget: button })
  }

  async "test ignore filter syntax when not a keyboard event (case2)"() {
    const button = this.findElement("#button10")
    await this.nextFrame
    await this.triggerEvent(button, "jquery.a")
    this.assertActions({ name: "log2", identifier: "a", eventType: "jquery.a", currentTarget: button })
  }

  async "test modifier filters apply to KeyboardEvents with a custom type"() {
    const button = this.findElement("#button7")
    await this.setAttribute(button, "data-action", "ctrl+shortcut->a#log")

    await this.triggerKeyboardEvent(button, "shortcut", { ctrlKey: false })
    this.assertNoActions()

    await this.triggerKeyboardEvent(button, "shortcut", { ctrlKey: true })
    this.assertActions({ name: "log", identifier: "a", eventType: "shortcut", currentTarget: button })
  }

  async "test ignore non-keyboard keydown events in actions with a key filter"() {
    const button = this.findElement("#button1")
    await this.nextFrame
    await this.triggerEvent(button, "keydown")
    this.assertActions({ name: "log3", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test ignore non-keyboard keyup events in actions with a key filter"() {
    const button = this.findElement("#button6")
    await this.nextFrame
    await this.triggerEvent(button, "keyup")
    this.assertActions({ name: "log3", identifier: "a", eventType: "keyup", currentTarget: button })
  }

  async "test ignore non-keyboard keypress events in actions with a key filter"() {
    const button = this.findElement("#button11")
    await this.nextFrame
    await this.triggerEvent(button, "keypress")
    this.assertActions({ name: "log3", identifier: "a", eventType: "keypress", currentTarget: button })
  }

  // Cyrillic (Bulgarian, phonetic layout)
  async "test plain j key filter falls back to code for cyrillic key"() {
    const button = this.findElement("#button12")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "й", code: "KeyJ" })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  // Greek
  async "test plain j key filter falls back to code for greek key"() {
    const button = this.findElement("#button12")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ξ", code: "KeyJ" })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  // Hebrew
  async "test plain j key filter falls back to code for hebrew key"() {
    const button = this.findElement("#button12")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ח", code: "KeyJ" })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  // Russian layout, physical K key
  async "test k filter matches a cyrillic key on the K key"() {
    const button = this.findElement("#k-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "л", code: "KeyK" })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test ctrl+k filter matches a cyrillic key on the K key"() {
    const button = this.findElement("#k-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "л", code: "KeyK", ctrlKey: true })
    this.assertActions({ name: "log2", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  // AZERTY, physical KeyQ produces "a", physical KeyA produces "q"
  async "test azerty a on the Q key matches only the a filter"() {
    const button = this.findElement("#a-and-q-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "a", code: "KeyQ" })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test azerty q on the A key matches only the q filter"() {
    const button = this.findElement("#a-and-q-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "q", code: "KeyA" })
    this.assertActions({ name: "log2", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  // Dvorak, physical KeyK produces "t"
  async "test dvorak t on the K key does not match the k filter"() {
    const button = this.findElement("#k-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "t", code: "KeyK" })
    this.assertNoActions()
  }

  // AZERTY digit row, unshifted Digit2 produces "é"
  async "test azerty é on the 2 key does not match the 2 filter"() {
    const button = this.findElement("#digit-and-accent-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "é", code: "Digit2" })
    this.assertNoActions()
  }

  // Czech QWERTZ digit row, unshifted Digit2 produces "ě"
  async "test czech ě on the 2 key does not match the 2 filter"() {
    const button = this.findElement("#digit-and-accent-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ě", code: "Digit2" })
    this.assertNoActions()
  }

  // Turkish F layout, physical KeyE produces "ğ" (the "e" letter sits on KeyD)
  async "test turkish F ğ on the E key does not match the e filter"() {
    const button = this.findElement("#digit-and-accent-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ğ", code: "KeyE" })
    this.assertNoActions()
  }

  // Turkish Q layout, physical KeyI produces dotless "ı" (the "i" letter sits on Quote)
  async "test turkish Q ı on the I key does not match the i filter"() {
    const button = this.findElement("#digit-and-accent-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ı", code: "KeyI" })
    this.assertNoActions()
  }

  // IME first keydown (Chrome: key "Process", isComposing false), physical KeyK
  async "test IME Process key on the K key does not match the k filter"() {
    const button = this.findElement("#k-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "Process", code: "KeyK" })
    this.assertNoActions()
  }

  // Dead key on KeyE (a layout with a dead accent at that position)
  async "test dead key on the E key does not match the e filter"() {
    const button = this.findElement("#digit-and-accent-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "Dead", code: "KeyE" })
    this.assertNoActions()
  }

  async "test a composing keydown on the K key does not match the k filter"() {
    const button = this.findElement("#k-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "л", code: "KeyK", isComposing: true })
    this.assertNoActions()
  }

  // macOS Korean IME first keydown: keyCode 229 while isComposing is still false
  async "test an IME keydown with keyCode 229 on the K key does not match the k filter"() {
    const button = this.findElement("#k-filters")
    await this.nextFrame
    const event = new KeyboardEvent("keydown", { key: "ㅏ", code: "KeyK" })
    Object.defineProperty(event, "keyCode", { value: 229 })
    button.dispatchEvent(event)
    await this.nextFrame
    this.assertNoActions()
  }

  // Adlam letters sit outside the Basic Multilingual Plane
  async "test k filter matches an adlam letter on the K key"() {
    const button = this.findElement("#k-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "𞤳", code: "KeyK" })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test j filter does not match a cyrillic key on the K key"() {
    const button = this.findElement("#button12")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "л", code: "KeyK" })
    this.assertNoActions()
  }

  async "test 2 filter matches a persian digit on the 2 key"() {
    const button = this.findElement("#digit-and-accent-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "۲", code: "Digit2" })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  // Euro sign typed with AltGr+E, reported without modifiers on Linux
  async "test euro sign on the E key does not match the e filter"() {
    const button = this.findElement("#digit-and-accent-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "€", code: "KeyE" })
    this.assertNoActions()
  }

  // Thai layout types letters on the number row
  async "test thai letter on the 4 key does not match the 4 filter"() {
    const button = this.findElement("#digit-4-and-9-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ภ", code: "Digit4" })
    this.assertNoActions()
  }

  // Vietnamese layout, a latin letter from the U+1E00 block on the number row
  async "test vietnamese ạ on the 9 key does not match the 9 filter"() {
    const button = this.findElement("#digit-4-and-9-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ạ", code: "Digit9" })
    this.assertNoActions()
  }

  // macOS Option+J types the ∆ symbol
  async "test alt+j filter does not match a symbol on the J key"() {
    const button = this.findElement("#alt-j-filter")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "∆", code: "KeyJ", altKey: true })
    this.assertNoActions()
  }

  async "test j filter matches a cyrillic key on the J key"() {
    const button = this.findElement("#button12")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "о", code: "KeyJ" })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  // AltGr+M types µ on several Latin layouts
  async "test micro sign typed with AltGraph on the M key does not match the m filter"() {
    const button = this.findElement("#m-and-alt-p-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "µ", code: "KeyM", modifierAltGraph: true })
    this.assertNoActions()
  }

  async "test greek letter typed with AltGraph on the M key does not match the m filter"() {
    const button = this.findElement("#m-and-alt-p-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "μ", code: "KeyM", modifierAltGraph: true })
    this.assertNoActions()
  }

  async "test a native digit on a letter key does not match a digit filter"() {
    const button = this.findElement("#digit-1-and-2-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "๒", code: "KeyQ" })
    this.assertNoActions()
  }

  // macOS Option+P types π
  async "test alt+p filter does not match a greek letter typed with Option on the P key"() {
    const button = this.findElement("#m-and-alt-p-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "π", code: "KeyP", altKey: true })
    this.assertNoActions()
  }

  // Thai layout, Shift+2 types the Thai digit one
  async "test thai digit one on shift+2 matches the shift+1 filter"() {
    const button = this.findElement("#digit-1-and-2-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "๑", code: "Digit2", shiftKey: true })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test 2 filter matches a persian digit on the numpad"() {
    const button = this.findElement("#digit-1-and-2-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "۲", code: "Numpad2" })
    this.assertActions({ name: "log2", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  // Hindi InScript types the vowel sign ा on the E key
  async "test e filter matches a devanagari vowel sign on the E key"() {
    const button = this.findElement("#digit-and-accent-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ा", code: "KeyE" })
    this.assertActions({ name: "log2", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  // Thai layout types the tone mark ่ on the J key
  async "test j filter matches a thai tone mark on the J key"() {
    const button = this.findElement("#button12")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "่", code: "KeyJ" })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }
}
