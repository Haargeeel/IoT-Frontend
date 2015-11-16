var AWS = require('aws-sdk');

module.exports = me = {};

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
});

var dynamodb = new AWS.DynamoDB();

me.createTable = function(req, res) {
  var params = {
    TableName : "Movies",
    KeySchema: [       
      { AttributeName: "year", KeyType: "HASH"},  //Partition key
      { AttributeName: "title", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
      { AttributeName: "year", AttributeType: "N" },
      { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
      ReadCapacityUnits: 10, 
      WriteCapacityUnits: 10
    }
  };

  dynamodb.createTable(params, function(err, data) {
    if (err) {
      console.log('Unable to create table. Error JSON: '
                  , JSON.stringify(err, null, 2))
      res.json(err);
    } else {
      console.log('Created table. Table description JSON: '
                  , JSON.stringify(data, null, 2));
      res.json(data));
    }
  });
};
