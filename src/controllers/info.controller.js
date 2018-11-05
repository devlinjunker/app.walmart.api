//@flow

/**
 * Notes from interview:
 *  make sure to write controllers as functions rather than classes with methods (prevent instantiation on stack)
 *
 *
 * Basic Controller for returning server information
 * @param  {RequestParams} request Request Parameters
 * @return {Object}         Server information Object
 */
function controller(request: any) {
  return request.server.info;
}

export default [
  {
    path: '/info',
    method: 'GET',
    controller
  }
];
