import { proxySchema } from 'better-sqlite3-proxy'
import { db } from './db'

export type User = {
  id?: null | number
  username: string
  password_hash: string
}

export type Session = {
  id?: null | number
  user_id: number
  user?: User
  token: string
}

export type Url = {
  id?: null | number
  url: string
}

export type Method = {
  id?: null | number
  method: string
}

export type UserAgent = {
  id?: null | number
  user_agent: string
}

export type RequestLog = {
  id?: null | number
  method_id: number
  method?: Method
  url_id: number
  url?: Url
  user_id: null | number
  user?: User
  user_agent_id: null | number
  user_agent?: UserAgent
  timestamp: number
}

export type Item = {
  id?: null | number
  title: string
  description: string
  category: string
  image_url: string
  video_url: string
  published_at: string
}

export type Tag = {
  id?: null | number
  name: string
}

export type ItemTag = {
  id?: null | number
  item_id: number
  item?: Item
  tag_id: number
  tag?: Tag
}

export type Course = {
  id?: null | number
  item_id: number
  item?: Item
  language: string
  level: ('beginner' | 'intermediate' | 'advanced')
  duration_minutes: number
  instructor: string
}

export type CoursePrerequisite = {
  id?: null | number
  course_id: number
  course?: Course
  prerequisite: string
}

export type Exercise = {
  id?: null | number
  item?: Item
  difficulty: ('easy' | 'medium' | 'hard')
  duration_minutes: number
  calories: number
}

export type ExerciseMuscle = {
  id?: null | number
  exercise_id: number
  exercise?: Exercise
  muscle: string
}

export type ExerciseEquipment = {
  id?: null | number
  exercise_id: number
  exercise?: Exercise
  equipment: string
}

export type YogaPose = {
  id?: null | number
  item?: Item
  sanskrit_name: string
  difficulty: ('beginner' | 'intermediate' | 'advanced')
  duration_minutes: number
  instructor: string
}

export type YogaBenefit = {
  id?: null | number
  pose_id: number
  pose?: YogaPose
  benefit: string
}

export type Software = {
  id?: null | number
  item?: Item
  license: string
  github_url: string
}

export type SoftwareLanguage = {
  id?: null | number
  software_id: number
  software?: Software
  language: string
}

export type Hardware = {
  id?: null | number
  item?: Item
  license: string
  schematic_url: string
  manufacturer: string
}

export type HardwareComponent = {
  id?: null | number
  hardware_id: number
  hardware?: Hardware
  component: string
}

export type Font = {
  id?: null | number
  item?: Item
  designer: string
  file_format: ('TTF' | 'OTF' | 'WOFF' | 'WOFF2')
  download_url: string
}

export type FontStyle = {
  id?: null | number
  font_id: number
  font?: Font
  style: string
}

export type FontLanguage = {
  id?: null | number
  font_id: number
  font?: Font
  language: string
}

export type ClassicalMusic = {
  id?: null | number
  item?: Item
  composer: string
  period: string
  duration_minutes: number
}

export type MusicMovement = {
  id?: null | number
  music_id: number
  music?: ClassicalMusic
  movement: string
}

export type MusicInstrument = {
  id?: null | number
  music_id: number
  music?: ClassicalMusic
  instrument: string
}

export type WikiEntry = {
  id?: null | number
  item?: Item
  last_editor: string
  last_edit_date: string
  views: number
}

export type WikiLanguage = {
  id?: null | number
  entry_id: number
  entry?: WikiEntry
  language: string
}

export type WikiReference = {
  id?: null | number
  entry_id: number
  entry?: WikiEntry
  reference: string
}

export type Attraction = {
  id?: null | number
  item?: Item
  address: string
  city: string
  country: string
  opening_hours: string
}

export type AttractionFacility = {
  id?: null | number
  attraction_id: number
  attraction?: Attraction
  facility: string
}

export type PetBreed = {
  id?: null | number
  item?: Item
  species: string
  origin: string
  lifespan: string
  size: ('small' | 'medium' | 'large')
}

export type BreedTemperament = {
  id?: null | number
  breed_id: number
  breed?: PetBreed
  temperament: string
}

export type Bookmark = {
  id?: null | number
  user_id: number
  user?: User
  item_id: number
  item?: Item
  created_at: string
}

