"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoListApplication = void 0;
const tslib_1 = require("tslib");
const boot_1 = require("@loopback/boot");
const repository_1 = require("@loopback/repository");
const rest_explorer_1 = require("@loopback/rest-explorer");
const service_proxy_1 = require("@loopback/service-proxy");
const path_1 = tslib_1.__importDefault(require("path"));
const sequence_1 = require("./sequence");
const websocket_booter_1 = require("./websockets/websocket.booter");
const websocket_application_1 = require("./websockets/websocket.application");
class TodoListApplication extends (0, boot_1.BootMixin)((0, service_proxy_1.ServiceMixin)((0, repository_1.RepositoryMixin)(websocket_application_1.WebsocketApplication))) {
    constructor(options = {}) {
        super(options);
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        // Set up default home page
        this.static('/', path_1.default.join(__dirname, '../public'));
        // Customize @loopback/rest-explorer configuration here
        this.configure(rest_explorer_1.RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(rest_explorer_1.RestExplorerComponent);
        this.booters(websocket_booter_1.WebsocketControllerBooter);
        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
            websocketControllers: {
                dirs: ['controllers'],
                extensions: ['.controller.ws.js'],
                nested: true,
            },
        };
    }
}
exports.TodoListApplication = TodoListApplication;
//# sourceMappingURL=application.js.map