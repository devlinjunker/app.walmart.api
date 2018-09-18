//@flow
require('babel-core/register');
require('babel-polyfill');

import Server from './server.js';

const server = new Server();

import helloRoutes from './controllers/hello.js';
server.run().then(() => {

  server.addEndpoints(helloRoutes);
});

process.on('unhandledRejection', (err) => {
  process.stdout.write(err);
  process.exit(1);
});
