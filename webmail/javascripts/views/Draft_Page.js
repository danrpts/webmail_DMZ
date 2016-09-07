'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

var ToolBar = require('./Tool_Bar.js');

var DraftSheet = require('./Draft_Sheet.js');

var DraftActions = require('./Draft_Actions.js');

module.exports = View.extend({

  template: require('../../templates/page.html'),

  initialize: function () {},

  prerender: function () {},

  postrender: function () {},

  defaultViews: {
    'header': 'toolBar',
    'main': 'draftSheet',
    'footer': 'draftActions'
  },

  toolBar: function () {
    var account = require('../singletons/account.js');
    return new ToolBar({ model: account });
  },

  draftSheet: function () {
    return new DraftSheet();
  },

  draftActions: function () {
    return new DraftActions();
  },

  events: {}

});
