"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketApplication = void 0;
const http_server_1 = require("@loopback/http-server");
const rest_1 = require("@loopback/rest");
const websocket_server_1 = require("./websocket.server");
class WebsocketApplication extends rest_1.RestApplication {
    constructor(options = {}) {
        super(options);
        this.httpServer = new http_server_1.HttpServer(this.requestHandler, options.websocket);
        this.wsServer = new websocket_server_1.WebSocketServer(this, this.httpServer);
    }
    websocketRoute(controllerClass, namespace) {
        return this.wsServer.route(controllerClass, namespace);
    }
    async start() {
        await this.wsServer.start();
        await super.start();
    }
    async stop() {
        await this.wsServer.stop();
        await super.stop();
    }
}
exports.WebsocketApplication = WebsocketApplication;
//# sourceMappingURL=websocket.application.js.map