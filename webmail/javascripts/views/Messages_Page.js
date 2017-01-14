'use strict';

var $ = require('jquery');

require('jquery-ui-browserify');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  /* Define View */

  template: require('../../templates/messages_page.html'),

  postrender: function () {

    componentHandler.upgradeElements(this.el);
  
  },

  /* Map regions to initializers */

  defaultViews: {
    '[data-region="drawer"]': 'getDrawerSheet',
    '[data-region="content"]': 'getContentSheet'
  },

  /* Private Region Initializer Helpers */

  _newNavSheet: function (options) {
  
    var account = require('../singletons/account.js');
  
    var NavSheet = require('./Nav_Sheet.js');
  
    return new NavSheet({ model: account });

  },

  _newMessagesSheet: function (options) {
  
    var messages = require('../singletons/messages.js');
  
    var MessagesSheet = require('./Messages_Sheet.js');
  
    return new MessagesSheet({ collection: messages });

  },

  _newMessageSheet: function (options) {
   
    var MessageSheet = require('./Message_Sheet.js');
   
    return new MessageSheet(options);

  },

  _newDraftSheet: function (options) {
   
    var DraftSheet = require('./Compose_Sheet.js');
   
    return new DraftSheet(options);

  },

  /* Region Initializers */

  getDrawerSheet: function () {

    return this._newNavSheet();

  },

  // Note: this page view is used for the message list and a single message
  getContentSheet: function () {
    
    // view state is for single message
    var blah = ! this.model;

    return blah ? this._newMessagesSheet() : this._newMessageSheet({ model: message });

  },

  /* Map events to handlers */

  events: {
    'click #compose': 'onComposeClick',
    'click .message': 'onMessageClick'
  },

  /* Private Event Handler Helpers */

  _showDraftSheet: function (message) {
    
    var $el = this.$('.resizable');
    
    $el.resizable({
      handles: { 
        w : '.ui-resizable-w'
      }
    });

    $el.width(630);
    
    this.setView(this._newDraftSheet({ model: message }), '[data-region="secondary"]');
    
    $el.show();

  },

  _showMessageSheet: function (message) {

    var $el = this.$('.resizable');
    
    $el.resizable({
      handles: {
        w : '.ui-resizable-w'
      }
    });

    $el.width(630);

    // Note: This view state is different than when the router
    // wants to show a message using the id, so we shouldn't set
    // the model directly on the view as we are still in the 
    // "list" state
    this.setView(this._newMessageSheet({ model: message }), '[data-region="secondary"]');

    $el.show();

  },

  _hideSecondarySheet: function () {

    this.$('.resizable').hide();

  },

  /* Event Handlers */

  onComposeClick: function (e) {
    
    var GoogleMessage = require('../models/Google_Message.js');
    
    var draft = new GoogleMessage();
    
    this._showDraftSheet(draft);

  },

  onMessageClick: function (e) {

    var id = e.currentTarget.id;

    var messages = require('../singletons/messages.js');

    var message = messages.lookup(id);
    
    this._showMessageSheet(message);

    return true;

  }


});
