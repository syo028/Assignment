import { Knex } from 'knex'

// prettier-ignore
export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('url'))) {
    await knex.schema.createTable('url', table => {
      table.increments('id')
      table.text('url').notNullable().unique()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('method'))) {
    await knex.schema.createTable('method', table => {
      table.increments('id')
      table.text('method').notNullable().unique()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('user_agent'))) {
    await knex.schema.createTable('user_agent', table => {
      table.increments('id')
      table.text('user_agent').notNullable().unique()
      table.timestamps(false, true)
    })
  }
  await knex.raw('alter table `request_log` drop column `user_agent`')
  await knex.raw('alter table `request_log` drop column `url`')
  await knex.raw('alter table `request_log` drop column `method`')
  await knex.raw('alter table `request_log` add column `method_id` integer not null references `method`(`id`)')
  await knex.raw('alter table `request_log` add column `url_id` integer not null references `url`(`id`)')
  await knex.raw('alter table `request_log` add column `user_agent_id` integer null references `user_agent`(`id`)')
}

// prettier-ignore
export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(`request_log`, table => table.dropColumn(`user_agent_id`))
  await knex.schema.alterTable(`request_log`, table => table.dropColumn(`url_id`))
  await knex.schema.alterTable(`request_log`, table => table.dropColumn(`method_id`))
  await knex.raw('alter table `request_log` add column `method` text not null')
  await knex.raw('alter table `request_log` add column `url` text not null')
  await knex.raw('alter table `request_log` add column `user_agent` text null')
  await knex.schema.dropTableIfExists('user_agent')
  await knex.schema.dropTableIfExists('method')
  await knex.schema.dropTableIfExists('url')
}
