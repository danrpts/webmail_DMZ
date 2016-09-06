'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

var ToolBar = require('./Tool_Bar.js');

var MessageSheet = require('./Message_Sheet.js');

var MessageActions = require('./Message_Actions.js');

module.exports = View.extend({

  template: require('../../templates/page.html'),

  initialize: function () {
    var search = require('../singletons/search.js');
    this.listenTo(search, 'update', window.transition.to);
  },

  prerender: function () {},

  postrender: function () {},

  defaultViews: {
    'header': 'toolBar',
    'main': 'messageSheet',
    'footer': 'messageActions'
  },

  toolBar: function () {
    var account = require('../singletons/account.js');
    return new ToolBar({ model: account });
  },

  messageSheet: function () {
    return new MessageSheet({ model: this.model });
  },

  messageActions: function () {
    return new MessageActions({ model: this.model });
  }

});
