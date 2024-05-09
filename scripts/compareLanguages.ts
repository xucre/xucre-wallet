/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-readonly-type */
//import _ from 'lodash-es';

const en = require('../frontend/assets/translations/english');
const nah = require('../frontend/assets/translations/nahuatl');
const pt = require('../frontend/assets/translations/portuguese');
const qu = require('../frontend/assets/translations/quechua');
const es = require('../frontend/assets/translations/spanish');

const _ = require('lodash');
const translations = {
  en,
  es,
  nah,
  pt,
  qu
}
type Differences = {
  [path: string]: {
    obj1HasKey: boolean;
    obj2HasKey: boolean;
  };
};

function compareJsonObjectsWithLodash(obj1: any, obj2: any): Differences {
  const differences: Differences = {};

  function compare(objA: any, objB: any, path: string) {
    if (_.isObject(objA) && _.isObject(objB)) {
      const keysA = _.keys(objA);
      const keysB = _.keys(objB);
      const allKeys = _.union(keysA, keysB);

      allKeys.forEach((key: string) => {
        const objAHasKey = _.has(objA, key);
        const objBHasKey = _.has(objB, key);

        if (objAHasKey !== objBHasKey) {
          differences[path ? `${path}.${key}` : key] = {
            obj1HasKey: objAHasKey,
            obj2HasKey: objBHasKey,
          };
        } else {
          compare(objA[key], objB[key], path ? `${path}.${key}` : key);
        }
      });
    }
  }

  compare(obj1, obj2, '');
  return differences;
}

const obj1 = 'en';
const obj2 = 'qu';
console.debug('obj1: '+ obj1, 'obj2: '+ obj2);
console.debug(compareJsonObjectsWithLodash(translations[obj1], translations[obj2]));
