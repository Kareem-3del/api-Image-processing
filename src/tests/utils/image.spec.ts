import 'dotenv';
import {
  resizeImage,
  imagesInFolder,
  CheckerFolders,
} from '../../utils/ImageResizer';
import fs from 'fs';
import 'dotenv';

const { IMAGE_OUTPUT, IMAGE_PATH } = process.env;

describe('CHECK IMAGE PROCESSING', () => {
  it('CHECK IF FUNC EXITS FOLDERS', function (done) {
    CheckerFolders();
    expect(
      fs.existsSync(IMAGE_OUTPUT || '') && fs.existsSync(IMAGE_PATH || '')
    ).toBeTrue();
    done();
  });

  const IMAGE = imagesInFolder()[0];
  if (!IMAGE) {
    throw 'NO IMAGES IN FOLDER TO RUN THE TEST';
  }
  it('TEST FUNCTION IMAGE PROCESSING', function (done) {
    resizeImage({ ...IMAGE, height: 100, width: 100, quality: 100 })
      .then((IMAGE) => {
        expect(!!IMAGE).toBeTrue();
        done();
      })
      .catch((err) => {
        done.fail(err);
      });
  });
});
