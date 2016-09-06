'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

var ToolBar = require('./Tool_Bar.js');

var DraftSheet = require('./Draft_Sheet.js');

var MessagesSheet = require('./Messages_Sheet.js');

var MessagesActions = require('./Messages_Actions.js');

module.exports = View.extend({

  template: require('../../templates/page.html'),

  initialize: function () {
    var search = require('../singletons/search.js');

    // Update the collection when chips are added to the search collection.
    this.listenTo(search, 'update', function (_, options) {
      return this.collection.refresh(search.getValues(), options);
    });
  
  },

  prerender: function () {},

  postrender: function () {},

  defaultViews: {
    'header': 'toolBar',
    'main': 'messagesSheet',
    'footer': 'messagesActions'
  },

  toolBar: function () {
    var account = require('../singletons/account.js');
    return new ToolBar({ model: account });
  },

  draftSheet: function () {
    return new DraftSheet();
  },

  messagesSheet: function () {
    return new MessagesSheet({ collection: this.collection });
  },

  messagesActions: function () {
    return new MessagesActions({ collection: this.collection });
  },

  events: {
    'click #title': 'onTitleClick',
    'click #compose': 'onComposeClick'
  },

  onTitleClick: function (event) {

    var search = require('../singletons/search.js');

    event.preventDefault();

    return this.collection.refresh(search.getValues());

  },

  onComposeClick: function () {
    
  }

});
