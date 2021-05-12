import { Knex } from "knex";

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("email", 255).unique().notNullable();
    table.string("username", 255).unique().notNullable();
    table.string("password", 255).notNullable();
    table.dateTime("created_at").defaultTo(knex.fn.now());
    table.dateTime("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.dropTable("users");
}
