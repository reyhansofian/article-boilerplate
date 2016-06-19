var bookshelf = require('../config/bookshelf');
var User = require('./User');

var Article = bookshelf.Model.extend({
  tableName: 'posts',
  hasTimestamps: true,
  users: function users() {
    return this.belongsTo(User);
  },

  initialize: function initialize() {
    this.on('saving', this.castAttr, this);
  },

  castAttr: function castAttr(model) {
    model.set('raw_posts', this.serializePost(model.attributes.raw_posts));
    model.set('slug', this.slugifyTitle(model.attributes.title));
  },

  serializePost: function serializePost(attr) {
    return JSON.stringify(attr);
  },

  unserializePost: function unserializePost(attr) {
    return JSON.parse(attr);
  },

  slugifyTitle: function slugifyTitle(attr) {
    return attr.toString()
                      .toLowerCase()
                      .replace(/\s+/g, '-')           // Replace spaces with -
                      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                      .replace(/^-+/, '')             // Trim - from start of text
                      .replace(/-+$/, '');
  }
});

module.exports = Article;
