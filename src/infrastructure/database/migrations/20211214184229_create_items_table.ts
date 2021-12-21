import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('items', (table) => {
    table.bigIncrements('id').unsigned().primary();
    table.string('name').nullable();
    table.string('quantity').nullable();
    table.bigInteger('created_by').unsigned();
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('deleted_at').nullable();

    table.foreign('created_by').references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('items');
}
