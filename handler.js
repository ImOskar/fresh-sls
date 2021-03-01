"use strict";
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const spotify = require("./spotify-api");
const helper = require("./helper");

module.exports.releases = async (event) => {
  const response = await spotify
    .getReleases()
    .then((data) => {
      return dynamo
        .put({
          TableName: process.env.RELEASE_TABLE,
          Item: {
            itemId: `fri${helper.getFridayNumber()}2021`,
            releases: data,
          },
        })
        .promise()
        .then((data) => {
          console.log("dynamodb success: " + data);
        })
        .catch((error) => {
          console.log("dynamodb error: " + error);
        });
    })
    .catch((error) => {
      console.log("error: " + error);
    });
  return response;
};
