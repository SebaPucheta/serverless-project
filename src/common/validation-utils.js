const Joi = require('@hapi/joi');

// Public Functions
const applyRequiredProperties = (schema) => {
  const newSchema = {};

  Object.keys(schema).forEach((key) => {
    newSchema[key] = schema[key].required();
  });
  
  return Joi.object(newSchema);
};

const validate = (payload, schema) => {
  try {
    Joi.assert(payload, schema);
    return payload;
  } catch (err) {
    throw {
      badRequest: true,
      details: err.details.length > 0 ? err.details[0].message : '',
    };
  };
};

module.exports = {
  applyRequiredProperties,
  validate
};
