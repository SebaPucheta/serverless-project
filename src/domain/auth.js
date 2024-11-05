const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dynamoService = require('../infrastructure/dynamoDB.sevice');
const { generatePolicy } = require('../common/authorization');

const saltRounds = process.env.SALT_ROUNDS;
const privateKey = process.env.TOKEN_PRIVATE_KEY;
const tableName = process.env.USERS_TABLE_NAME;

const authorization = async (token, methodArn) => {
  const decodedToken = await jwt.verify(token.replace('Bearer ', ''), privateKey);

  if (decodedToken.email && decodedToken.hash) {
    return generatePolicy('user', 'Allow', '*')
  }
}

const login = async (email, password) => {
  const user = await dynamoService.getByKey(tableName, { email });
  if (user && bcrypt.compareSync(password, user.hash)) {
    return { 'access-token': jwt.sign(user, privateKey) };
  }
}

const signUp = async (email, password) => {
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
  const user = { email, hash };

  await dynamoService.create(tableName, user);
  return { 'access-token': jwt.sign(user, privateKey) };
}

module.exports = {
  authorization,
  login,
  signUp
}