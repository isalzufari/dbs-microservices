const Hapi = require('@hapi/hapi');

const UsersService = require('./services/UsersService');

const api = require('./adapter/api');

const init = async () => {
  const usersService = new UsersService();
  const apiMovies = api('http://localhost:3002');

  const server = Hapi.server({
    port: '3001',
    host: 'localhost',
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
        response.code(201);
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
        const { data: movie } = await apiMovies.get(`/${id}`);

        const mapped = users.map((user) => ({
          username: user.username,
          movie: movie.title
        }));

        const response = h.response({
          status: 'success',
          data: mapped
        });
        response.code(201);
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