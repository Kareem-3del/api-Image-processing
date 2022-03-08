import HttpException from './http.exception';

class ImageNotFound extends HttpException {
    constructor() {
        super(404, 'IMAGE NOT FOUND');
    }
}

export {ImageNotFound};