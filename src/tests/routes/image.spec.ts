import supertest from 'supertest';
import server from '../../server';
import { getFileName } from '../../utils/ImageResizer';

const request = supertest(server.app);
describe('CHECK IMAGE PROCTORING', () => {
  let size = 0;
  it('CHECK IF IMAGE RESPONSE', done => {
    request.get('/image/fjord').then(response => {
      expect(response.headers['content-type']).toBe('image/webp');
      size = response.headers['content-type'];
      done();
    });
  });

  it('CHECK IF IMAGE SIZE MUST BE SMALLER BECAUSE THE SIZE IS SMALLER', done => {
    request.get('/image/fjord?w=100&h=100').then(response => {
      expect(response.headers['content-length']).toBeLessThan(size);
      done();
    });
  });

  it('CHECK NOT EXITS IMAGE RESPONSE', done => {
    request.get('/image/Random').then(response => {
      console.log(response.body)
      expect(response.body.message).toBe('IMAGE NOT FOUND');
      expect(response.statusCode).toBe(404);
      done();
    });
  });

  it('CHECK SHORTCUT ROUTES WIDTH (W)', done => {
    request.get('/image/fjord?w=200').then(response => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });


  it('CHECK SHORTCUT ROUTES WIDTH (WIDTH)', done => {
    request.get('/image/fjord?width=200').then(response => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('CHECK SHORTCUT ROUTES HEIGHT (H)', done => {
    request.get('/image/fjord?h=200').then(response => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });


  it('CHECK SHORTCUT ROUTES HEIGHT (HEIGHT)', done => {
    request.get('/image/fjord?height=200').then(response => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });



  it('CHECK IF IMAGE CASHED', done => {
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
