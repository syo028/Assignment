import { Knex } from 'knex'

// prettier-ignore
export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('request_log'))) {
    await knex.schema.createTable('request_log', table => {
      table.increments('id')
      table.text('method').notNullable()
      table.text('url').notNullable()
      table.integer('user_id').unsigned().nullable().references('user.id')
      table.text('user_agent').nullable()
      table.integer('timestamp').notNullable()
    })
  }
}

// prettier-ignore
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('request_log')
}
