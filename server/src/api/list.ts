import { Router, Request, Response } from 'express'
import { Course, Item } from '../proxy'
import {
  BaseItem,
  CourseItem,
  ExerciseItem,
  YogaPoseItem,
  SoftwareItem,
  HardwareItem,
  FontItem,
  ClassicalMusicItem,
  WikiEntryItem,
  AttractionItem,
  PetBreedItem,
  ListResponse,
  PaginationInfo,
} from './types'
import { db } from '../db'
import { parseListQuery } from './list-query'
import { knex } from '../knex'
import { HttpError } from '../error'
import {
  Exercise,
  YogaPose,
  Software,
  Hardware,
  Font,
  ClassicalMusic,
  WikiEntry,
  Attraction,
  PetBreed,
} from '../proxy'

export let listRouter: Router = Router()

let select_item_tag = db
  .prepare<{ item_id: number }, string>(
    /* sql */ `
select
  tag.name
from item_tag
inner join tag on tag.id = item_tag.tag_id
where item_tag.item_id = :item_id
`,
  )
  .pluck()

function genListHandler<T, R extends BaseItem>(options: {
  path: string
  table: string
  mapItem: (item: Item & T & { id: number; tags: string[] }) => R
}) {
  let { table, mapItem } = options
  async function handleRequest(req: Request, res: Response) {
    try {
      let query = parseListQuery(req)
      let search = '%' + query.search + '%'
      let { category, sort, order, page, limit } = query
      let buildQuery = () =>
        knex(table)
          .innerJoin('item', 'item.id', `${table}.id`)
          .orderBy(sort, order)
          .andWhereRaw(`(title like ? or description like ?)`, [search, search])
          .andWhereRaw(`(category = ? or ? is null)`, [category, category])
      let rows: Array<Item & T> = await buildQuery()
        .select('*')
        .limit(limit)
        .offset((page - 1) * limit)
      let sql = buildQuery().toSQL()
      console.log({ sql: sql.sql, bindings: sql.bindings })
      let row = await buildQuery().count('* as count').first()
      let total = (row?.count as number) || 0
      let items = rows.map(row => {
        let id = row.id!
        return mapItem({
          id,
          tags: select_item_tag.all({ item_id: id }),
          ...row,
        })
      })
      let pagination: PaginationInfo = {
        page,
        limit,
        total,
      }

      let json: ListResponse<R> = {
        items,
        pagination,
      }
      res.json(json)
    } catch (error) {
      res.status((error as HttpError).statusCode || 500)
      res.json({ error: String(error) })
    }
  }
  listRouter.get(options.path, handleRequest)
}

let select_course_prerequisites = db.prepare<
  { course_id: number },
  string
>(/* sql */ `
select
  prerequisite
from course_prerequisite
where course_prerequisite.course_id = :course_id
`)

// 1. Programming Courses
genListHandler<Course, CourseItem>({
  path: '/courses',
  table: 'course',
  mapItem: item => {
    return {
      ...item,
      prerequisites: select_course_prerequisites.all({ course_id: item.id }),
    }
  },
})

// 2. Exercise Tutorials
let select_exercise_muscles = db
  .prepare<{ exercise_id: number }, string>(
    /* sql */ `
  select muscle from exercise_muscle where exercise_id = :exercise_id
`,
  )
  .pluck()

let select_exercise_equipment = db
  .prepare<{ exercise_id: number }, string>(
    /* sql */ `
  select equipment from exercise_equipment where exercise_id = :exercise_id
`,
  )
  .pluck()

genListHandler<Exercise, ExerciseItem>({
  path: '/exercises',
  table: 'exercise',
  mapItem: item => ({
    ...item,
    target_muscles: select_exercise_muscles.all({ exercise_id: item.id }),
    equipment: select_exercise_equipment.all({ exercise_id: item.id }),
  }),
})

// 3. Yoga Poses
let select_yoga_benefits = db
  .prepare<{ pose_id: number }, string>(
    /* sql */ `
  select benefit from yoga_benefit where pose_id = :pose_id
`,
  )
  .pluck()

