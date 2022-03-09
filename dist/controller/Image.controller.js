"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const image_size_1 = __importDefault(require("image-size"));
const ImageResizer_1 = require("../utils/ImageResizer");
const chalk_1 = __importDefault(require("chalk"));
const image_exception_1 = require("../exceptions/image.exception");
class PostController {
    constructor() {
        this.path = '/image';
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, PostController.GetAllImages);
        this.router.get(`${this.path}/:image`, PostController.getImage);
    }
    static GetAllImages(req, res) {
        const files = (0, ImageResizer_1.imagesInFolder)();
        res.json(files);
    }
    static getImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = req.params.image;
            let width = Number(req.query.width) || Number(req.query.w) || 0, height = Number(req.query.height) || Number(req.query.h) || 0;
            const quality = Number(req.query.quality) || Number(req.query.q) || 100, files = (0, ImageResizer_1.imagesInFolder)(), file = files[files.findIndex(f => image.split('.')[0] === f.fileName)] ||
                false;
            if (!file) {
                return next(new image_exception_1.ImageNotFound());
            }
            else {
                //Check if Resized Options
                if (!height || !width) {
                    const sizes = yield (0, image_size_1.default)(file.path);
                    if (!height)
                        height = Number(sizes.height) || 0;
                    if (!width)
                        width = Number(sizes.width) || 0;
                }
            }
            const fileImage = Object.assign(Object.assign({}, file), { width, height, quality });
            try {
                res.header('Content-Type', 'image/webp');
                res.send(yield (0, ImageResizer_1.optimizedImage)(fileImage));
                console.log(chalk_1.default.green('success : Get file cashed faster performance [DONE]'));
            }
            catch (err) {
                console.log(chalk_1.default.yellow('warning : Not found cashed reprocessing image....'));
                (0, ImageResizer_1.resizeImage)(fileImage).then((image) => {
                    res.header('Content-Type', 'image/webp');
                    res.send(image);
                }).catch(err => {
                    next(err);
                });
            }
        });
    }
}
exports.default = PostController;
