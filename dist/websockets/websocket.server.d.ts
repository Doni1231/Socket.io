import { Constructor, Context } from '@loopback/context';
import { HttpServer } from '@loopback/http-server';
import { Server, Socket } from 'socket.io';
import { WebSocketMetadata } from './decorators/websocket.decorator';
export declare type SockIOMiddleware = (socket: Socket, fn: (err?: any) => void) => void;
export declare class WebSocketServer extends Context {
    ctx: Context;
    readonly httpServer: HttpServer;
    private readonly io;
    private options;
    constructor(ctx: Context, httpServer: HttpServer);
    use(fn: SockIOMiddleware): Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>;
    route(ControllerClass: Constructor<any>, meta?: WebSocketMetadata | string | RegExp): any;
    /**
     * Start the websocket server
     */
    start(): Promise<void>;
    /**
     * Stop the websocket server
     */
    stop(): Promise<void>;
}
