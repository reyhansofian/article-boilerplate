
exports.up = function up(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) { //eslint-disable-line
      table.increments('id').primary();
      table.string('name');
      table.string('email').unique();
      table.string('password');
      table.string('passwordResetToken');
      table.dateTime('passwordResetExpires');
      table.string('gender');
      table.string('location');
      table.string('website');
      table.string('picture');
      table.string('facebook');
      table.string('twitter');
      table.string('google');
      table.string('vk');
      table.timestamps();
    })
  ]);
};

exports.down = function down(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ]);
};
