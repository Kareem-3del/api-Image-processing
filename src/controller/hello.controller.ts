import Controller from '../interfaces/controller.interface';
import { Request, Response, Router } from 'express';
import fs from 'fs';

class HelloController implements Controller {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, HelloController.sayHello);
  }

  private static sayHello(req: Request, res: Response): void {
    const SERVER_PORT = process.env.SERVER_PORT;
    let { IMAGE_PATH, IMAGE_OUTPUT } = process.env;
    IMAGE_OUTPUT = IMAGE_OUTPUT || './images/output/';
    IMAGE_PATH = IMAGE_PATH || './images/';
    const IMAGE_OUTPUT_STATUS = {
      PATH: IMAGE_OUTPUT,
      isFound: fs.existsSync(String(IMAGE_OUTPUT)),
    };
    const IMAGE_PATH_STATUS = {
      PATH: IMAGE_PATH,
      isFound: fs.existsSync(String(IMAGE_PATH)),
    };
    res.json({
      status: res.statusCode,
      message: `API ${
        IMAGE_PATH_STATUS.isFound && IMAGE_OUTPUT_STATUS.isFound
          ? 'READY'
          : 'NOT READY'
      }`,
      config: {
        SERVER_PORT,
        IMAGE_OUTPUT_STATUS,
        IMAGE_PATH_STATUS,
      },
    });
  }
}

export default HelloController;
