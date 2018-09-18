//@flow
import { ProductsController } from './products.controller.js';

import { describe, it, afterEach } from 'mocha';
import { expect } from 'chai';

var chai = require('chai');
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

import rp from 'request-promise';

describe('Products Controller', () => {
  describe('has endpoint FindProducts()', () => {

    const items = [{
      itemId: '123'
    }];

    it('passes URL query string parameter to walmart API', async () => {
      const getStub = sinon.stub(rp, 'get');
      getStub.resolves(JSON.stringify({
        items
      }));

      await ProductsController.FindProducts({
        query: {
          q: 'keyword'
        }
      });

      expect(getStub).to.be.called;
    });

    it('returns items from response', async () => {
      sinon.stub(rp, 'get').resolves(JSON.stringify({
        items
      }));
    });
  });

  afterEach(() => {
    // Restore the default sandbox
    sinon.restore();
  });
});
