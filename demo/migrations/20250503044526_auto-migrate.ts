import { Knex } from 'knex'

// prettier-ignore
export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('user'))) {
    await knex.schema.createTable('user', table => {
      table.increments('id')
      table.string('username', 32).notNullable()
      table.string('password_hash', 72).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('session'))) {
    await knex.schema.createTable('session', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('user.id')
      table.text('token').notNullable().unique()
      table.timestamps(false, true)
    })
  }

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

  if (!(await knex.schema.hasTable('request_log'))) {
    await knex.schema.createTable('request_log', table => {
      table.increments('id')
      table.integer('method_id').unsigned().notNullable().references('method.id')
      table.integer('url_id').unsigned().notNullable().references('url.id')
      table.integer('user_id').unsigned().nullable().references('user.id')
      table.integer('user_agent_id').unsigned().nullable().references('user_agent.id')
      table.integer('timestamp').notNullable()
    })
  }

  if (!(await knex.schema.hasTable('item'))) {
    await knex.schema.createTable('item', table => {
      table.increments('id')
      table.text('title').notNullable()
      table.text('description').notNullable()
      table.text('category').notNullable()
      table.text('image_url').notNullable()
      table.text('video_url').notNullable()
      table.timestamp('published_at').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('tag'))) {
    await knex.schema.createTable('tag', table => {
      table.increments('id')
      table.text('name').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('item_tag'))) {
    await knex.schema.createTable('item_tag', table => {
      table.increments('id')
      table.integer('item_id').unsigned().notNullable().references('item.id')
      table.integer('tag_id').unsigned().notNullable().references('tag.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('course'))) {
    await knex.schema.createTable('course', table => {
      table.increments('id')
      table.integer('item_id').unsigned().notNullable().references('item.id')
      table.text('language').notNullable()
      table.enum('level', ['beginner', 'intermediate', 'advanced']).notNullable()
      table.integer('duration_minutes').notNullable()
      table.text('instructor').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('course_prerequisite'))) {
    await knex.schema.createTable('course_prerequisite', table => {
      table.increments('id')
      table.integer('course_id').unsigned().notNullable().references('course.id')
      table.text('prerequisite').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('bookmark'))) {
    await knex.schema.createTable('bookmark', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('user.id')
      table.integer('item_id').unsigned().notNullable().references('item.id')
      table.timestamp('created_at').notNullable()
    })
  }
}

// prettier-ignore
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('bookmark')
  await knex.schema.dropTableIfExists('course_prerequisite')
  await knex.schema.dropTableIfExists('course')
  await knex.schema.dropTableIfExists('item_tag')
  await knex.schema.dropTableIfExists('tag')
  await knex.schema.dropTableIfExists('item')
  await knex.schema.dropTableIfExists('request_log')
  await knex.schema.dropTableIfExists('user_agent')
  await knex.schema.dropTableIfExists('method')
  await knex.schema.dropTableIfExists('url')
  await knex.schema.dropTableIfExists('session')
  await knex.schema.dropTableIfExists('user')
}
