import supertest from 'supertest';
import server from '../../server';
import { getFileName } from '../../utils/ImageResizer';

const request = supertest(server.app);
describe('CHECK IMAGE PROCESSING', () => {
  let size = 0;
  it('CHECK IF IMAGE RESPONSE', (done) => {
    request.get('/image/fjord').then((response) => {
      expect(response.headers['content-type']).toBe('image/webp');
      size = Number(response.headers['content-length']) || 1;
      done();
    });
  });

  it('CHECK IF IMAGE SIZE MUST BE SMALLER BECAUSE THE SIZE IS SMALLER', (done) => {
    request.get('/image/fjord?w=100&h=100').then((response) => {
      expect(Number(response.headers['content-length']) || 0).toBeLessThan(
        size
      );
      done();
    });
  });

  it('CHECK NOT EXITS IMAGE RESPONSE', (done) => {
    request.get('/image/Random').then((response) => {
      // console.log(response.body)
      expect(response.body.message).toBe('IMAGE NOT FOUND');
      expect(response.statusCode).toBe(404);
      done();
    });
  });

  it('CHECK IF IMAGE CASHED', (done) => {
    const fileName = 'fjord';
    const height = 100,
      width = 100,
      quality = 50;
    request
      .get(
        `/image/${fileName}?width=${width}&height=${height}&quality=${quality}`
      )
      .then(() => {
        const status = getFileName({ fileName, height, width, quality }, true);
        expect(status.isExits).toBe(true);
        done();
      });
  });
});

describe('ROUTER AND SHORTCUT', function () {
  it('CHECK SHORTCUT ROUTES WIDTH (W)', (done) => {
    request.get('/image/fjord?w=200').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('CHECK SHORTCUT ROUTES WIDTH (WIDTH)', (done) => {
    request.get('/image/fjord?width=200').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('CHECK SHORTCUT ROUTES HEIGHT (H)', (done) => {
    request.get('/image/fjord?h=200').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('CHECK SHORTCUT ROUTES HEIGHT (HEIGHT)', (done) => {
    request.get('/image/fjord?h=200').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('CHECK SHORTCUT ROUTES Quality (Q)', (done) => {
    request.get('/image/fjord?q=60').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  it('CHECK SHORTCUT ROUTES Quality (Quality)', (done) => {
    request.get('/image/fjord?quality=80').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});

describe('VALIDATION OF IMAGE AND ERRORS', function () {
  it('CHECK VALIDATION OF IMAGE BY SEND Quality Greater Than 100 Like 120', (done) => {
    request.get('/image/fjord?quality=120').then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('CHECK VALIDATION OF IMAGE BY SEND Quality Less Than 0 Like -1', (done) => {
    request.get('/image/fjord?quality=-1').then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('CHECK VALIDATION OF IMAGE BY SEND STRING Like "Kareem"', (done) => {
    request.get('/image/fjord?height=Kareem').then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('CHECK VALIDATION OF IMAGE BY SEND Number -1', (done) => {
    request.get('/image/fjord?height=-1').then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});
