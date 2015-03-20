module.exports = function() {
  'use strict';

  // Generate random birthday with age between 18 and 70
  var now = new Date();
  var year = (now.getFullYear() - 70) + Math.floor(Math.random() * 42);
  var month = Math.floor(Math.random() * 11);
  var day = Math.floor(Math.random() * 30);

  return new Date(year, month, day);
};
