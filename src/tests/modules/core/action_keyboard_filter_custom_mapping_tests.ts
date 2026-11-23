import { TestApplication } from "../../cases/application_test_case"
import { LogControllerTestCase } from "../../cases/log_controller_test_case"
import { Schema, defaultSchema } from "../../../core/schema"
import { Application } from "../../../core/application"

const customSchema = { ...defaultSchema, keyMappings: { ...defaultSchema.keyMappings, ru_j: "о" } }

export default class ActionKeyboardFilterCustomMappingTests extends LogControllerTestCase {
  schema: Schema = customSchema
  application: Application = new TestApplication(this.fixtureElement, this.schema)

  identifier = ["a"]
  fixtureHTML = `
    <div data-controller="a">
      <button id="j-and-cyrillic-j-filters" data-action="keydown.j->a#log keydown.ru_j->a#log2"></button>
    </div>
  `

  async "test a key mapped to a cyrillic letter does not also match through the J key"() {
    const button = this.findElement("#j-and-cyrillic-j-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "о", code: "KeyJ" })
    this.assertActions({ name: "log2", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test j filter still matches the J key on a latin layout"() {
    const button = this.findElement("#j-and-cyrillic-j-filters")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "j", code: "KeyJ" })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }
}
