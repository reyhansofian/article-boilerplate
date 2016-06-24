
exports.up = function addRawPostsColumnUp(knex) {
  return knex.schema.table('articles', function createAddRawPostsColumn(table) {
    table.text('raw_posts', 'longtext');
  });
};

exports.down = function addRawPostsColumnDown(knex) {
  return knex.schema.table('articles', function dropAddRawPostsColumn(table) {
    table.dropColumn('raw_posts');
  });
};
