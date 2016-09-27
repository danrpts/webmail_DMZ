'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/search_bar.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },
  
  defaultViews: {
    '[data-region="search-bar-input"]': 'searchInput'
  },

  searchInput: function () {
    var search = require('../singletons/search.js');
    var SearchInput = require('./Search_Input.js');
    return new SearchInput({ collection: search });
  }
  
});
