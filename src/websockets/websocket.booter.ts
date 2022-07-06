

import { config, CoreBindings, inject } from '@loopback/core';
import { ArtifactOptions, BaseArtifactBooter, BootBindings, booter } from "@loopback/boot";
import { WebsocketApplication } from "./websocket.application";

@booter('websocketControllers')
export class WebsocketControllerBooter extends BaseArtifactBooter {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: WebsocketApplication,
    @inject(BootBindings.PROJECT_ROOT) projectRoot: string,
    @config()
    public websocketControllerConfig: ArtifactOptions = {},
  ) {
    super(
      projectRoot,
      Object.assign({}, WebsocketControllerDefaults, websocketControllerConfig),
    );
  }


  async load() {
    await super.load();
    this.classes.forEach(cls => {
      this.app.websocketRoute(cls);
    });
  }
}


export const WebsocketControllerDefaults: ArtifactOptions = {
  dirs: ['controllers'],
  extensions: ['.controller.ws.js'],
  nested: true,
};

