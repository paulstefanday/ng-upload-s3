import uniqueRandomArray from 'unique-random-array';
import starWarsNames from './starwars-names.json';

var getRandomItem = uniqueRandomArray(starWarsNames);

module.exports = {
  all: starWarsNames,
  random: random,
  first: first
};

function random(number) {
  if (number === undefined) {
    return getRandomItem();
  } else {
    var randomItems = [];
    for (var i = 0; i < number; i++) {
      randomItems.push(getRandomItem());
    }
    return randomItems;
  }
}

function first() {
  return starWarsNames[0];
}
