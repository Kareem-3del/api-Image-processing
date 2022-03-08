"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const Image_controller_1 = __importDefault(require("./controller/Image.controller"));
const hello_controller_1 = __importDefault(require("./controller/hello.controller"));
require("dotenv/config");
const server = new app_1.default([
    new hello_controller_1.default(),
    new Image_controller_1.default(),
]);
server.listen();
exports.default = server;
