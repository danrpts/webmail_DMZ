'use strict';

var $ = require('jquery');

var _ = require('underscore');

var ChipsInput = require('./Chips_Input.js');

module.exports = ChipsInput.extend({

  // Override the default chips template, just be sure this has a "chips-input" and "chips-list"
  template: require('../../templates/search_input.html')

});
