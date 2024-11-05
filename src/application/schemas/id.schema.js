const Joi = require('@hapi/joi');

const idSchema = Joi.string().uuid().required()
  .messages({
    'string.base': 'Id must be a string',
    'string.guid': 'Id must be a valid GUID',
    'string.required': 'Id is a required field'
  });

module.exports = {
    idSchema
};
