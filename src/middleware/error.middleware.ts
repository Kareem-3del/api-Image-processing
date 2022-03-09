import { Request, Response , NextFunction } from 'express';
import HttpException from '../exceptions/http.exception';

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  nextFunc : NextFunction
) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  response.status(status).send({
    message,
    status,
  });
  nextFunc()
}

export default errorMiddleware;
