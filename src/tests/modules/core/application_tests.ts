import { ApplicationTestCase } from "../../cases/application_test_case"
import { LogController } from "../../controllers/log_controller"
import { OutletController } from "../../controllers/outlet_controller"

class AController extends LogController {}
class BController extends LogController {}

export default class ApplicationTests extends ApplicationTestCase {
  fixtureHTML = `<div data-controller="a"><div data-controller="b">`
  private definitions = [
    { controllerConstructor: AController, identifier: "a" },
    { controllerConstructor: BController, identifier: "b" },
  ]

  async "test Application#register"() {
    this.assert.equal(this.controllers.length, 0)
    this.application.register("log", LogController)
    await this.renderFixture(`<div data-controller="log">`)

    this.assert.equal(this.controllers[0].initializeCount, 1)
    this.assert.equal(this.controllers[0].connectCount, 1)
  }

  "test Application#load"() {
    this.assert.equal(this.controllers.length, 0)
    this.application.load(this.definitions)
    this.assert.equal(this.controllers.length, 2)

    this.assert.ok(this.controllers[0] instanceof AController)
    this.assert.equal(this.controllers[0].initializeCount, 1)
    this.assert.equal(this.controllers[0].connectCount, 1)

    this.assert.ok(this.controllers[1] instanceof BController)
    this.assert.equal(this.controllers[1].initializeCount, 1)
    this.assert.equal(this.controllers[1].connectCount, 1)
  }

  "test Application#unload"() {
    this.application.load(this.definitions)
    const originalControllers = this.controllers

    this.application.unload("a")
    this.assert.equal(originalControllers[0].disconnectCount, 1)

    this.assert.equal(this.controllers.length, 1)
    this.assert.ok(this.controllers[0] instanceof BController)
  }

  async "test registering a controller connects it as an outlet of the controllers declaring it"() {
    await this.renderFixture(`
      <div id="host" data-controller="host" data-host-beta-outlet=".beta"></div>
      <div class="beta" data-controller="beta"></div>
      <div class="beta" data-controller="beta"></div>
    `)

    this.application.register("host", OutletController)
    await this.nextFrame
    this.application.register("beta", BController)
    await this.nextFrame

    const host = this.application.getControllerForElementAndIdentifier(this.findElement("#host"), "host")
    this.assert.equal((host as OutletController).betaOutletConnectedCallCountValue, 2)
  }

  get controllers() {
    return this.application.controllers as LogController[]
  }
}
