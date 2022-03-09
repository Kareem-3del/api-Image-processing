import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import imageSize from 'image-size';
import {
  imagesInFolder,
  optimizedImage,
  resizeImage,
} from '../utils/ImageResizer';
import chalk from 'chalk';
import { ImageNotFound } from '../exceptions/image.exception';

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
    const files = imagesInFolder();
    res.json(files);
  }

  private static async getImage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const image: string = req.params.image;
    let width: number = Number(req.query.width) || Number(req.query.w) || 0,
      height: number = Number(req.query.height) || Number(req.query.h) || 0;
    const quality: number =
        Number(req.query.quality) || Number(req.query.q) || 100,
      files = imagesInFolder(),
      file =
        files[files.findIndex(f => image.split('.')[0] === f.fileName)] ||
        false;

    if (!file) {
      return next(new ImageNotFound());
    } else {
      //Check if Resized Options

      if (!height || !width) {
        const sizes = await imageSize(file.path);
        if (!height) height = Number(sizes.height) || 0;
        if (!width) width = Number(sizes.width) || 0;
      }
    }
    const fileImage = { ...file, width, height, quality };

    try {
      res.header('Content-Type', 'image/webp');
      res.send(await optimizedImage(fileImage));
      console.log(
        chalk.green('success : Get file cashed faster performance [DONE]')
      );
    } catch (err) {
      console.log(chalk.yellow('warning : Not found cashed reprocessing image....'));
      resizeImage(fileImage).then((image)=>{
        res.header('Content-Type', 'image/webp');
        res.send(image);
      }).catch(err=>{
        next(err);
      })
    }
  }
}

export default PostController;
