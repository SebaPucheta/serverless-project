const Joi = require('@hapi/joi');

const carSchema = {
  brand: Joi.string()
    .regex(/^[a-zA-Z0-9 ]*$/)
    .messages({
      'string.base': 'Brand must be a type of text',
      'any.required': 'Brand is a required field'
    }),
  model: Joi.string()
    .regex(/^[a-zA-Z0-9 ]*$/)
    .messages({
      'string.base': 'Model must be a type of text',
      'any.required': 'Model is a required field'
    }),
  engine: Joi.string()
    .regex(/^[a-zA-Z0-9-. ]*$/)
    .messages({
      'string.base': 'Engine must be a type of text',
      'any.required': 'Engine is a required field'
    }),
  licencePlate: Joi.alternatives()
    .try(
      Joi.string().regex(/^[a-z]{3}[0-9]{3}$/),
      Joi.string().regex(/^[a-z]{2}[0-9]{3}[a-z]{2}$/ )
    )
    .messages({
      'alternatives.base': 'Licence plate hasnt the correct format',
      'alternatives.match': 'Licence plate hasnt the correct format',
      'any.required': 'Licence plate is a required field'
    }),
};

module.exports = {
  carSchema,
  joiCarSchema: Joi.object(carSchema)
};