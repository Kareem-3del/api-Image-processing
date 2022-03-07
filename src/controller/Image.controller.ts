import {NextFunction, Request, Response, Router} from 'express';
import Controller from '../interfaces/controller.interface';
import imageSize from 'image-size'
import {imagesInFolder, optimizedImage, resizeImage} from '../utils/ImageResizer';
import chalk from "chalk";


class PostController implements Controller {
    public path = '/image';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, PostController.GetAllImages);
        this.router.get(`${this.path}/:image`, PostController.getImage);

    }


    private static GetAllImages(req: Request, res: Response) {
        let files = imagesInFolder()
        res.json(files)
    }

    private static async getImage(req: Request, res: Response, next: NextFunction) {
        let image: string = req.params.image,
            width: number = Number(req.query.width) || Number(req.query.w) || 0,
            height: number = Number(req.query.height) || Number(req.query.h) || 0,
            quality: number = Number(req.query.quality) || Number(req.query.q) || 100,
            files = imagesInFolder(),
            file = files[files.findIndex(f => image.split('.')[0] === f.fileName)] || false;

        if (!file) {
            return res.json({"err": "not found image", file})
        } else {
            //Check if Resized Options


            if (!height || !width) {
                let sizes = await imageSize(file.path);
                if (!height)
                    height = Number(sizes.height) || 0;
                if (!width)
                    width = Number(sizes.width) || 0;
            }


            if (quality > 100)
                quality = 100


        }
        let fileImage = {...file, width, height, quality}

        try {
            res.header("Content-Type", "image/webp")
            res.send(await optimizedImage(fileImage))
            console.log(chalk.bgGreen.black("success : Get file cashed faster performance [DONE]"))
        } catch (err) {
            console.log(chalk.bgYellow.black("warning : Not found cashed reprocessing image...."))
            try {
                res.header("Content-Type", "image/webp")
                res.send(await resizeImage(fileImage))
            } catch (err) {
                next(err)
            }
        }


    }

}

export default PostController;