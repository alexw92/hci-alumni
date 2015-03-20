var states = require('./states');

module.exports = function() {
  'use strict';

  // Percentage of DE population in those states (roughly)
  // Mapped 1:1 with the states array
  // 'BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN','ST', 'SH', 'TH'
  var popPercent = [
    12, 15, 5, 3, 1, 3, 8, 2, 10, 19, 5, 1, 6, 3, 4, 3
  ];

  // Pick a random state, weighted by its population
  function randomInArrayByWeight (array, weight) {
    var ar  = [];
    var i;
    var sum = 0;
    var r = Math.random();

    for (i = 0; i < weight.length - 1; i++) {
      sum += (weight[i] / 100.0);
      ar[i] = sum;
    }

    for (i = 0; i < ar.length && r >= ar[i]; i++) {
      if (r < ar[i]) {
        return array[i];
      }
    }

    return array[i];
  }

  return randomInArrayByWeight(states, popPercent);
};
