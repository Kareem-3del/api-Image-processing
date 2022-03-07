import App from './app';
import ImageController from './controller/Image.controller';
import 'dotenv/config';

const app = new App(
    [
        new ImageController(),
    ]
);
app.listen()