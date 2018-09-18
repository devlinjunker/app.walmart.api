//@flow
require('babel-core/register');
require('babel-polyfill');

import _ from 'lodash';

import rp from 'request-promise';

const apiKey = 'kjybrqfdgp3u4yv2qzcnjndj';

/**
 * Walmart Product API Controller
 */
export class ProductsController {
  /**
   * Takes the q parameter from the query string and passes to walmart API as the keyword
   * @param  {RequestParams}  request request parameters
   * @return {Promise}        resolves once returning the results from walmart API
   */
  static async FindProducts(request: any) {
    const keywordString = request.query.q;

    const response = JSON.parse(await rp.get('http://api.walmartlabs.com/v1/search', {
      q: {
        apiKey,
        query: keywordString
      }
    }));

    return response.items;
  }

  /**
   * Uses the q parameter of query string and returns a list of IDs of products returned from walmart API
   * @param  {RequestParams}  request request parameters
   * @return {Promise}         resolves once returning the product ids matching the keyword
   */
  static async FindProductIds(request: any) {
    const response = await ProductsController.FindProducts(request);

    return _.map(response, 'itemId');
  }
}

export default [
  {
    path: '/walmart/products',
    method: 'GET',
    controller: ProductsController.FindProducts
  },
  {
    path: '/walmart/product/ids',
    method: 'GET',
    controller: ProductsController.FindProductIds
  }
];
