'use strict';

var $ = require('jquery');

require('jquery-ui-browserify');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/messages_page.html')


});
