import Controller from "../interfaces/controller.interface";
import {Request, Response, Router} from 'express';
import fs from "fs";

class HelloController implements Controller {
    public path = '/';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, HelloController.sayHello);
    }

    private static sayHello(req: Request, res: Response) {
        let {IMAGE_PATH, IMAGE_OUTPUT, SERVER_PORT} = process.env
        IMAGE_OUTPUT = IMAGE_OUTPUT || "./images/output/"
        IMAGE_PATH = IMAGE_PATH || "./images/"
        let IMAGE_OUTPUT_STATUS = {
            PATH: IMAGE_OUTPUT,
            isFound: fs.existsSync(String(IMAGE_OUTPUT))
        }
        let IMAGE_PATH_STATUS = {
            PATH: IMAGE_PATH,
            isFound: fs.existsSync(String(IMAGE_PATH))
        }
        res.json({
            status: res.statusCode,
            message: `API ${(IMAGE_PATH_STATUS.isFound && IMAGE_OUTPUT_STATUS.isFound) ? "READY" : "NOT READY"}`,
            config: {
                SERVER_PORT,
                IMAGE_OUTPUT_STATUS,
                IMAGE_PATH_STATUS
            },
        })
    }
}

export default HelloController