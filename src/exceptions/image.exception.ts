import HttpException from './http.exception';

class HeightLessThanZero extends HttpException {
  constructor() {
    super(400, 'HEIGHT IS LESS THAN 0');
  }
}

class WidthLessThanZero extends HttpException {
  constructor() {
    super(400, 'WIDTH IS LESS THAN 0');
  }
}

class ValueNotNumber extends HttpException {
  constructor(Type: 'Width' | 'Height' | 'Quality') {
    super(400, `${Type.toUpperCase()} IS NOT NUMBER`);
  }
}

class QualityError extends HttpException {
  constructor() {
    super(400, `Quality Must Greater THAN 0 And Less Then 100`);
  }
}

class NotFoundImage extends HttpException {
  constructor() {
    super(404, 'IMAGE NOT FOUND');
  }
}

export {
  NotFoundImage,
  QualityError,
  ValueNotNumber,
  WidthLessThanZero,
  HeightLessThanZero,
};
