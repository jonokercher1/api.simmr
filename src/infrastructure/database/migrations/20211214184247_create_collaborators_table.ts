import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('collaborators', (table) => {
    table.primary(['space_id', 'user_id']);
    table.unique(['space_id', 'user_id']);
    table.bigInteger('space_id').unsigned().references('id').inTable('spaces');
    table.bigInteger('user_id').unsigned().references('id').inTable('users');
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('collaborators');
}
