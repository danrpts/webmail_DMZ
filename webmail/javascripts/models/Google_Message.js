'use strict';

var $ = require('jquery');

var _ = require('underscore');

var humanTime = require('human-time');

var Checkbox = require('./Checkbox.js')

/* Private Helpers */
//...


function base64decode (encoded) {

  var decoded = encoded

  // Google's encoding slightly differs
  .replace(/-/g, '+') // 62nd char of encoding
  .replace(/_/g, '/'); // 63rd char of encoding

  return window.atob(decoded); 

}

function extract (payload) {
  
  var mimeType = payload.mimeType;

  if (mimeType === 'multipart/alternative') {

    // Extract the richest format

    var richest = _.last(payload.parts);

    return extract(richest);

  }

  else if (mimeType.match(/multipart\/w*/)) {

    //console.log(mimeType);

    // multipart/mixed, multipart/digest, multipart/related, any non-spec multipart

    // Extract all parts and combine serially

    // Todo: combine by partId
    return _.reduce(payload.parts, function (body, part) {

      //console.log(part);

      return body += extract(part);

    }, '', this);

  }

  else if (mimeType.match(/text\/w*/)) {

    // text/*
    return base64decode(payload.body.data);

  }

  else if (mimeType === 'message/rfc822') {

    return base64decode(payload.body.data);

  }

  return 'Unsupported Mime Type';

}

/* Public Ctor */

