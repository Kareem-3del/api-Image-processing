import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import imageSize from 'image-size';
import {
  imagesInFolder,
  optimizedImage,
  resizeImage,
} from '../utils/ImageResizer';
// import chalk from 'chalk';
import {
  HeightLessThanZero,
  NotFoundImage,
  QualityError,
  ValueNotNumber,
  WidthLessThanZero,
} from '../exceptions/image.exception';

class PostController implements Controller {
  public path = '/image';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, PostController.GetAllImages);
    this.router.get(`${this.path}/:image`, PostController.getImage);
  }

  private static GetAllImages(req: Request, res: Response): void {
    const files = imagesInFolder();
    res.json(files);
  }

  private static async getImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const image: string = req.params.image;
    let width: string | number | undefined =
        req.query.width?.toString() || req.query.w?.toString(),
      height: string | number | undefined =
        req.query.height?.toString() || req.query.h?.toString(),
      quality: string | number | undefined =
        req.query.quality?.toString() || req.query.q?.toString();

    // Validation OF Values

    if (width && !Number(width)) {
      return next(new ValueNotNumber('Width'));
    } else {
      if (width) {
        width = Number(width);
      } else {
        width = 0;
      }
    }
    if (height && !Number(height)) {
      return next(new ValueNotNumber('Height'));
    } else {
      if (height) {
        height = Number(height);
      } else {
        height = 0;
      }
    }
    if (quality && !Number(quality)) {
      return next(new ValueNotNumber('Quality'));
    } else {
      if (quality) {
        quality = Number(quality);
      } else {
        quality = 100;
      }
    }

    if (width < 0) return next(new WidthLessThanZero());

    if (height < 0) return next(new HeightLessThanZero());

    if (quality < 1 || quality > 100) return next(new QualityError());

    // Validation OF Values

    const files = imagesInFolder(),
      file =
        files[files.findIndex((f) => image.split('.')[0] === f.fileName)] ||
        false;

    if (!file) {
      return next(new NotFoundImage());
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
      //  console.log(chalk.green('success : Get file cashed faster performance [DONE]'));
    } catch (err) {
      //   console.log(chalk.yellow('warning : Not found cashed reprocessing image....'));
      resizeImage(fileImage)
        .then((image) => {
          res.header('Content-Type', 'image/webp');
          res.send(image);
        })
        .catch((err) => {
          next(err);
        });
    }
  }
}

export default PostController;
