const authorizer = require('../../domain/auth');
const { validate } = require('../../common/validation-utils');
const { errorHandler } = require('../middlewares/middlewares')
const { joiCredentialsSchema } = require('../schemas/credentials.schema');

// Public Functions
const handler = (method) => {
  return (event) => {
    return errorHandler(event, method)
  }
}

// Private Functions
const authorization = async (event, context, callback) => {
  const response = await authorizer.authorization(event.authorizationToken, event.methodArn)

  if (response) {
    callback(null, response)
  } else {
    callback('Unauthorizer')
  }
}

const login = async (event) => {
  const body = JSON.parse(event.body);
  validate(body, joiCredentialsSchema);
  const resp = await authorizer.login(body.email, body.password);
  if (resp) {
    return resp
  }

  throw {
    custom: true,
    statusCode: 401,
    body: {
      code: 'unauthorizer',
      severity: 'LOW',
      message: 'Unauthorizer',
      details: 'Invalid Credentials',
    }
  } 
};

const signUp = (event) => {
  const body = JSON.parse(event.body);
  validate(body, joiCredentialsSchema);
  return authorizer.signUp(body.email, body.password);
};

module.exports = {
  authorization: authorization,
  login: handler(login),
  signUp: handler(signUp)
};
