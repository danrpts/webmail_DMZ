'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/messages_sheet.html'),

  initialize: function () {

    var queries = require('../singletons/queries.js');

    // Update the collection when chips are added to the queries collection.
    // Is this a good place?
    this.listenTo(queries, 'reset update', function (_, options) {

      return this.collection.search(queries.getValues(), options);
    
    });
  
  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    '[data-region="feature"]': 'newSearchInput',
    '[data-region="list"]': 'newMessagesList'
  },

  newSearchInput: function () {
    var queries = require('../singletons/queries.js')
    var SearchInput = require('./Search_Input.js');
    return new SearchInput({ collection: queries });  
  },

  newFilterInput: function () {
    var FilterInput = require('./Filter_Input.js');
    return new FilterInput();  
  },

  newMessagesList: function (collection) {
    var MessagesList = require('./Messages_List.js');
    return new MessagesList({ collection: collection || this.collection });
  },

  events: {
    'click #filter-toggle': 'onFilterToggleClick',
    'input #filter-textarea': 'onFilterTextareaInput',
    'click #refresh': 'onRefreshClick'
  },

  onFilterToggleClick: function () {
      
    // Using DOM state for simplicity
    var bool = this.$('#filter-toggle').hasClass('is-checked');

    // Default
    var feature = this.newFilterInput();
    
    // Change when filter feautre is displayed
    if (bool) feature = this.newSearchInput();

    // Set in the feature region
    this.setView(feature, '[data-region="feature"]');

  },

  onFilterTextareaInput: function (e) {
    var value = $(e.currentTarget).val();
    this.collection.filter(value);
  },

  onRefreshClick: function () {
    this.collection.refresh();
  }

});
