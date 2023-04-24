import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('expenses', table => {
        table.increments('id'),
        table.string('expense'),
        table.float('value'),
        table.boolean('isPaid').defaultTo(false)
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('expenses');
}
