"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorMiddleware(error, request, response, nextFunc) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response.status(status).send({
        message,
        status,
    });
    nextFunc();
}
exports.default = errorMiddleware;
