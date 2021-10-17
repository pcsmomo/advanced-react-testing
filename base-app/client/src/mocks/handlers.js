import { rest } from 'msw';

import { baseUrl, endpoints } from '../app/axios/constants';
import { bandUrl } from '../features/band/redux/bandApi';
import { showsUrl } from '../features/tickets/redux/showApi';
import { bands, shows } from '../test-utils/fake-data';

const authHandler = (req, res, ctx) => {
  const { email } = req.body;
  return res(
    ctx.json({
      user: {
        id: 123,
        email,
        token: 'abc123',
      },
    })
  );
};

export const handlers = [
  rest.get(showsUrl, (req, res, ctx) => {
    return res(ctx.json({ shows }));
  }),
  rest.get(`${bandUrl}/:bandId`, (req, res, ctx) => {
    const { bandId } = req.params;
    return res(
      ctx.json({
        // bandId is conveniently the index in the bands array
        // band: bands[bandId],
        band: bands.find((band) => band.id === parseInt(bandId, 10)),
      })
    );
  }),
  rest.get(`${showsUrl}/:showId`, (req, res, ctx) => {
    const { showId } = req.params;
    return res(
      ctx.json({
        // showId is conveniently the index in the shows array
        // show: shows[showId],
        show: shows.find((show) => show.id === parseInt(showId, 10)),
      })
    );
  }),

  // [MSW] Warning: captured a request without a matching request handler:
  //     • PATCH http://localhost:3030/shows/0/hold/54267052
  rest.patch(`${showsUrl}/:showId/hold/:holdId`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post(`${baseUrl}/${endpoints.signIn}`, authHandler),
  rest.post(`${baseUrl}/${endpoints.signUp}`, authHandler),
];
