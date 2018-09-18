require('babel-core/register');
require('babel-polyfill');

export class ProductsController {
  static FindProducts(request: any) {
    const keywordString = request.query.q;

    return keywordString.split(' ');
  }
}

export default [
  {
    path: '/walmart/products',
    method: 'GET',
    controller: ProductsController.FindProducts
  }
];
