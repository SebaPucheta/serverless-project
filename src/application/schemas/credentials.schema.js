const Joi = require('@hapi/joi');

const credentialsSchema = {
  password: Joi.string()
    .min(5)
    .max(20)
    .required()
    .messages({
      'string.min': 'Password must has more than 5 characters',
      'string.max': 'Password must has less than 20 characters',
      'any.required': 'Password is a required field'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email has incorrect format',
      'any.required': 'Email is a required field'
    })
};

module.exports = {
  credentialsSchema,
  joiCredentialsSchema: Joi.object(credentialsSchema)
};