import {Request, Response, Router} from 'express';
//import {ImageNotFoundException} from '../exceptions/Image.exception';
import Controller from '../interfaces/controller.interface';
import fs from "fs"
import sharp from 'sharp'
import chalk from "chalk";
import imageSize from 'image-size'

const imagesInFolder = () => {
    let files = fs.readdirSync("./images")
    return files.map(file => {
        let splitName = file.split('.')
        return {
            file,
            fileName: splitName[0],
            path: `./images/${file}`,
            type: splitName[splitName.length - 1]
        }
    })
}
const imagesOptimized = () => {
    let files = fs.readdirSync("./images/output/")
    return files.map(file => {
        let values = file.split('[')
        values = values.map(value =>
            value.replace(']', '')
                .replace('.webp', '')
                .replace('%', ''))
        return {
            file,
            fileName: values[0],
            height: Number(values[1].split('x')[0]) || 0,
            width: Number(values[1].split('x')[1]) || 0,
            quality: Number(values[2]),
            path: `./images/output/${file}`,
        }
    })
}

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

    private static async getImage(req: Request, res: Response) {
        let image: string = req.params.image,
            width: number = Number(req.query.width) || Number(req.query.w) || 0,
            height: number = Number(req.query.height) || Number(req.query.h) || 0,
            quality: number = Number(req.query.quality) || Number(req.query.q) || 100,
            files = imagesInFolder(),
            filesOptimized = imagesOptimized(),
            file = files[files.findIndex(f => image.split('.')[0] === f.fileName)] || false;



        if (!file) {
            return res.json({"err": "not found image", file})
        }else
        {
            //Check if Resized Options
            if (!height || !width) {
                let sizes = await imageSize(file.path);
                if (!height)
                    height = Number(sizes.height) || 0;
                if (!width)
                    width = Number(sizes.width) || 0;
                // console.log({height,width,sizes})
            }
            if(quality > 100)
                quality = 100
        }
        let optimizedFile = filesOptimized[filesOptimized.findIndex(f => f.fileName === file.fileName && width === f.width && height === f.height && quality === f.quality)]

        if (optimizedFile) {
            let file = await fs.readFileSync(optimizedFile.path)
            if (file) {
                res.header("content-type", "image/webp")
                return res.send(file)
            } else {
                //  console.log(file)
                console.log(`Error to get saved image ${optimizedFile.file}`)
            }
        }
        sharp(file.path).resize({
            width,
            height
        }).webp({quality}).toBuffer().then(image => {
            let fileName = `${file.fileName}[${height}x${width}][${quality}%].webp`
            fs.writeFile(`./images/output/${fileName}`, image, function (err) {
                (err) ? console.log(err) : console.log(chalk.bgBlack.white(`File Saved ${fileName}`))
            })
            res.header("content-type", "image/webp")
            res.send(image)
        });
    }

}

export default PostController;