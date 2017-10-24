'use strict';

var $ = require('jquery');

var _ = require('underscore');

var keycodes = require('../config/keycodes.json');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/message_sheet.html'),

  initialize: function () {
    //this.listenTo(this.model, 'request', this.render);
    this.listenTo(this.model, 'sync', this.render);

    //this.listenTo(this.model, 'change', this.render);

    // Todo: fix events used to render as it causes too many rerenders when data is synced
    //this.model.untag('unread');
  },

  postrender: function () {
    //console.log('[Messages Sheet '+this.cid+'] @postrender()');
    componentHandler.upgradeElements(this.el);
  },

  preremove: function () {
    //console.log('[Messages Sheet '+this.cid+'] @preremove()');
    // Do not call in postremove
    $('.resizable').hide();
  },

  events: {
    'keyup': 'onKeyup',
    'click #star': 'onStarClick',
    'click #important': 'onImportantClick',
    'click #reply': 'onReplyClick',
    'click #forward': 'onForwardClick',
    'click #prev': 'onPrevClick',
    'click #next': 'onNextClick',
    'click #close': 'onCloseClick'
  },

  onKeyup: function (e) {
    console.log(e);
    if (e.which === keycodes['escape']) this.remove();
    return false;
  },

  onPrevClick: function (e) {
    
    var messages = require('../singletons/messages.js');

    var index = messages.indexOf(this.model);

    // Error
    if (index < 0) {
      return false;
    }

    // Previous index [0, messages.length - 1]
    var prev = index - 1;

    // Middle message
    if (prev > 0) {

      this.model = messages.at(prev);

      this.render();

    // First message
    } else {

      this.remove();

    }
    
  },

  onNextClick: function (e) {

    var messages = require('../singletons/messages.js');

    var index = messages.indexOf(this.model);

    // Error
    if (index < 0) {
      return false;
    } 

    // Next index [1, messages.length]
    var next = index + 1;

    // Middle message
    if (next < messages.length) {

      this.model = messages.at(next);

      this.render();

    // Last message
    } else {

      this.remove();

    }

    //if ( next > messages.length && messages.hasMore() ) {

    //messages.more(_.bind(this.onNextClick, this, e));

    //}

  },

  onCloseClick: function () {
    
    this.remove();
  
  },

  onStarClick: function (e) {

    this.model.toggleStarred();

  },

  onImportantClick: function (e) {

    this.model.toggleImportant();

  },

  onRepyClick: function (e) {
  },

  onForwardClick: function (e) {
  }

});
