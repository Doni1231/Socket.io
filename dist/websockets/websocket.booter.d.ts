import { ArtifactOptions, BaseArtifactBooter } from "@loopback/boot";
import { WebsocketApplication } from "./websocket.application";
export declare class WebsocketControllerBooter extends BaseArtifactBooter {
    app: WebsocketApplication;
    websocketControllerConfig: ArtifactOptions;
    constructor(app: WebsocketApplication, projectRoot: string, websocketControllerConfig?: ArtifactOptions);
    load(): Promise<void>;
}
export declare const WebsocketControllerDefaults: ArtifactOptions;