genListHandler<YogaPose, YogaPoseItem>({
  path: '/yoga-poses',
  table: 'yoga_pose',
  mapItem: item => ({
    ...item,
    benefits: select_yoga_benefits.all({ pose_id: item.id }),
  }),
})

// 4. Software
let select_software_languages = db
  .prepare<{ software_id: number }, string>(
    /* sql */ `
  select language from software_language where software_id = :software_id
`,
  )
  .pluck()

genListHandler<Software, SoftwareItem>({
  path: '/software',
  table: 'software',
  mapItem: item => ({
    ...item,
    programming_languages: select_software_languages.all({
      software_id: item.id,
    }),
  }),
})

// 5. Hardware
let select_hardware_components = db
  .prepare<{ hardware_id: number }, string>(
    /* sql */ `
  select component from hardware_component where hardware_id = :hardware_id
`,
  )
  .pluck()

genListHandler<Hardware, HardwareItem>({
  path: '/hardware',
  table: 'hardware',
  mapItem: item => ({
    ...item,
    components: select_hardware_components.all({ hardware_id: item.id }),
  }),
})

// 6. Fonts
let select_font_styles = db
  .prepare<{ font_id: number }, string>(
    /* sql */ `
  select style from font_style where font_id = :font_id
`,
  )
  .pluck()

let select_font_languages = db
  .prepare<{ font_id: number }, string>(
    /* sql */ `
  select language from font_language where font_id = :font_id
`,
  )
  .pluck()

genListHandler<Font, FontItem>({
  path: '/fonts',
  table: 'font',
  mapItem: item => ({
    ...item,
    styles: select_font_styles.all({ font_id: item.id }),
    languages: select_font_languages.all({ font_id: item.id }),
  }),
})

// 7. Classical Music
let select_music_instruments = db
  .prepare<{ music_id: number }, string>(
    /* sql */ `
  select instrument from music_instrument where music_id = :music_id
`,
  )
  .pluck()

let select_music_movements = db
  .prepare<{ music_id: number }, string>(
    /* sql */ `
  select movement from music_movement where music_id = :music_id
`,
  )
  .pluck()

genListHandler<ClassicalMusic, ClassicalMusicItem>({
  path: '/classical-music',
  table: 'classical_music',
  mapItem: item => ({
    ...item,
    instruments: select_music_instruments.all({ music_id: item.id }),
    movements: select_music_movements.all({ music_id: item.id }),
  }),
})

// 8. Wiki Entries
let select_wiki_languages = db
  .prepare<{ entry_id: number }, string>(
    /* sql */ `
  select language from wiki_language where entry_id = :entry_id
`,
  )
  .pluck()

let select_wiki_references = db
  .prepare<{ entry_id: number }, string>(
    /* sql */ `
  select reference from wiki_reference where entry_id = :entry_id
`,
  )
  .pluck()

genListHandler<WikiEntry, WikiEntryItem>({
  path: '/wiki-entries',
  table: 'wiki_entry',
  mapItem: item => ({
    ...item,
    languages: select_wiki_languages.all({ entry_id: item.id }),
    references: select_wiki_references.all({ entry_id: item.id }),
  }),
})

// 9. Attractions
let select_attraction_facilities = db
  .prepare<{ attraction_id: number }, string>(
    /* sql */ `
  select facility from attraction_facility where attraction_id = :attraction_id
`,
  )
  .pluck()

genListHandler<Attraction, AttractionItem>({
  path: '/attractions',
  table: 'attraction',
  mapItem: item => ({
    ...item,
    facilities: select_attraction_facilities.all({ attraction_id: item.id }),
  }),
})

// 10. Pet Breeds
let select_breed_temperaments = db
  .prepare<{ breed_id: number }, string>(
    /* sql */ `
  select temperament from breed_temperament where breed_id = :breed_id
`,
  )
  .pluck()

genListHandler<PetBreed, PetBreedItem>({
  path: '/pet-breeds',
  table: 'pet_breed',
  mapItem: item => ({
    ...item,
    temperaments: select_breed_temperaments.all({ breed_id: item.id }),
  }),
})
