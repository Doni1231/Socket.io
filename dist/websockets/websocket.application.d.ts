import { ApplicationConfig } from '@loopback/core';
import { HttpServer } from '@loopback/http-server';
import { RestApplication } from '@loopback/rest';
import { WebSocketServer } from "./websocket.server";
import { Constructor } from "@loopback/context";
import { Namespace } from "socket.io";
export { ApplicationConfig };
export declare class WebsocketApplication extends RestApplication {
    readonly httpServer: HttpServer;
    readonly wsServer: WebSocketServer;
    constructor(options?: ApplicationConfig);
    websocketRoute(controllerClass: Constructor<any>, namespace?: string | RegExp): Namespace;
    start(): Promise<void>;
    stop(): Promise<void>;
}
