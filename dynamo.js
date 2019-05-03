const AWS = require('aws-sdk');
const terms = require('./terms.json');
const uuid = require('uuid/v4');
const fs = require('fs');

const convertJsonToDynamoFormat = ([key, val]) =>
  val === null ? {} : { [key]: { S: val } };

const convertTermToDynamo = term =>
  Object.entries(term)
    .map(convertJsonToDynamoFormat)
    .reduce((prev, curr) => ({ ...prev, ...curr }), {});

const createUploadToDb = db => term =>
  db
    .putItem({
      TableName: 'seekspeak-terms',
      Item: {
        ...convertTermToDynamo(term)
      },
      ReturnItemCollectionMetrics: 'SIZE'
    })
    .promise();

(async () => {
  // const credentials = new AWS.SharedIniFileCredentials({
  //   profile: 'personal'
  // });
  const db = new AWS.DynamoDB({ region: 'ap-southeast-2' /*credentials*/ });
  const uploadToDb = createUploadToDb(db);

  const newIdTerms = terms.map(term => ({ ...term, id: uuid() }));
  fs.writeFileSync('./newTerms.json', JSON.stringify(newIdTerms, null, 2));

  // const result = await Promise.all([
  //   newIdTerms.map(async term => await uploadToDb(term))
  // ]);

  // console.log('result: ', result);
})();
