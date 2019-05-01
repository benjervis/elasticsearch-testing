const http = require('https');
const search = require('./es').search;

(async () => {
  const searchTerm = process.argv.slice(2).join(' ');
  const { mainResult, seeAlso } = await search(searchTerm);

  if (!mainResult) {
    console.log('No matches!');
  } else {
    console.log(mainResult);
    if (seeAlso) {
      console.log('See also:', seeAlso);
    }
  }
})();
