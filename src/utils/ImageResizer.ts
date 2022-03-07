import sharp from "sharp";
import fs from "fs";
import chalk from "chalk";
import fileImage from "../interfaces/fileImage.interface";
//Resize Image And Cashed it

let outputAuto :string = process.env.outPutImages || "./images/output/",
    pathAuto :string = process.env.pathImages || "./images/"

export function resizeImage(fileImage: fileImage, outPath: string = outputAuto) : Promise<Buffer|Error> {
    let CheckPath = outPath.split('')
    if(CheckPath[CheckPath.length - 1] !== `/` || CheckPath[CheckPath.length - 1] !== `\\`)
        outPath += '/'
    return new Promise((resolve, reject) => {
        let {width, height, path, quality} = fileImage
        sharp(path).resize({
            width,
            height
        }).webp({quality}).toBuffer().then(image => {
            let fileName = `${fileImage.fileName}[${height}x${width}][${quality}%].webp`
            fs.writeFile(`${outPath}${fileName}`, image, function (err) {
                if (err) {
                    console.log("ERROR =>",err)
                    return reject(err)
                } else {
                    console.log(chalk.bgCyan.black(`File Saved ${fileName}`))
                }
                return resolve(image)
            })
        });
    })
}

export function imagesOptimized(path:string = outputAuto) : fileImage[]{
    let CheckPath = path.split('')
    if(CheckPath[CheckPath.length - 1] == `/` || CheckPath[CheckPath.length - 1] == `\\`)
        path += '/'

    let files = fs.readdirSync(path)
   // console.log(files)
    return files.filter(function (file) {
        let values = file.split('[')
        return !(!values[1] || !values[2]);
    }).map(file => {
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
            path: `${path}${file}`,
        }
    })
}

export function optimizedImage(fileImage: fileImage) : Promise<Buffer|Error> {
    return new Promise((async (resolve, reject) => {
        let filesOptimized = imagesOptimized();
        let optimizedFile = filesOptimized[filesOptimized.findIndex(file => fileImage.fileName === file.fileName && fileImage.width === file.width && fileImage.height === file.height && fileImage.quality === file.quality)]
        if (optimizedFile) {
            let file = await fs.readFileSync(optimizedFile.path)
            if (file) {
              return resolve(file)
            }
        }
        reject(Error("Not Found Cashed"))
    }))
}

export function imagesInFolder(pathFolder:string = pathAuto) : Array<{file : string, fileName : string , path : string , type : string}>{
    let CheckPath = pathFolder.split('')
    if(CheckPath[CheckPath.length - 1] !== `/` || CheckPath[CheckPath.length - 1] !== `\\`)
        pathFolder += '/'
    let files = fs.readdirSync(pathFolder)
    return files.map(file => {
        let splitName = file.split('.')
        return {
            file,
            fileName: splitName[0],
            path: `${pathFolder}${file}`,
            type: splitName[splitName.length - 1]
        }
    })
}
