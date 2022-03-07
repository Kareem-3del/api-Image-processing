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
        let files = (0, ImageResizer_1.imagesInFolder)();
        res.json(files);
    }
    static getImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let image = req.params.image, width = Number(req.query.width) || Number(req.query.w) || 0, height = Number(req.query.height) || Number(req.query.h) || 0, quality = Number(req.query.quality) || Number(req.query.q) || 100, files = (0, ImageResizer_1.imagesInFolder)(), file = files[files.findIndex(f => image.split('.')[0] === f.fileName)] || false;
            if (!file) {
                return res.json({ "err": "not found image", file });
            }
            else {
                //Check if Resized Options
                if (!height || !width) {
                    let sizes = yield (0, image_size_1.default)(file.path);
                    if (!height)
                        height = Number(sizes.height) || 0;
                    if (!width)
                        width = Number(sizes.width) || 0;
                }
                if (quality > 100)
                    quality = 100;
            }
            let fileImage = Object.assign(Object.assign({}, file), { width, height, quality });
            let cashedImage = yield (0, ImageResizer_1.optimizedImage)(fileImage);
            if (cashedImage) {
            }
            else {
                yield (0, ImageResizer_1.resizeImage)(fileImage, "");
            }
        });
    }
}
exports.default = PostController;
