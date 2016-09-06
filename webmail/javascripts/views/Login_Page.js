'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/login_page.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'click #signin': 'signIn',
  },

  signIn: function () {
    var transition = _.partial(window.transition.to, '');
    this.model.signIn().done(transition);
  }

});