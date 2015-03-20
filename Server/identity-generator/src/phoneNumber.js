var pad = require('./pad');
var randomIntInRange = require('./randomIntInRange');

module.exports = function() {
  'use strict';

  return '0' + pad(randomIntInRange(1000, 9999), 4) + pad(randomIntInRange(0, 9999999), 7);
};
