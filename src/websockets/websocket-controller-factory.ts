import {BindingScope, Constructor, Context, invokeMethod, MetadataInspector,} from '@loopback/context';
// @ts-ignore
import {Socket} from 'socket.io';

/* eslint-disable @typescript-eslint/no-misused-promises */
export class WebSocketControllerFactory {
  private controller: { [method: string]: Function };

  constructor(
    private ctx: Context,
    private controllerClass: Constructor<{ [method: string]: Function }>,
  ) {
    const {CONTEXT} = BindingScope;
    this.ctx
      .bind('ws.controller')
      .toClass(this.controllerClass)
      .tag('websocket')
      .inScope(CONTEXT);
  }

  async create(socket: Socket) {
    // Instantiate the controller instance
    this.controller = await this.ctx.get<{ [method: string]: Function }>(
      'ws.controller',
    );
    await this.setup(socket);
    return this.controller;
  }

  async connect(socket: Socket) {
    const connectMethods =
      MetadataInspector.getAllMethodMetadata(
        'websocket:connect',
        this.controllerClass.prototype,
      ) || {};
    for (const m in connectMethods) {
      await invokeMethod(this.controller, m, this.ctx, [socket]);
    }
  }

  registerSubscribeMethods(socket: Socket) {
    const regexpEventHandlers = new Map<RegExp[],
      (...args: unknown[]) => Promise<void>>();
    const subscribeMethods =
      MetadataInspector.getAllMethodMetadata<(string | RegExp)[]>(
        'websocket:subscribe',
        this.controllerClass.prototype,
      ) || {};
    for (const m in subscribeMethods) {
      for (const t of subscribeMethods[m]) {
        const regexps: RegExp[] = [];
        if (typeof t === 'string') {
          socket.on(t, async (...args: unknown[]) => {
            let done: Function = () => null;
            if (typeof args[args.length - 1] === 'function') {
              done = args.pop() as Function;
            }
            await invokeMethod(this.controller, m, this.ctx, args);
            done();
          });
        } else {
          regexps.push(t);
        }
        if (regexps.length) {
          // Build a map of regexp based message handlers
          regexpEventHandlers.set(regexps, async (...args: unknown[]) => {
            await invokeMethod(this.controller, m, this.ctx, args);
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
  async setup(socket: Socket) {
    // Invoke connect handlers
    await this.connect(socket);

    // Register event handlers
    const regexpHandlers = this.registerSubscribeMethods(socket);

    // Register event handlers with regexp
    if (regexpHandlers.size) {
      // Use a socket middleware to match event names with regexp
      socket.use(async (packet: any, next: () => void) => {
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
