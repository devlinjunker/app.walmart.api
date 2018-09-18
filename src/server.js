//@flow
require('babel-core/register');
require('babel-polyfill');

const Pino = require('hapi-pino');
const Hapi = require('hapi');

export interface Endpoint {
  method: string;
  path: string;
  controller: Function;
}

/**
 * Server class that starts and initializes Hapi server
 */
export default class Server {
  server: any;
  _initialized: boolean;

  constructor() {
    this.server = Hapi.server({
      port: 3333,
      host: 'localhost'
    });
  }

  /**
   * Starts the server and registers any plugins
   * @return {Promise} Resolves once server has started
   */
  async run() {
    await this.server.start();
    /// process.stdout.write('Server started on ' + this.server.info.port);

    // Add Access Logger
    await this.server.register({
      plugin: Pino,
      options: {
        prettyPrint: false,
        logEvents: ['response']
      }
    });

    this._initialized = true;
  }

  /**
   * Adds an endpoint at the path given handled by the controller
   * @param {string} method     HTTP method the endpoint must be called with to trigger controller
   * @param {string} path       URL path of endpoint
   * @param {Function} controller Handler function that is triggered when endpoint is hit
   */
  addEndpoint({ method, path, controller }: Endpoint) {
    if(this._initialized) {
      this.server.route({
        method,
        path,
        handler: controller,
        options: {
          cors: true
        }
      });
    } else {
      throw new Error('Must initialize server');
    }
  }

  /**
   * Adds the endpoints given to the server
   * @param {Array<Endpoint>} routes Routes to add to the server
   */
  addEndpoints(routes: Array<Endpoint>) {
    for(var i = 0; i < routes.length; i++) {
      this.addEndpoint(routes[i]);
    }
  }
}
