var bcrypt = require('bcrypt-nodejs');

exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert({
      id: 1,
      name: 'Admin',
      email: 'admin@admin.com',
      password: bcrypt.hashSync('admin')
    })
  );
};
