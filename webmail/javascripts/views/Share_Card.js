'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/share_card.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    '#share-chips': 'shareChips'
  },

  shareChips: function () {
    var Chips = require('../models/Chips.js');
    var ChipsInput = require('./Chips_Input.js');
    var chips = new Chips();
    return new ChipsInput({ collection: chips });
  },

  events: {
    'click #share-send': 'onSendClick'
  },

  onSendClick: function () {

  }

});