"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatControllerWs = void 0;
const tslib_1 = require("tslib");
// @ts-ignore
const socket_io_1 = require("socket.io");
const websocket_decorator_1 = require("../websockets/decorators/websocket.decorator");
/**
 * A demo controller for websocket
 */
let ChatControllerWs = class ChatControllerWs {
    constructor(socket) {
        this.socket = socket;
    }
    /**
     * The method is invoked when a client connects to the server
     * @param socket
     */
    connect(socket) {
        console.log('Client connected: %s', this.socket.id);
        socket.join('room 1');
        // Room notification of request /todos/room/example/emit (TodoController)
        socket.join('some room');
    }
    /**
     * Register a handler for 'chat message' events
     * @param msg
     */
    // @ws.emit('namespace' | 'requestor' | 'broadcast')
    handleChatMessage(msg) {
        console.log('Chat message: %s', msg);
        this.socket.nsp.emit('chat message', `[${this.socket.id}] ${msg}`);
    }
    /**
     * Register a handler for all events
     * @param args
     */
    logMessage(...args) {
        console.log('Message: %s', args);
    }
    /**
     * The method is invoked when a client disconnects from the server
     */
    disconnect() {
        console.log('Client disconnected: %s', this.socket.id);
    }
};
tslib_1.__decorate([
    websocket_decorator_1.ws.connect(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [socket_io_1.Socket]),
    tslib_1.__metadata("design:returntype", void 0)
], ChatControllerWs.prototype, "connect", null);
tslib_1.__decorate([
    websocket_decorator_1.ws.subscribe('chat message'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ChatControllerWs.prototype, "handleChatMessage", null);
tslib_1.__decorate([
    websocket_decorator_1.ws.subscribe(/.+/),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ChatControllerWs.prototype, "logMessage", null);
tslib_1.__decorate([
    websocket_decorator_1.ws.disconnect(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], ChatControllerWs.prototype, "disconnect", null);
ChatControllerWs = tslib_1.__decorate([
    (0, websocket_decorator_1.ws)({ name: 'chats1', namespace: /^\/chats\/\d+$/ }),
    tslib_1.__param(0, websocket_decorator_1.ws.socket()),
    tslib_1.__metadata("design:paramtypes", [socket_io_1.Socket])
], ChatControllerWs);
exports.ChatControllerWs = ChatControllerWs;
//# sourceMappingURL=chat.controller.ws.js.map