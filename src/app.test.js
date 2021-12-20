const request = require('supertest');
const app = require('./app');

describe('Test the root path', () => {
  it('GET /sauces will return an array of sauces', () =>
    request(app)
      .get('/sauces')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data.sauces).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              __v: expect.any(Number),
              _id: expect.any(String),
              name: expect.any(String),
            }),
          ])
        );
      }));
});
