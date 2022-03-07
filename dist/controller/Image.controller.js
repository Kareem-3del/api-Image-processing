"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class PostController {
    constructor() {
        this.path = '/image';
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.GetAllImages);
    }
    GetAllImages(req, res) {
    }
}
exports.default = PostController;
