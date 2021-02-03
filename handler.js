'use strict';
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const spotify = require('./spotify-api');
const helper = require('./helper');

module.exports.releases = async event => {
  spotify.getReleases().then(data =>  {
    dynamo.put({
      TableName: process.env.RELEASE_TABLE,
        Item: {
          itemId: `fri${helper.getFridayNumber()}2021`,
          releases: data
        }
    }).promise();
  }).catch(error => {
    console.log('error: '+ error);
})
};
