import { Knex } from 'knex'

// prettier-ignore
export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('session'))) {
    await knex.schema.createTable('session', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('user.id')
      table.text('token').notNullable().unique()
      table.timestamps(false, true)
    })
  }
}

// prettier-ignore
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('session')
}
