import { Knex } from 'knex'

// prettier-ignore
export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('music_movement'))) {
    await knex.schema.createTable('music_movement', table => {
      table.increments('id')
      table.integer('music_id').unsigned().notNullable().references('classical_music.id')
      table.text('movement').notNullable()
      table.timestamps(false, true)
    })
  }
}

// prettier-ignore
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('music_movement')
}
