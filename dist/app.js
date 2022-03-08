"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const chalk_1 = __importDefault(require("chalk"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
class App {
    constructor(controllers) {
        this.app = (0, express_1.default)();
        const { PORT, DOMAIN } = process.env;
        this.domain = DOMAIN || "localhost";
        this.port = PORT || 8000;
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.default);
    }
    // initialize
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
    // Run Server
    listen() {
        const http_ = http_1.default.createServer(this.app).listen(this.port);
        (http_.listening) ?
            console.log(chalk_1.default.bgGreen.black(`SERVER CONNECTED ON [${(this.port == 80) ? "HTTP" : this.port}] => [${(http_.listening).toString().toUpperCase()}]`)) :
            console.log(chalk_1.default.bgRed.black(`SERVER CONNECTED ON [${(this.port == 80) ? "HTTP" : this.port}] => [${(http_.listening).toString().toUpperCase()}]`));
        /*      this.app.listen(this.port,()=>{
               console.log(chalk.green(`SERVER CONNECTED ON [${chalk.blue((this.port == 80) ? "HTTP" : this.port)}]`));
           })*/
    }
}
exports.default = App;
