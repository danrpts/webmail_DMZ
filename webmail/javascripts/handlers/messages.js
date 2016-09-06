'use strict';

var $ = require('jquery');

var _ = require('underscore');

var MessagesPage = require('../views/Messages_Page.js');

var $region = $('body');

module.exports = function (options) {

  this.authenticate()

  .done(function(account) {

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var search = require('../singletons/search.js');

    // Check the search bar for state
    var queries = search.getValues();

    // maybe trade the account as a token for the messages
    var messages = require('../singletons/messages.js');

    // Call before view creation so that it misses the request event
    messages.refresh(queries, options);

    var messagesPage = new MessagesPage({ collection: messages });

    this.active = messagesPage;

    messagesPage.render().$el.appendTo($region);

  })

  .fail(function (account) {

    //console.log("Not signed in...");

    this.to('login');
  
  });

}
