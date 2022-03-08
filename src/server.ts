import App from './app';
import ImageController from './controller/Image.controller';
import HelloController from "./controller/hello.controller";

import 'dotenv/config';

const server = new App(
    [
        new HelloController(),
        new ImageController(),
    ]
);
server.listen()

export default server;