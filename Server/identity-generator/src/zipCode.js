var states = require('./states');
var randomInArray = require('./randomInArray');
var randomIntInRange = require('./randomIntInRange');
var pad = require('./pad');

module.exports = function(state) {
  'use strict';

  if (state) {
    var zipStartsWith = {
      'BW': ['68', '69', '7'], 
      'BY': ['8', '9'], 
      'BE': ['10', '12', '13'], 
      'BB': ['1'],
      'HB': ['28'], 
      'HH': ['20', '22'], 
      'HE': ['3', '6'],
      'MV': ['1', '23'],
      'NI': ['2', '3', '49'],
      'NW': ['32', '33', '4', '5'],
      'RP': ['3', '4', '5', '6', '7'],
      'SL': ['6'], 
      'SN': ['0'], 
      'ST': ['0', '2', '3'], 
      'SH': ['2'], 
      'TH': ['0', '36', '37', '98', '99']
    };

    if (states.indexOf(state) === -1) {
      throw new Error(state + ' is not a valid state.');
    } else {
      var zipPart1 = randomInArray(zipStartsWith[state]);

      var zipPart2 = randomIntInRange(0, 999);

      zipPart2 = pad(zipPart2, 4);

      return (zipPart1 + zipPart2).slice(0, 5);
    }
  } else {
    return '00000';
  }
};
