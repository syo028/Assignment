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
    bookmark: [
      /* foreign references */
      ['user', { field: 'user_id', table: 'user' }],
      ['item', { field: 'item_id', table: 'item' }],
    ],
  },
})
