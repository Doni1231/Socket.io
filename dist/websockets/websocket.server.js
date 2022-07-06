"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const websocket_controller_factory_1 = require("./websocket-controller-factory");
const websocket_decorator_1 = require("./decorators/websocket.decorator");
const socket_io_1 = tslib_1.__importDefault(require("socket.io"));
const debug = require('debug')('loopback:websocket');
class WebSocketServer extends context_1.Context {
    constructor(ctx, httpServer) {
        super(ctx);
        this.ctx = ctx;
        this.httpServer = httpServer;
        this.options = {};
        // @ts-ignore
        this.io = (0, socket_io_1.default)(this.options);
        ctx.bind('ws.server').to(this.io);
    }
    use(fn) {
        return this.io.use(fn);
    }
    route(ControllerClass, meta) {
        if (meta instanceof RegExp || typeof meta === 'string') {
            meta = { namespace: meta };
        }
        if (meta == null) {
            meta = (0, websocket_decorator_1.getWebSocketMetadata)(ControllerClass);
        }
        const nsp = (meta && meta.namespace) ? this.io.of(meta.namespace) : this.io;
        if (meta && meta.name) {
            this.ctx.bind(`ws.namespace.${meta.name}`).to(nsp);
        }
        /* eslint-disable @typescript-eslint/no-misused-promises */
        nsp.on('connection', async (socket) => {
            console.log('connection', 'connection');
            debug('Websocket connected: id=%s namespace=%s', socket.id, socket.nsp.name);
            const reqCtx = new context_1.Context(this);
            // Bind websocket
            reqCtx.bind('ws.socket').to(socket);
            // Instantiate the controller instance
            await new websocket_controller_factory_1.WebSocketControllerFactory(reqCtx, ControllerClass).create(socket);
        });
        return nsp;
    }
    /**
     * Start the websocket server
     */
    async start() {
        await this.httpServer.start();
        // FIXME: Access HttpServer.server
        const server = this.httpServer.server;
        this.io.attach(server, this.options);
    }
    /**
     * Stop the websocket server
     */
    async stop() {
        const close = new Promise((resolve, reject) => {
            this.io.close(() => {
                resolve();
            });
        });
        await close;
        await this.httpServer.stop();
    }
}
exports.WebSocketServer = WebSocketServer;
//# sourceMappingURL=websocket.server.js.map