export type DBProxy = {
  user: User[]
  session: Session[]
  url: Url[]
  method: Method[]
  user_agent: UserAgent[]
  request_log: RequestLog[]
  item: Item[]
  tag: Tag[]
  item_tag: ItemTag[]
  course: Course[]
  course_prerequisite: CoursePrerequisite[]
  exercise: Exercise[]
  exercise_muscle: ExerciseMuscle[]
  exercise_equipment: ExerciseEquipment[]
  yoga_pose: YogaPose[]
  yoga_benefit: YogaBenefit[]
  software: Software[]
  software_language: SoftwareLanguage[]
  hardware: Hardware[]
  hardware_component: HardwareComponent[]
  font: Font[]
  font_style: FontStyle[]
  font_language: FontLanguage[]
  classical_music: ClassicalMusic[]
  music_movement: MusicMovement[]
  music_instrument: MusicInstrument[]
  wiki_entry: WikiEntry[]
  wiki_language: WikiLanguage[]
  wiki_reference: WikiReference[]
  attraction: Attraction[]
  attraction_facility: AttractionFacility[]
  pet_breed: PetBreed[]
  breed_temperament: BreedTemperament[]
  bookmark: Bookmark[]
}

export let proxy = proxySchema<DBProxy>({
  db,
  tableFields: {
    user: [],
    session: [
      /* foreign references */
      ['user', { field: 'user_id', table: 'user' }],
    ],
    url: [],
    method: [],
    user_agent: [],
    request_log: [
      /* foreign references */
      ['method', { field: 'method_id', table: 'method' }],
      ['url', { field: 'url_id', table: 'url' }],
      ['user', { field: 'user_id', table: 'user' }],
      ['user_agent', { field: 'user_agent_id', table: 'user_agent' }],
    ],
    item: [],
    tag: [],
    item_tag: [
      /* foreign references */
      ['item', { field: 'item_id', table: 'item' }],
      ['tag', { field: 'tag_id', table: 'tag' }],
    ],
    course: [
      /* foreign references */
      ['item', { field: 'item_id', table: 'item' }],
    ],
    course_prerequisite: [
      /* foreign references */
      ['course', { field: 'course_id', table: 'course' }],
    ],
    exercise: [
      /* foreign references */
      ['item', { field: 'id', table: 'item' }],
    ],
    exercise_muscle: [
      /* foreign references */
      ['exercise', { field: 'exercise_id', table: 'exercise' }],
    ],
    exercise_equipment: [
      /* foreign references */
      ['exercise', { field: 'exercise_id', table: 'exercise' }],
    ],
    yoga_pose: [
      /* foreign references */
      ['item', { field: 'id', table: 'item' }],
    ],
    yoga_benefit: [
      /* foreign references */
      ['pose', { field: 'pose_id', table: 'yoga_pose' }],
    ],
    software: [
      /* foreign references */
      ['item', { field: 'id', table: 'item' }],
    ],
    software_language: [
      /* foreign references */
      ['software', { field: 'software_id', table: 'software' }],
    ],
    hardware: [
      /* foreign references */
      ['item', { field: 'id', table: 'item' }],
    ],
    hardware_component: [
      /* foreign references */
      ['hardware', { field: 'hardware_id', table: 'hardware' }],
    ],
    font: [
      /* foreign references */
      ['item', { field: 'id', table: 'item' }],
    ],
    font_style: [
      /* foreign references */
      ['font', { field: 'font_id', table: 'font' }],
    ],
    font_language: [
      /* foreign references */
      ['font', { field: 'font_id', table: 'font' }],
    ],
    classical_music: [
      /* foreign references */
      ['item', { field: 'id', table: 'item' }],
    ],
    music_movement: [
      /* foreign references */
      ['music', { field: 'music_id', table: 'classical_music' }],
    ],
    music_instrument: [
      /* foreign references */
      ['music', { field: 'music_id', table: 'classical_music' }],
    ],
    wiki_entry: [
      /* foreign references */
      ['item', { field: 'id', table: 'item' }],
    ],
    wiki_language: [
      /* foreign references */
      ['entry', { field: 'entry_id', table: 'wiki_entry' }],
    ],
    wiki_reference: [
      /* foreign references */
      ['entry', { field: 'entry_id', table: 'wiki_entry' }],
    ],
    attraction: [
      /* foreign references */
      ['item', { field: 'id', table: 'item' }],
    ],
    attraction_facility: [
      /* foreign references */
      ['attraction', { field: 'attraction_id', table: 'attraction' }],
    ],
    pet_breed: [
      /* foreign references */
      ['item', { field: 'id', table: 'item' }],
    ],
    breed_temperament: [
      /* foreign references */
      ['breed', { field: 'breed_id', table: 'pet_breed' }],
    ],
    bookmark: [
      /* foreign references */
      ['user', { field: 'user_id', table: 'user' }],
      ['item', { field: 'item_id', table: 'item' }],
    ],
  },
})
