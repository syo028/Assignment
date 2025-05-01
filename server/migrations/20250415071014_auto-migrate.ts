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

  if (!(await knex.schema.hasTable('exercise'))) {
    await knex.schema.createTable('exercise', table => {
      table.increments('id').references('item.id')
      table.enum('difficulty', ['easy', 'medium', 'hard']).notNullable()
      table.integer('duration_minutes').notNullable()
      table.integer('calories').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('exercise_muscle'))) {
    await knex.schema.createTable('exercise_muscle', table => {
      table.increments('id')
      table.integer('exercise_id').unsigned().notNullable().references('exercise.id')
      table.text('muscle').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('exercise_equipment'))) {
    await knex.schema.createTable('exercise_equipment', table => {
      table.increments('id')
      table.integer('exercise_id').unsigned().notNullable().references('exercise.id')
      table.text('equipment').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('yoga_pose'))) {
    await knex.schema.createTable('yoga_pose', table => {
      table.increments('id').references('item.id')
      table.text('sanskrit_name').notNullable()
      table.enum('difficulty', ['beginner', 'intermediate', 'advanced']).notNullable()
      table.integer('duration_minutes').notNullable()
      table.text('instructor').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('yoga_benefit'))) {
    await knex.schema.createTable('yoga_benefit', table => {
      table.increments('id')
      table.integer('pose_id').unsigned().notNullable().references('yoga_pose.id')
      table.text('benefit').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('software'))) {
    await knex.schema.createTable('software', table => {
      table.increments('id').references('item.id')
      table.text('license').notNullable()
      table.text('github_url').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('software_language'))) {
    await knex.schema.createTable('software_language', table => {
      table.increments('id')
      table.integer('software_id').unsigned().notNullable().references('software.id')
      table.text('language').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('hardware'))) {
    await knex.schema.createTable('hardware', table => {
      table.increments('id').references('item.id')
      table.text('license').notNullable()
      table.text('schematic_url').notNullable()
      table.text('manufacturer').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('hardware_component'))) {
    await knex.schema.createTable('hardware_component', table => {
      table.increments('id')
      table.integer('hardware_id').unsigned().notNullable().references('hardware.id')
      table.text('component').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('font'))) {
    await knex.schema.createTable('font', table => {
      table.increments('id').references('item.id')
      table.text('designer').notNullable()
      table.enum('file_format', ['TTF', 'OTF', 'WOFF', 'WOFF2']).notNullable()
      table.text('download_url').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('font_style'))) {
    await knex.schema.createTable('font_style', table => {
      table.increments('id')
      table.integer('font_id').unsigned().notNullable().references('font.id')
      table.text('style').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('font_language'))) {
    await knex.schema.createTable('font_language', table => {
      table.increments('id')
      table.integer('font_id').unsigned().notNullable().references('font.id')
      table.text('language').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('classical_music'))) {
    await knex.schema.createTable('classical_music', table => {
      table.increments('id').references('item.id')
      table.text('composer').notNullable()
      table.text('period').notNullable()
      table.integer('duration_minutes').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('music_instrument'))) {
    await knex.schema.createTable('music_instrument', table => {
      table.increments('id')
      table.integer('music_id').unsigned().notNullable().references('classical_music.id')
      table.text('instrument').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('wiki_entry'))) {
    await knex.schema.createTable('wiki_entry', table => {
      table.increments('id').references('item.id')
      table.text('last_editor').notNullable()
      table.text('last_edit_date').notNullable()
      table.integer('views').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('wiki_language'))) {
    await knex.schema.createTable('wiki_language', table => {
      table.increments('id')
      table.integer('entry_id').unsigned().notNullable().references('wiki_entry.id')
      table.text('language').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('wiki_reference'))) {
    await knex.schema.createTable('wiki_reference', table => {
      table.increments('id')
      table.integer('entry_id').unsigned().notNullable().references('wiki_entry.id')
      table.text('reference').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('attraction'))) {
    await knex.schema.createTable('attraction', table => {
      table.increments('id').references('item.id')
      table.text('address').notNullable()
      table.text('city').notNullable()
      table.text('country').notNullable()
      table.text('opening_hours').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('attraction_facility'))) {
    await knex.schema.createTable('attraction_facility', table => {
      table.increments('id')
      table.integer('attraction_id').unsigned().notNullable().references('attraction.id')
      table.text('facility').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('pet_breed'))) {
    await knex.schema.createTable('pet_breed', table => {
      table.increments('id').references('item.id')
      table.text('species').notNullable()
      table.text('origin').notNullable()
      table.text('lifespan').notNullable()
      table.enum('size', ['small', 'medium', 'large']).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('breed_temperament'))) {
    await knex.schema.createTable('breed_temperament', table => {
      table.increments('id')
      table.integer('breed_id').unsigned().notNullable().references('pet_breed.id')
      table.text('temperament').notNullable()
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
  await knex.schema.dropTableIfExists('breed_temperament')
  await knex.schema.dropTableIfExists('pet_breed')
  await knex.schema.dropTableIfExists('attraction_facility')
  await knex.schema.dropTableIfExists('attraction')
  await knex.schema.dropTableIfExists('wiki_reference')
  await knex.schema.dropTableIfExists('wiki_language')
  await knex.schema.dropTableIfExists('wiki_entry')
  await knex.schema.dropTableIfExists('music_instrument')
  await knex.schema.dropTableIfExists('classical_music')
  await knex.schema.dropTableIfExists('font_language')
  await knex.schema.dropTableIfExists('font_style')
  await knex.schema.dropTableIfExists('font')
  await knex.schema.dropTableIfExists('hardware_component')
  await knex.schema.dropTableIfExists('hardware')
  await knex.schema.dropTableIfExists('software_language')
  await knex.schema.dropTableIfExists('software')
  await knex.schema.dropTableIfExists('yoga_benefit')
  await knex.schema.dropTableIfExists('yoga_pose')
  await knex.schema.dropTableIfExists('exercise_equipment')
  await knex.schema.dropTableIfExists('exercise_muscle')
  await knex.schema.dropTableIfExists('exercise')
  await knex.schema.dropTableIfExists('course_prerequisite')
  await knex.schema.dropTableIfExists('course')
  await knex.schema.dropTableIfExists('item_tag')
  await knex.schema.dropTableIfExists('tag')
  await knex.schema.dropTableIfExists('item')
  await knex.schema.dropTableIfExists('user')
}
