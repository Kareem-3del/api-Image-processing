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
// import chalk from 'chalk';
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
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const image = req.params.image;
            let width = ((_a = req.query.width) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = req.query.w) === null || _b === void 0 ? void 0 : _b.toString()), height = ((_c = req.query.height) === null || _c === void 0 ? void 0 : _c.toString()) || ((_d = req.query.h) === null || _d === void 0 ? void 0 : _d.toString()), quality = ((_e = req.query.quality) === null || _e === void 0 ? void 0 : _e.toString()) || ((_f = req.query.q) === null || _f === void 0 ? void 0 : _f.toString());
            // Validation OF Values
            if (width && !Number(width)) {
                return next(new image_exception_1.ValueNotNumber('Width'));
            }
            else {
                if (width) {
                    width = Number(width);
                }
                else {
                    width = 0;
                }
            }
            if (height && !Number(height)) {
                return next(new image_exception_1.ValueNotNumber('Height'));
            }
            else {
                if (height) {
                    height = Number(height);
                }
                else {
                    height = 0;
                }
            }
            if (quality && !Number(quality)) {
                return next(new image_exception_1.ValueNotNumber('Quality'));
            }
            else {
                if (quality) {
                    quality = Number(quality);
                }
                else {
                    quality = 100;
                }
            }
            if (width < 0)
                return next(new image_exception_1.WidthLessThanZero());
            if (height < 0)
                return next(new image_exception_1.HeightLessThanZero());
            if (quality < 1 || quality > 100)
                return next(new image_exception_1.QualityError());
            // Validation OF Values
            const files = (0, ImageResizer_1.imagesInFolder)(), file = files[files.findIndex((f) => image.split('.')[0] === f.fileName)] ||
                false;
            if (!file) {
                return next(new image_exception_1.NotFoundImage());
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
                //  console.log(chalk.green('success : Get file cashed faster performance [DONE]'));
            }
            catch (err) {
                //   console.log(chalk.yellow('warning : Not found cashed reprocessing image....'));
                (0, ImageResizer_1.resizeImage)(fileImage)
                    .then((image) => {
                    res.header('Content-Type', 'image/webp');
                    res.send(image);
                })
                    .catch((err) => {
                    next(err);
                });
            }
        });
    }
}
exports.default = PostController;
