//@flow
require('babel-core/register');
require('babel-polyfill');

const ratelimit = require('../../utility/ratelimit.js').ratelimit;

import _ from 'lodash';
import rp from 'request-promise';

/**
 * Walmart Product API Controller
 */
export class ProductsController {

  static endpointPrefix = 'http://api.walmartlabs.com/v1/';
  static apiKey: string = 'kjybrqfdgp3u4yv2qzcnjndj';
  static productList = [
    14225185,
    14225186,
    14225188,
    14225187,
    39082884,
    30146244,
    12662817,
    34890820,
    19716431,
    42391766,
    35813552,
    40611708,
    40611825,
    36248492,
    44109840,
    23117408,
    35613901,
    42248076
  ];

  /**
   * Takes the q parameter from the query string and passes to walmart API as the keyword
   * @param  {RequestParams}  request request parameters
   * @return {Promise}        resolves once returning the results from walmart API
   */
  static async FindProducts(request: any) {
    const keywordString = request.query.q;

    const response = JSON.parse(await rp.get(ProductsController.endpointPrefix + 'search/', {
      qs: {
        apiKey: ProductsController.apiKey,
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

  /**
   * Iterates through the list of ids given by the project challenge and checks the item descriptions for the keyword
   * @param  {RequestParams}  request request parameters
   * @return {Promise}         resolves once the product ids have each been searched and returns the matching IDs
   */
  static async CheckProducts(request: any) {
    const keywordString = request.query.q;
    const endpoint = ProductsController.endpointPrefix + 'items/';

    const throttle = ratelimit(200);
    const found = [];
    for(let i = 0; i < ProductsController.productList.length; i++){
      const id = ProductsController.productList[i];
      await throttle();
      const obj = await rp.get(endpoint+id, {
        qs: {
          apiKey: ProductsController.apiKey,
        }
      });

      const product = JSON.parse(obj);
      const productDescription = product.shortDescription + ':' + product.longDescription;

      const keywordArr = keywordString.split(' ');
      for(let i = 0; i < keywordArr.length; i++){
        if(productDescription.toLowerCase().indexOf(keywordArr[i].toLowerCase()) !== -1) {
          found.push(product.itemId);
        }
      }
    }

    return found;
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
  },
  {
    path: '/walmart/products/challenge',
    method: 'GET',
    controller: ProductsController.CheckProducts
  }
];
