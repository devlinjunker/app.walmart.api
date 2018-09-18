//@flow
import { ProductsController } from './products.controller.js';

import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Products Controller', () => {
  describe('has endpoint FindProducts()', () => {
    it('passes URL query string parameter to walmart API', async () => {
      const returned = await ProductsController.FindProducts({
        query: {
          q: 'keyword'
        }
      });

      expect(returned).to.equal(['keyword']);
    });
  });
});
