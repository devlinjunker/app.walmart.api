//@flow
require('babel-core/register');
require('babel-polyfill');

import Server from './server.js';

const server = new Server();

import infoRoutes from './controllers/info.controller.js';
import helloRoutes from './controllers/hello.controller.js';

let routes = infoRoutes.concat(helloRoutes);

server.run().then(() => {

  server.addEndpoints(routes);
});

process.on('unhandledRejection', (err) => {
  process.stdout.write(err);
  process.exit(1);
});