module.exports = Checkbox.extend({

  urlRoot: 'https://www.googleapis.com/gmail/v1/users/me/messages',

  defaults : {
    'id' : undefined,
    'threadId' : undefined
  },

  /* "Low level" REST wrappers; Think of these as priming the default functions */

  // Todo: clean this up because they are all doing the same thing
  // maybe by creating a way to set beforeSend on the model and the 
  // arch sets it up to be used on each sync

  // GET
  fetch: function (options) {

    var account = require('../singletons/account.js');
    
    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }
    
    return Checkbox.prototype.fetch.call(this, options);

  },

  // DELETE
  destroy: function () {

    var account = require('../singletons/account.js');

    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }

    Checkbox.prototype.destroy.call(this, options);
  
  },

  // POST / PUT
  save: function (key, val, options) {

    var account = require('../singletons/account.js');
    
    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }
    
    // Call prototype save w/o attr
    return Checkbox.prototype.save.call(this, key, val, options);

  },

  // POST
  procedure: function (name, options) {

    var account = require('../singletons/account.js');
    
    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }
  
    return Checkbox.prototype.procedure.call(this, name, options);

  },

  /* "High Level" message procedures */

  // Higher level POST/PUT operation
  save: function () {

  },

  // Higher level POST operation
  send: function () {

    var account = require('../singletons/account.js');

    var to = this.get('to').getValues();

    // Build RFC5322 payload
    var payload = '';

    payload += 'From: ' + account.get('name') + ' <' + account.get('email') + '>' + '\r\n';
    
    payload += _.reduce(to, function (memo, value, index) {

      return memo += ' <' + value + '>' + ( (index + 1 < to.length) ? ',' : '' );

    }, 'To:') + '\r\n';

    payload += 'Subject: ' + this.get('subject') + '\r\n';
    
    payload += 'Date: ' + new Date().toUTCString() + '\r\n\n';
    
    payload += this.get('body'); + '\r\n\n';

    // Save attributes and put back in if unsuccessful at sending

    // Clear the data from the model
    this.clear({ silent: true });

    // Create a google type base-64 encoded ASCII string
    payload = window.btoa(payload).replace(/\+/g, '-').replace(/\//g, '\\');

    // Set the string on the model for serialization
    //this.set('raw', payload);

    // Then invoke the remote procedure
    this.procedure('send', {

      // Set the attrs option to prevent backbone from serializing the entire model
      attrs: {

        'raw': payload

      }

    });
  
  },

  // Higher level POST operation
  untag: function (name, options) {

    var index = this.hasTag(name);

    // If the message has the tag
    if (index > -1) {

      this.procedure('modify', {

        // Set the attrs option to prevent backbone from serializing the entire model
        attrs: {

          'removeLabelIds': [ name.toUpperCase() ]

        },

        success: function (model, response) {

          // Merge the result and make the change loud
          model.set(response, options);

        }

      });


    }

  },

  // Higher level POST operation
  tag: function (name, options) {

    var index = this.hasTag(name);

    // If the message doesn't have the tag
    if (index === -1) {

      this.procedure('modify', {

        // Make the request silent to avoid jitter
        silent: true,

        // Set the attrs option to prevent backbone from serializing the entire model
        attrs: {

          'addLabelIds': [ name.toUpperCase() ]

        },

        success: function (model, response) {

          // Merge the result
          model.set(response, options);

        }

      });


    }

  },

  // Higher level POST operation
  trash: function () {

    var messages = require('../singletons/messages.js');

    // Immediately remove for perceived performance
    messages.remove(this);

    // Then invoke the remote procedure
    this.procedure('trash', {

      // Set the attrs option to prevent backbone from serializing the entire model
      attrs: {}

    });

    // If error add back to collection and handle error
  
  },

  toggleStarred: function (options) {

    if (this.isStarred()) this.untag('starred', options);
    
    else this.tag('starred', options);
  
  },

  toggleImportant: function (options) {
  
    if (this.isImportant()) this.untag('important', options);
  
    else this.tag('important', options);
  
  },

  // Todo: Open dialog to send to someone else, goto next message
  // Higher level POST operation
  forward: function () {},

  // Todo: Mark as read (processed), open message in composer in reply mode
  // Higher level POST operation
  respond: function () {},

  /* Payload helpers */

  // Extract headers from message payload
  getHeaders: function () {

    var payload = this.get('payload');

    // TODO: Handle error
    if (! payload) {
      
      return -1;

    }

    // Memoize to cache the result
    return _.memoize(function () {

      var names = _.pluck(payload.headers, 'name');

      var values = _.pluck(payload.headers, 'value');

      return _.object(names, values);

    })();

  },

  getBody: function () {

    var payload = this.get('payload');

    var body = extract(payload)

    // Remove any scripts
    .replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/ig, '')

    // Remove any styles
    .replace(/<style([\S\s]*?)>([\S\s]*?)<\/style>/ig, '');

    return body;

  },

  hasParts: function () {

    var payload = this.get('payload');

    // TODO: Handle error
    if ( ! payload ) {

      return -1;

    }
    
    return !! payload.mimeType.match(/multipart/g);
  
  },

  hasAttachment: function () {
  
    var payload = this.get('payload');

    // TODO: Handle error
    // Even though hasParts checks this we still should stratify the cases
    if ( ! payload ) {

      return -1;

    }

    // Short circut
    if ( ! this.hasParts() ) {
      
      return false;

    }

    //
    return _.find(payload.parts, function (part) {

      return part.body.attachmentId;
    
    }, false);

  },

  getHeader: function (name) {

    var header = this.getHeaders()[name];

    // TODO: Handle error
    if (! header) {

      return -1;

    }

    return header.replace(/['"]+/g, '');

  },


  /* Attribute helpers */

  // Tags are implemented with google label system
  hasTag: function (name) {

    var labels = this.get('labelIds');

    // TODO: Handle error
    if ( ! labels ) {

      return -1;

    }

    // Returns -1 if it fails
    return labels.indexOf(name.toUpperCase());

  },

  // Just a wrapper for templates
  isUnread: function () {
  
    return this.hasTag('unread') > -1;
  
  },

  // Just a wrapper for templates
  isStarred: function () {
  
    return this.hasTag('starred') > -1;
  
  },

  // Just a wrapper for templates
  isImportant: function () {
  
    return this.hasTag('important') > -1;
  
  },

  // Just a wrapper for templates
  isSnoozed: function () {
  
    return this.hasTag('snoozed') > -1;
  
  },

  // Just a wrapper for templates
  // TODO
  isFlagged: function () {
  
    return false;
  
  },

  // Just a wrapper for templates
  isSent: function () {
  
    return this.hasTag('sent') > -1;
  
  },

  // Just a wrapper for templates
  isDraft: function () {
  
    return this.hasTag('draft') > -1;
  
  },

  // Just a wrapper for templates
  isTrash: function () {
  
    return this.hasTag('trash') > -1;
  
  },

  getDate: function () {
  
    return this.fault('date', function () {

      return this.getHeader('Date');
    
    });
  
  },

  getHumanDate: function () {
  
    return new Date(this.getDate()).toDateString();
  
  },

  // Just a wrapper for templates
  getTimeAgo: function () {

    return humanTime(new Date(this.getDate()));
  
  },

  // Just a wrapper for templates
  getSubject: function () {
  
    return this.fault('subject', function () {

      return this.getHeader('Subject');
    
    });

  },

  // Just a wrapper for templates
  _getFrom: function () {

    return this.fault('from', function () {

      // Set default
      var name = undefined;
      var email = this.getHeader('From');

      // Extract email and name
      var start = email.indexOf('<');
      if (start != -1) {

        // Remove quotes
        email = email.replace(/['"]+/g, '');

        // Pivot backwards for name
        var spaced = email.substring(0, start-1);
        name = ! spaced ? name : spaced;

        // Pivot forwards for email
        var end = email.indexOf('>', start);
        var bracketed = email.substring(start+1, end);
        email = ! bracketed ? email : bracketed;
      }

      return [name, email];

    });

  },

  getFrom: function () {

    var from = this._getFrom();
    
    var name = from[0];
    
    return !! name ? name : from[1]; 
  
  },

  getFromList: function () {

  },

  getReply: function () {

  },

  getReplyList: function () {

  },

  // Just a wrapper for templates
  getTo: function () {

    return this.fault('to', function () {

      // Set default
      var name = this.getHeader('To');

      // Extract email address
      var start = name.indexOf('<');
      if (start != -1) {

          // Pivot forwards for email
          var end = name.indexOf('>', start);
          var bracketed = name.substring(start+1, end);
          name = ! bracketed ? name : bracketed;
      }
    
      return name;

    });

  },

  getToList: function () {

  },

  // Just a wrapper for templates
  getSnippet: function () {
    
    return this.get('snippet');

  }

});
