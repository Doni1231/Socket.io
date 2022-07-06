"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketControllerFactory = void 0;
const context_1 = require("@loopback/context");
/* eslint-disable @typescript-eslint/no-misused-promises */
class WebSocketControllerFactory {
    constructor(ctx, controllerClass) {
        this.ctx = ctx;
        this.controllerClass = controllerClass;
        const { CONTEXT } = context_1.BindingScope;
        this.ctx
            .bind('ws.controller')
            .toClass(this.controllerClass)
            .tag('websocket')
            .inScope(CONTEXT);
    }
    async create(socket) {
        // Instantiate the controller instance
        this.controller = await this.ctx.get('ws.controller');
        await this.setup(socket);
        return this.controller;
    }
    async connect(socket) {
        const connectMethods = context_1.MetadataInspector.getAllMethodMetadata('websocket:connect', this.controllerClass.prototype) || {};
        for (const m in connectMethods) {
            await (0, context_1.invokeMethod)(this.controller, m, this.ctx, [socket]);
        }
    }
    registerSubscribeMethods(socket) {
        const regexpEventHandlers = new Map();
        const subscribeMethods = context_1.MetadataInspector.getAllMethodMetadata('websocket:subscribe', this.controllerClass.prototype) || {};
        for (const m in subscribeMethods) {
            for (const t of subscribeMethods[m]) {
                const regexps = [];
                if (typeof t === 'string') {
                    socket.on(t, async (...args) => {
                        let done = () => null;
                        if (typeof args[args.length - 1] === 'function') {
                            done = args.pop();
                        }
                        await (0, context_1.invokeMethod)(this.controller, m, this.ctx, args);
                        done();
                    });
                }
                else {
                    regexps.push(t);
                }
                if (regexps.length) {
                    // Build a map of regexp based message handlers
                    regexpEventHandlers.set(regexps, async (...args) => {
                        await (0, context_1.invokeMethod)(this.controller, m, this.ctx, args);
                    });
                }
            }
        }
        return regexpEventHandlers;
    }
    /**
     * Set up the controller for the given socket
     * @param socket
     */
    async setup(socket) {
        // Invoke connect handlers
        await this.connect(socket);
        // Register event handlers
        const regexpHandlers = this.registerSubscribeMethods(socket);
        // Register event handlers with regexp
        if (regexpHandlers.size) {
            // Use a socket middleware to match event names with regexp
            socket.use(async (packet, next) => {
                const eventName = packet[0];
                for (const e of regexpHandlers.entries()) {
                    if (e[0].some(re => !!eventName.match(re))) {
                        const handler = e[1];
                        const args = [packet[1]];
                        if (packet[2]) {
                            // TODO: Should we auto-ack?
                            // Ack callback
                            args.push(packet[2]);
                        }
                        await handler(args);
                    }
                }
                next();
            });
        }
    }
}
exports.WebSocketControllerFactory = WebSocketControllerFactory;
//# sourceMappingURL=websocket-controller-factory.js.map