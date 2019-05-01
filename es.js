const axios = require('axios');
const get = require('lodash/fp/get');
const map = require('lodash/fp/map');
const slice = require('lodash/fp/slice');
const join = require('lodash/fp/join');
const pipe = require('lodash/fp/pipe');

const endpoint =
  'https://search-seekspeak-test-search-nzzqd7kwry4fa5afru7juoixni.ap-southeast-2.es.amazonaws.com/terms';

const jsonHeaders = {
  headers: { 'Content-Type': 'application/json' }
};

const buildQueryBody = searchTerm => ({
  size: 20,
  query: {
    multi_match: {
      query: searchTerm,
      fields: ['short_hand^4', 'expanded_form^2', 'description']
    }
  },
  highlight: { fields: { description: {} } }
});

const extractShortHand = result => get('_source.short_hand')(result);
const createSeeAlso = pipe(
  slice(1, 5),
  map(extractShortHand),
  join(', ')
);

const search = async searchTerm => {
  const results = await axios
    .post(`${endpoint}/_search`, buildQueryBody(searchTerm), jsonHeaders)
    .then(get('data.hits.hits'));

  if (results.length > 0) {
    const mainResult = results[0]._source;

    if (results.length > 1) {
      const seeAlso = createSeeAlso(results);
      return { mainResult, seeAlso };
    }
    return { mainResult };
  }

  return {};
};

module.exports.search = search;
