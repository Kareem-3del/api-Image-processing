import sharp from 'sharp';
import fs from 'fs';
//import chalk from 'chalk';
import fileImage from '../interfaces/fileImage.interface';
import 'dotenv/config';

//Resize Image And Cashed it
type fileStatus = {
  fileName: string;
  height: number | string;
  width: number | string;
  quality: number | string;
};

const { IMAGE_OUTPUT, IMAGE_PATH } = process.env;

export let CheckerFolders = () => {
  if (!IMAGE_OUTPUT) throw 'PLEASE ADD .ENV IMAGE_OUTPUT PATH TO WORK';
  if (!IMAGE_PATH) throw 'PLEASE ADD .ENV IMAGE_OUTPUT PATH TO WORK';

  //CHECK IF FOLDER IS EXITS OR CREATE IT

  if (!fs.existsSync(IMAGE_PATH)) fs.mkdirSync(IMAGE_PATH);

  if (!fs.existsSync(IMAGE_OUTPUT)) fs.mkdirSync(IMAGE_OUTPUT);
};
CheckerFolders();
export function getFileName(
  file: fileStatus,
  isExits = false,
  OUTPUT: string = IMAGE_OUTPUT || ''
): { NAME: string; PATH: string; isExits?: boolean } {
  const FullName = `${file.fileName}[${file.height}x${file.width}][${file.quality}%].webp`; // RETURN NAME OF FILE TO SAVE READABLE FOR USER (:
  const FullPATH = `${OUTPUT}${FullName}`;
  return isExits
    ? { NAME: FullName, PATH: FullPATH, isExits: fs.existsSync(FullPATH) }
    : { NAME: FullName, PATH: FullPATH }; // RETURN IF EXITS WHEN CHECKED
}

export function resizeImage(
  fileImage: fileImage,
  outPath: string = IMAGE_OUTPUT || ''
): Promise<Buffer | Error> {
  return new Promise((resolve, reject) => {
    const { width, height, path, quality } = fileImage;
    sharp(path)
      .resize({
        width,
        height,
      })
      .webp({ quality })
      .toBuffer(function (err, image) {
        if (err) {
          return reject(err);
        }
        const fileName = getFileName(
          { fileName: fileImage.fileName, height, width, quality },
          false,
          outPath
        );
        fs.writeFile(fileName.PATH.toString(), image, function (err) {
          if (err) {
            // console.log('ERROR =>', err);
            return reject(err);
          } else {
            // console.log(chalk.bgCyan.black(`File Saved ${fileName.PATH}`));
          }
          return resolve(image);
        });
      });
  });
}

// RETURN IMAGES CASHED
export function imagesOptimized(
  path: string = IMAGE_OUTPUT || ''
): fileImage[] {
  const CheckPath = path.split(''); // CHECK IF PATH IS DIR OR NOT
  if (
    CheckPath[CheckPath.length - 1] == `/` ||
    CheckPath[CheckPath.length - 1] == `\\`
  )
    // CHANGE IT TO DIR
    path += '/';
  const files = fs.readdirSync(path); // READ FILES IN PATH
  return files
    .filter(function (file) {
      const values = file.split('['); // SPLIT VALUES
      return !(!values[1] || !values[2]); // CHECK IF VALUES LIKE HEIGHT AND WIDTH IS EXITS IN NAME
    })
    .map((file) => {
      let values = file.split('['); // SPLIT NAME TO GET HEIGHT, WIDTH AND QUALITY
      values = values.map((value) =>
        value
          .replace(']', '') // REPLACE THE ENDS OF '[',']' in NAME
          .replace('.webp', '') // REMOVE EXT OF FILE "" CASHED ALREADY WIDTH .WEBP
          .replace('%', '')
      ); // REMOVE % OF QUALITY IT ADD TO MAKE FILE NAME READABLE
      return {
        // RETURN fileImage TYPE
        file, // FILE NAME WITH EXT
        fileName: values[0], // FILE NAME
        height: Number(values[1].split('x')[0]) || 0, // HEIGHT
        width: Number(values[1].split('x')[1]) || 0, // WIDTH
        quality: Number(values[2]), // QUALITY
        path: `${path}${file}`, // PATH
      };
    });
}

// GET OPTIMIZED IMAG FROM CASHED
export function optimizedImage(fileImage: fileImage): Promise<Buffer | Error> {
  // RETURN PROMISE AS BUFFER OR ERROR
  return new Promise((resolve, reject) => {
    const filesOptimized = imagesOptimized(); // SEARCH IN OPTIMIZATION IMAGES CASHED
    const optimizedFile =
      filesOptimized[
        filesOptimized.findIndex(
          (file) =>
            fileImage.fileName === file.fileName && // CHECK IF NAME FOR FILE EXISTS
            fileImage.width === file.width && // CHECK IF WIDTH FOR FILE IS EXISTS
            fileImage.height === file.height && // CHECK IF HEIGHT FOR FILE IS EXISTS
            fileImage.quality === file.quality
        )
      ]; // CHECK IF QUALITY FOR FILE IS EXISTS
    if (optimizedFile)
      // SEARCH FOR IMAGE IS CASHED
      fs.readFile(optimizedFile.path, (err, file) =>
        err ? reject(err) : resolve(file)
      );
    //RETURN THE BUFFER IF NO ERROR
    else reject(Error('Not Found Cashed')); // NOT FOUND CASHED IMAGE
  });
}

// RETURN FILE , FILENAME , PATH , TYPE of All Files in FOLDER
export function imagesInFolder(
  pathFolder: string = IMAGE_PATH || ''
): Array<{ file: string; fileName: string; path: string; type: string }> {
  const types = ['png', 'jpg', 'webp'];

  const files = fs.readdirSync(pathFolder);
  const images = files.filter((file) => {
    const ext = file.split('.');
    return types.includes(ext[ext.length - 1]);
  });
  return images.map((file) => {
    const splitName = file.split('.');
    return {
      file,
      fileName: splitName[0],
      path: `${pathFolder}${file}`,
      type: splitName[splitName.length - 1],
    };
  });
}
