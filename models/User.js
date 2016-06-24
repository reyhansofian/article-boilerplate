var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');
require('./Article');

var User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  articles: function articles() {
    return this.hasMany('Article');
  },

  initialize: function initialize() {
    this.on('saving', this.hashPassword, this);
  },

  hashPassword: function hashPassword(model, attrs, options) {
    var password = options.patch ? attrs.password : model.get('password');
    if (!password) { return; }
    return new Promise(function(resolve, reject) { //eslint-disable-line
      bcrypt.genSalt(10, function(err, salt) { //eslint-disable-line
        bcrypt.hash(password, salt, null, function(err, hash) { //eslint-disable-line
          if (options.patch) {
            attrs.password = hash; //eslint-disable-line
          }
          model.set('password', hash);
          resolve();
        });
      });
    });
  },

  comparePassword: function comparePassword(password, done) {
    var model = this;
    bcrypt.compare(password, model.get('password'), function(err, isMatch) { //eslint-disable-line
      done(err, isMatch);
    });
  },

  hidden: ['password', 'passwordResetToken', 'passwordResetExpires'],

  virtuals: {
    gravatar: function gravatar() {
      if (!this.get('email')) {
        return 'https://gravatar.com/avatar/?s=200&d=retro';
      }
      var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
      return `https://gravatar.com/avatar/${md5}?s=200&d=retro`;
    }
  }
});

module.exports = bookshelf.model('User', User);
