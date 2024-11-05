"use strict";
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");

// Public Functions
// Get all items from dynamoDB
const getAll = async (tableName) => {
  const params = {
    TableName: tableName
  };
  return (await dynamoDB.scan(params).promise()).Items;
}

// Get an element from dynamoDB by item id
const getByKey = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key,
  };
  return (await dynamoDB.get(params).promise()).Item;
}

// Add an element to dynamoDB
const create = async (tableName, body) => {
  body.id = uuid.v4();

  const params = {
    TableName: tableName,
    Key: { id: body.id },
    Item: body,
  };

  await dynamoDB.put(params).promise();
  return body;
}

// Modify an element in dynamoDB
const update = async (tableName, id, body) => {
  let expression = generateUpdateQuery(body);

  const params = {
    TableName: tableName,
    Key: {
      id,
    },
    UpdateExpression: expression.UpdateExpression,
    ExpressionAttributeValues: expression.ExpressionAttributeValues,
  };

  await dynamoDB.update(params).promise();
  body.id = id
  return body;
}

// Remove an element from dynamoDB
const remove = async (tableName, id) => {
  const params = {
    TableName: tableName,
    Key: {
      id: id,
    },
  };

  await dynamoDB.delete(params).promise();
  return { id };
}

// Private Functions
const generateUpdateQuery = (fields) => {
  let exp = {
    UpdateExpression: "set",
    ExpressionAttributeValues: {},
  };
  Object.entries(fields).forEach(([key, item]) => {
    exp.UpdateExpression += ` ${key} = :${key},`;
    exp.ExpressionAttributeValues[`:${key}`] = item;
  });
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
  return exp;
};

module.exports = { getAll, getByKey, create, update, remove };
