//@flow
require('babel-core/register');
require('babel-polyfill');

import Server from './server.js';

const server = new Server();

server.run().then(() => {
  server.addEndpoint({
    method: 'GET',
    path: '/hello',
    controller: () => {
      return 'hello!';
    }
  });
});

process.on('unhandledRejection', (err) => {
  process.stdout.write(err);
  process.exit(1);
});
