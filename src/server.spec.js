import Server from './server.js';

import { describe, it, afterEach } from 'mocha';
import { expect } from 'chai';

const _ = require('lodash');

var chai = require('chai');
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

const Hapi = require('hapi');

describe('Server', () => {
  it('initializes a server on creation', () => {
    let serverSpy = sinon.spy(Hapi, 'server');

    let server = new Server();

    expect(serverSpy).to.be.calledWith({
      port: 3333,
      host: 'localhost'
    });

    expect(server.server).to.not.be.undefined;
  });

  describe('has method to start server', () => {
    it('starts server on run()', async () => {
      let startSpy = sinon.spy();
      sinon.stub(Hapi, 'server').returns({
        start: startSpy,
        register: sinon.fake(),
        info: {
          port: 3333
        },
      });

      let server = new Server();
      await server.run();

      expect(startSpy).to.be.calledOnce;
    });
  });

  describe('has method to add endpoint', () => {
    const endpoint = {
      method: 'GET',
      path: 'test/test',
      controller: () => {

      }
    };

    it('must be called after run()', () => {
      let server = new Server();

      let error = false;
      try {
        server.addEndpoint(endpoint);
      } catch (e) {
        error = true;
      }

      expect(error).to.be.true;
    });

    it('calls server.route() with endpoint parameters', async () => {
      let routeSpy = sinon.spy();
      sinon.stub(Hapi, 'server').returns({
        start: sinon.fake(),
        register: sinon.fake(),
        info: {
          port: 3333
        },
        route: routeSpy,
      });

      let server = new Server();
      await server.run();

      server.addEndpoint(endpoint);

      expect(routeSpy).to.be.calledWithMatch({
        method: 'GET',
        path: 'test/test',
        handler: endpoint.controller
      });
    });
  });

  describe('has method to add multiple endpoints at once', async () => {
    it('calls route with each endpoint', async () => {
      const endpoint = {
        method: 'GET',
        path: 'test/test',
        controller: () => {

        }
      };
      const endpoints = [endpoint, _.clone(endpoint)];
      endpoints[1].path = 'test2';

      let routeSpy = sinon.spy();
      sinon.stub(Hapi, 'server').returns({
        start: sinon.fake(),
        register: sinon.fake(),
        info: {
          port: 3333
        },
        route: routeSpy,
      });

      let server = new Server();
      await server.run();

      server.addEndpoints(endpoints);

      expect(routeSpy.firstCall).to.be.calledWithMatch({
        method: 'GET',
        path: 'test/test',
        handler: endpoint.controller
      });

      expect(routeSpy.secondCall).to.be.calledWithMatch({
        method: 'GET',
        path: 'test2',
        handler: endpoint.controller
      });
    });
  });

  afterEach(() => {
    // Restore the default sandbox
    sinon.restore();
  });
});
