'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

var ChipsList = View.extend({

  template: require('../../templates/chips_list.html'),

  initialize: function () {
    this.listenTo(this.collection, 'update', this.render);
  },

  prerender: function () {},

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'click .delete': 'onDeleteClick'
  },

  onDeleteClick: function (event) {
    var cid = event.currentTarget.id;
    this.collection.remove(cid);
  }

});

module.exports = View.extend({

  template: require('../../templates/chips_input.html'),

  initialize: function () {},

  prerender: function () {},

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    'div#list': 'listView'
  },
  
  listView: function () {
    return new ChipsList({ collection: this.collection });
  },

  events: {
    'keydown input': 'onInputKeydown'
  },

  // Todo: fetch data list items and find select event
  onInputSelect: function (event) {},

  onInputEnter: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val().trim();
    var collection = this.collection;
    var attributes = { value: value };
    if (!!value && !collection.findWhere(attributes)) {
      collection.push(attributes);
      $input.val('');
    }
  },

  onInputBackspace: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val();
    if (!value) this.collection.pop();
  },

  onInputKeydown: function (event) {
    switch (event.which) {
      case 13: this.onInputEnter.apply(this, arguments); break;
      case 8: this.onInputBackspace.apply(this, arguments); break;
    }
  }

});
