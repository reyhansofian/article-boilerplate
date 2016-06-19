
exports.up = function up(knex, Promise) { //eslint-disable-line
  return knex.schema.createTable('tags', function(table) { //eslint-disable-line
    table.increments('id').primary();
    table.string('name');
    table.timestamps();
  }).createTable('posts', function(table) { //eslint-disable-line
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('slug').notNullable();
    table.integer('user_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('users');
    table.text('posts');
    table.integer('tag_id')
          .unsigned()
          .references('tags.id');
    table.enu('status', ['draft', 'published']).defaultTo('draft');
    table.enu('visibility', ['public', 'private']).defaultTo('public');
    table.timestamps();
  });
};

exports.down = function down(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('posts'),
    knex.schema.dropTableIfExists('tags')
  ]);
};
