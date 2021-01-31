'use strict';
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const spotify = require('./spotify-api');

module.exports.releases = async event => {
  spotify.getReleases().then(data =>  {
    dynamo.put({
      TableName: process.env.RELEASE_TABLE,
        Item: {
          itemId: new Date().toString(),
          releases: data
        }
    }).promise();
  }).catch(error => {
    console.log('error: '+ error);
})
};
