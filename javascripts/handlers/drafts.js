'use strict';

var $ = require('jquery');

var _ = require('underscore');

var $region = $('body');

module.exports = function (id, options) {

  this.authenticate()

  .done(function(account) {

    options = options || {};

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var messages = require('../singletons/messages.js');

    // Only fetch collection in the handler when:
    // 1) It's initially empty (viewed draft directly via url),
    // 2) Or we viewed a message directly via the url
    // Otherwise we may call refresh directly from a click event.
    if (messages.isEmpty() || messages.length < 2) messages.refresh();

    var MessagesPage = require('../views/Messages_Page.js');

    // If the router handed us a message id
    if (id) {

      // Use our helper to find the message (no longer possible)
      var message = messages.lookup(id);

      // Show the messages pages a sheet
      this.active = new MessagesPage({ model: message });

    // Otherwise
    } else {

      // Shoe the messages page as a list
      this.active = new MessagesPage({ collection: messages });

    }

    // The initial render should miss the initial request event by design
    this.active.render().$el.appendTo($region);

  })

  .fail(function (account) {

    //console.log("Not signed in...");

    this.to('login');
  
  });

}
