const axios = require('axios');

const terms = require('./newTerms.json');
console.log('terms: ', terms.length);

const elasticUrl =
  'https://search-seekspeak-terms-u6ln5fyh4aejnq2onlyttrmhpu.ap-southeast-2.es.amazonaws.com/terms/_doc';

terms.slice(150, 300).forEach(term => {
  const { id, short_hand, description, expanded_form } = term;
  const url = `${elasticUrl}/${id}`;
  axios
    .put(url, { short_hand, description, expanded_form })
    .catch(err => console.log('There was an error', err));
});
