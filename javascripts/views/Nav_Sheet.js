'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/nav_sheet.html'),

  events: {
    'click #signout': 'onSignoutClick',
    'click .labels__link': 'onLabelClick'
  },

  // Temporary way to signout and clear global messages
  onSignoutClick: function () {
    var messages = require('../singletons/messages.js');

    // Todo: clean up promise anti-pattern and use a callback directly
    this.model.signOut().then(function () {
      messages.reset();
      window.transition.to('/login');
    });
  },

  // When a navigation link is clicked
  onLabelClick: function (event) {

    var queries = require('../singletons/queries.js');

    // Grab the label
    var label = $(event.currentTarget).text().trim().toLowerCase();

    // Implicitly search by modifying the queries collection and the events will handle the rest
    queries.reset({ 'value' : 'in:' + label });

  }

});