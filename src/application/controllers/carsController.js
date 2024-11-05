const dynamoService = require('../../infrastructure/dynamoDB.sevice');
const { applyRequiredProperties, validate } = require('../../common/validation-utils');
const { errorHandler } = require('../middlewares/middlewares')
const { carSchema, joiCarSchema } = require('../schemas/car.schema');
const { idSchema } = require('../schemas/id.schema');

const TABLE_NAME = process.env.CARS_TABLE_NAME;

// Public Functions
const handler = (method) => {
  return (event) => {
    return errorHandler(event, method)
  }
}

// Private Functions
const getAll = async () => {
  const cars = await dynamoService.getAll(TABLE_NAME);
  if (cars) {
    return cars;
  }
}

const get = async (event) => {
  const id = event.pathParameters.id;
  const car = await dynamoService.getByKey(TABLE_NAME, { id });
  if (car) {
    return car;
  }

  throw {
    custom: true,
    statusCode: 404,
    body: {
      code: 'not_found',
      severity: 'LOW',
      message: 'Not Found',
      details: 'The car hasnt found',
    }
  } 
}

const post = (event) => {
  const body = JSON.parse(event.body);
  validate(body, applyRequiredProperties(carSchema));
  return dynamoService.create(TABLE_NAME, body);
};

const put = (event) => {
  const body = JSON.parse(event.body);
  const id = event.pathParameters.id; 

  validate(body, joiCarSchema);
  validate(id, idSchema);

  return dynamoService.update(TABLE_NAME, id, body);
};

const remove = (event) => {
  const id = event.pathParameters.id;
  return dynamoService.remove(TABLE_NAME, id);
};

module.exports = {
  getAll: handler(getAll),
  get: handler(get),
  post: handler(post),
  put: handler(put),
  remove: handler(remove)
};
