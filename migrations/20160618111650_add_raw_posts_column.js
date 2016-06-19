
exports.up = function addRawPostsColumnUp(knex) {
  return knex.schema.table('posts', function createAddRawPostsColumn(table) {
    table.text('raw_posts', 'longtext');
  });
};

exports.down = function addRawPostsColumnDown(knex) {
  return knex.schema.table('posts', function dropAddRawPostsColumn(table) {
    table.dropColumn('raw_posts');
  });
};
