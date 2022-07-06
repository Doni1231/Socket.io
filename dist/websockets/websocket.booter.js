"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketControllerDefaults = exports.WebsocketControllerBooter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const boot_1 = require("@loopback/boot");
const websocket_application_1 = require("./websocket.application");
let WebsocketControllerBooter = class WebsocketControllerBooter extends boot_1.BaseArtifactBooter {
    constructor(app, projectRoot, websocketControllerConfig = {}) {
        super(projectRoot, Object.assign({}, exports.WebsocketControllerDefaults, websocketControllerConfig));
        this.app = app;
        this.websocketControllerConfig = websocketControllerConfig;
    }
    async load() {
        await super.load();
        this.classes.forEach(cls => {
            this.app.websocketRoute(cls);
        });
    }
};
WebsocketControllerBooter = tslib_1.__decorate([
    (0, boot_1.booter)('websocketControllers'),
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, (0, core_1.inject)(boot_1.BootBindings.PROJECT_ROOT)),
    tslib_1.__param(2, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [websocket_application_1.WebsocketApplication, String, Object])
], WebsocketControllerBooter);
exports.WebsocketControllerBooter = WebsocketControllerBooter;
exports.WebsocketControllerDefaults = {
    dirs: ['controllers'],
    extensions: ['.controller.ws.js'],
    nested: true,
};
//# sourceMappingURL=websocket.booter.js.map