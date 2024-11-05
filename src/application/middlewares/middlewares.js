const ALLOWED_ORIGINS = ['http://react-project-dev-2.s3-website-sa-east-1.amazonaws.com', 'http://localhost:3000']

const baseResponse = (origin) => {
  const headers = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers' : 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST, OPTIONS'
  }

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }

  return { headers }
}

const errorHandler = async (event, method) => {
  const origin = event.headers.origin;

  try {
    return Object.assign(baseResponse(origin), {
      statusCode: 200,
      body: JSON.stringify(await method(event))
    });
  } catch (err) {
    if (err.badRequest) {
      return Object.assign(baseResponse(origin), {
        statusCode: 400,
        body: JSON.stringify({
          code: 'bad_request',
          severity: 'MEDIUM',
          message: 'Bad Request',
          details: err.details,
        }),
      });
    }

    if (err.forbidden) {
      return Object.assign(baseResponse(origin), {
        statusCode: 403,
        body: JSON.stringify({
          code: 'forbidden',
          severity: 'MEDIUM',
          message: 'Forbidden',
          details: err.details,
        }),
      });
    }

    if (err.custom) {
      return Object.assign(baseResponse(origin), {
        statusCode: err.statusCode,
        body: JSON.stringify(err.body),
      });
    }

    return Object.assign(baseResponse(origin), {
      statusCode: 500,
      body: JSON.stringify({
        code: 'internal_server_error',
        severity: 'HIGH',
        message: 'Internal Server Error',
        details: err.details ? err.details : err.toString(),
      }),
    });
  }
}

module.exports = {
  errorHandler
}