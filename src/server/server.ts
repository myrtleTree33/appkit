import { App, TemplatedApp } from "uWebSockets.js";

export class Server {
  #server: TemplatedApp;

  constructor() {
    this.#server = App();
  }
}

export default new Server();
