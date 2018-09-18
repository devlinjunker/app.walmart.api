//@flow
import { ProductsController } from './products.controller.js';

import { describe, it, afterEach, beforeEach } from 'mocha';
import { expect } from 'chai';
import _ from 'lodash';

var chai = require('chai');
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

import rp from 'request-promise';
const ratelimit = require('../../utility/ratelimit.js');

describe('Products Controller', () => {
  const items = [{
    itemId: '123',
    shortDescription: 'backpack',
    longDescription: ''
  }, {
    itemId: 'abc',
    shortDescription: 'purse',
    longDescription: ''
  }];

  describe('has endpoint that returns products matching keyword', () => {
    it('passes URL query string parameter to walmart API', async () => {
      const getStub = sinon.stub(rp, 'get');
      getStub.resolves(JSON.stringify({
        items
      }));

      let keyword = 'test';
      await ProductsController.FindProducts({
        query: {
          q: keyword
        }
      });

      expect(getStub).to.be.calledWithMatch(ProductsController.endpointPrefix + 'search', {
        qs: {
          apiKey: ProductsController.apiKey,
          query: keyword
        }
      });
      getStub.reset();
      getStub.resolves(JSON.stringify({
        items
      }));

      keyword = 'abc';
      await ProductsController.FindProducts({
        query: {
          q: keyword
        }
      });

      expect(getStub).to.be.calledWithMatch(ProductsController.endpointPrefix + 'search', {
        qs: {
          apiKey: ProductsController.apiKey,
          query: keyword
        }
      });
    });

    it('returns items from response', async () => {
      sinon.stub(rp, 'get').resolves(JSON.stringify({
        items
      }));

      const response = await ProductsController.FindProducts({
        query: {
          q: 'abc'
        }
      });

      expect(response).to.deep.equal(items);
    });
  });

  describe('has endpoint that returns product ids matching keywords', () => {
    it('calls FindProduct() endpoint', async () => {
      const findProductStub = sinon.stub(ProductsController, 'FindProducts').resolves(items);

      await ProductsController.FindProductIds({
        query: {
          q: 'abc'
        }
      });

      expect(findProductStub).to.be.called;
    });

    it('returns list of product ids', async () => {
      sinon.stub(ProductsController, 'FindProducts').resolves(items);

      const response = await ProductsController.FindProductIds({
        query: {
          q: 'abc'
        }
      });

      expect(response).to.deep.equal(_.map(items, 'itemId'));
    });
  });

  describe('has endpoint that checks each known item for matching keywords in product description', () => {

    beforeEach(() => {
      ProductsController.productList = [1, 2];
      sinon.stub(ratelimit, 'ratelimit').returns(() => {
        return new Promise((resolve) => {
          resolve();
        });
      });
    });

    it('calls walmart api with each product id', async () => {
      let getStub = sinon.stub(rp, 'get').resolves(JSON.stringify(items[0]));

      await ProductsController.CheckProducts({
        query: {
          q: 'backpack'
        }
      });

      expect(getStub.callCount).to.equal(ProductsController.productList.length);
    });

    it('returns product ids with keywords matching description', async () => {
      let getStub = sinon.stub(rp, 'get');
      getStub.onFirstCall().resolves(JSON.stringify(items[0]));
      getStub.onSecondCall().resolves(JSON.stringify(items[1]));

      const foundIds = await ProductsController.CheckProducts({
        query: {
          q: 'backpack'
        }
      });

      expect(foundIds).to.contain(items[0].itemId);
    });

    it('does not return product ids without keywords matching description', async () => {
      let getStub = sinon.stub(rp, 'get');
      getStub.resolves(JSON.stringify(items[0]));

      const foundIds = await ProductsController.CheckProducts({
        query: {
          q: 'test'
        }
      });

      expect(foundIds.length).to.equal(0);
    });
  });

  describe('has endpoint to retrieve object by id', () => {
    it('calls walmart api with id passed in via url parsing', async () => {
      let getStub = sinon.stub(rp, 'get');
      getStub.onFirstCall().resolves(JSON.stringify(items[0]));

      const productId = 'abc';
      const product = await ProductsController.getProduct({
        params: {
          id: productId
        }
      });

      expect(getStub).to.be.calledWith(ProductsController.endpointPrefix + 'items/' + productId, {
        qs: {
          apiKey: ProductsController.apiKey
        }
      });

      expect(product).to.deep.equal(items[0]);
    });
  });

  afterEach(() => {
    // Restore the default sandbox
    sinon.restore();
  });
});
