const AWS = require('aws-sdk');
const terms = require('./terms.json');

const convertJsonToDynamoFormat = ([key, val]) =>
  val === null ? {} : { [key]: { S: val } };

const convertTermToDynamo = term =>
  Object.entries(term)
    .map(convertJsonToDynamoFormat)
    .reduce((prev, curr) => ({ ...prev, ...curr }), {});

const createUploadToDb = db => term =>
  db
    .putItem({
      TableName: 'seekspeak-words-table',
      Item: {
        ...convertTermToDynamo(term)
      },
      ReturnItemCollectionMetrics: 'SIZE'
    })
    .promise();

(async () => {
  const credentials = new AWS.SharedIniFileCredentials({
    profile: 'personal'
  });
  const db = new AWS.DynamoDB({ region: 'ap-southeast-2', credentials });
  const uploadToDb = createUploadToDb(db);

  const result = await uploadToDb(terms[9]);

  // const result = await Promise.all([terms.map(uploadToDb)]);

  console.log('result: ', result);
})();
