const chai = require('chai');
const expect = chai.expect;
const uuid = require('uuid');

const { carSchema, joiCarSchema } = require('../../src/application/schemas/car.schema');
const { idSchema } = require('../../src/application/schemas/id.schema');
const { joiCredentialsSchema } = require('../../src/application/schemas/credentials.schema');
const { applyRequiredProperties, validate } = require('../../src/common/validation-utils')

describe('Car schema validator', function () {
  it('Should be successful validate with mandatory properties', () => {
    const car = {
      model: '208 GT',
      licencePlate: 'ac133wd',
      brand: 'Peugeot',
      engine: '1.6'
    };

    const result = validate(car, applyRequiredProperties(carSchema));
    expect(result).to.deep.equal(car);
  });

  it('Should be successful validate with mandatory properties, with old licence plate', () => {
    const car = {
      model: '208 GT',
      licencePlate: 'acs133',
      brand: 'Peugeot',
      engine: '1.6'
    };

    const result = validate(car, applyRequiredProperties(carSchema));
    expect(result).to.deep.equal(car);
  });

  it('Should be successful validate with some properties', () => {
    const car = {
      model: '208 GT',
      licencePlate: 'ac133wd'
    };

    const result = validate(car, joiCarSchema);
    expect(result).to.deep.equal(car);
  });

  it('Should be failed validate with mandatory properties', () => {
    const car = {
      model: '208 GT',
      engine: '1.6'
    };
  
    let result;
    try {
      result = validate(car, applyRequiredProperties(carSchema));
    } catch (err) {
      result = err;
    }

    expect(result).to.deep.equal({
      badRequest: true,
      details: 'Brand is a required field'
    });
  });

  it('Should be failed because licence plate hasnt the correct format', () => {
    const car = {
      model: '208 GT',
      licencePlate: 'a',
      brand: 'Peugeot',
      engine: '1.6'
    };
  
    let result;
    try {
      result = validate(car, applyRequiredProperties(carSchema));
    } catch (err) {
      result = err;
    }

    expect(result).to.deep.equal({
      badRequest: true,
      details: 'Licence plate hasnt the correct format'
    });
  });
});

describe('Id schema validator', function () {
  it('Should be successful', () => {
    const id = uuid.v4();

    expect(validate(id, idSchema)).to.equal(id);
  });

  it('Should be failed because the id must be a string', () => {
    const id = 2;
    let result;
    try {
      result = validate(id, idSchema);
    } catch (err) {
      result = err;
    }
    expect(result).to.deep.equal({
      badRequest: true,
      details: 'Id must be a string'
    });
  });

  it('Should be failed because the id must be a string', () => {
    const id = '2';
    let result;
    try {
      result = validate(id, idSchema);
    } catch (err) {
      result = err;
    }
    expect(result).to.deep.equal({
      badRequest: true,
      details: 'Id must be a valid GUID'
    });
  });
});

describe('Credentials schema validator', function () {
  it('Should be successful', () => {
    const credentials = {
      email: 'seba.pucheta@gmail.com',
      password: 'pepe123'
    };
    expect(validate(credentials, joiCredentialsSchema)).to.deep.equal(credentials);
  });

  it('Should be failed by mandatory properties', () => {
    const credentials = {
      password: 'pepe123'
    };

    let result;
    try {
      result = validate(credentials, joiCredentialsSchema);
    } catch (err) {
      result = err;
    }
    expect(result).to.deep.equal({
      badRequest: true,
      details: 'Email is a required field'
    });
  });

  it('Should be failed because email has incorrect format', () => {
    const credentials = {
      email: 'seba.pucheta',
      password: 'pepe123'
    };

    let result;
    try {
      result = validate(credentials, joiCredentialsSchema);
    } catch (err) {
      result = err;
    }
    expect(result).to.deep.equal({
      badRequest: true,
      details: 'Email has incorrect format'
    });
  });

  it('Should be failed because password has less than 5 characters', () => {
    const credentials = {
      email: 'seba.pucheta@gmail.com',
      password: 'pepe'
    };

    let result;
    try {
      result = validate(credentials, joiCredentialsSchema);
    } catch (err) {
      result = err;
    }
    expect(result).to.deep.equal({
      badRequest: true,
      details: 'Password must has more than 5 characters'
    });
  });

  it('Should be failed because password has more than 20 characters', () => {
    const credentials = {
      email: 'seba.pucheta@gmail.com',
      password: 'pepe12332112332112332112312324efsad'
    };

    let result;
    try {
      result = validate(credentials, joiCredentialsSchema);
    } catch (err) {
      result = err;
    }
    expect(result).to.deep.equal({
      badRequest: true,
      details: 'Password must has less than 20 characters'
    });
  });
});