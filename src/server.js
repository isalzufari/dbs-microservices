require('dotenv').config();
const Hapi = require('@hapi/hapi');

const UsersService = require('./services/UsersService');

const api = require('./adapter/api');

const init = async () => {
  const usersService = new UsersService();
  const apiMovies = api(`http://${process.env.API_MOVIES}`);

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*']
      },
    },
  });

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: async (requst, h) => {
        const users = await usersService.getUsers();

        const response = h.response({
          status: 'success',
          data: users
        });
        response.code(200);
        return response;
      }
    },
    {
      method: 'GET',
      path: '/{id}',
      options: {
        log: {
          collect: true
        }
      },
      handler: async (requst, h) => {
        const { id } = requst.params;
        const users = await usersService.getUserById(id);

        const { movie: id_movie } = users[0];
        const { data: movie } = await apiMovies.get(`/${id_movie}`);

        const mapped = users.map((user) => ({
          username: user.name,
          movie: movie.title
        }));

        const response = h.response({
          status: 'success',
          data: mapped
        });
        response.code(200);
        return response;
      }
    },
  ]);

  server.events.on('log', (event, tags) => {
    if (tags.error) {
      console.log(`Server error: ${event.error ? event.error.message : 'unknown'}`);
    }
  });
  await server.start();
  console.log(`Running on ${server.info.uri}`);
}

init();