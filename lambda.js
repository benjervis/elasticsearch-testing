const pipe = (...fns) => inputVal =>
  fns.reduce((prev, fn) => fn(prev), inputVal);
const map = fn => arr => arr.map(fn);
const reduce = (fn, initial) => arr => arr.reduce(fn, initial);

const mergeObjects = (obj1, obj2) => ({ ...obj1, ...obj2 });
const extractSValues = ([key, val]) => ({ [key]: val.S });

const convertFromDynamo = pipe(
  JSON.parse,
  term => ({ ...term.Keys, ...term.NewImage }),
  Object.entries,
  map(extractSValues),
  reduce(mergeObjects, {})
);

const sampleResponse = `{
    "ApproximateCreationDateTime": 1555465170,
    "Keys": {
        "id": {
            "S": "1"
        }
    },
    "NewImage": {
        "expanded_form": {
            "S": "Third party up-loader or Third Party Partner."
        },
        "short_hand": {
            "S": "3PU"
        },
        "description": {
            "S": "A company that uploads multiple jobs to our website, and manages applications on behalf of multiple clients. Charlotte Montague & Lee Whitaker manage our relationships with our Partners. See Partners for more information"
        },
        "id": {
            "S": "1"
        }
    },
    "SequenceNumber": "233000000000001020926148",
    "SizeBytes": 308,
    "StreamViewType": "NEW_AND_OLD_IMAGES"
}`;

console.log('Converted:', convertFromDynamo(sampleResponse));
