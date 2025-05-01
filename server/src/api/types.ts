// Base item interface with common fields
export interface BaseItem {
  id: number
  title: string
  description: string
  category: string
  image_url: string
  video_url?: string
  tags: string[]
  published_at: string
}

// 1. Programming Courses
export interface CourseItem extends BaseItem {
  language: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_minutes: number
  prerequisites: string[]
  instructor: string
}

// 2. Exercise Tutorials
export interface ExerciseItem extends BaseItem {
  difficulty: 'easy' | 'medium' | 'hard'
  target_muscles: string[]
  equipment: string[]
  duration_minutes: number
  calories: number
}

// 3. Yoga Poses
export interface YogaPoseItem extends BaseItem {
  sanskrit_name: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  benefits: string[]
  duration_minutes: number
  instructor: string
}

// 4. Open Source Software
export interface SoftwareItem extends BaseItem {
  license: string
  programming_languages: string[]
  github_url: string
}

// 5. Open Source Hardware
export interface HardwareItem extends BaseItem {
  license: string
  components: string[]
  schematic_url: string
  manufacturer: string
}

// 6. Free Fonts
export interface FontItem extends BaseItem {
  designer: string
  styles: string[]
  file_format: 'TTF' | 'OTF' | 'WOFF' | 'WOFF2'
  languages: string[]
  download_url: string
}

// 7. Classical Music
export interface ClassicalMusicItem extends BaseItem {
  composer: string
  period: string
  instruments: string[]
  movements: string[]
  duration_minutes: number
}

// 8. Wikipedia Entries
export interface WikiEntryItem extends BaseItem {
  last_editor: string
  last_edit_date: string
  languages: string[]
  references: string[]
  views: number
}

// 9. Public Attractions
export interface AttractionItem extends BaseItem {
  address: string
  city: string
  country: string
  opening_hours: string
  facilities: string[]
}

// 10. Pet Breeds
export interface PetBreedItem extends BaseItem {
  species: string
  origin: string
  lifespan: string
  temperaments: string[]
  size: 'small' | 'medium' | 'large'
}

// Response types
export interface PaginationInfo {
  page: number
  limit: number
  total: number
}

export interface ListResponse<T extends BaseItem> {
  items: T[]
  pagination: PaginationInfo
}

// Auth types
export interface AuthRequest {
  username: string
  password: string
}

export interface AuthResponse {
  user_id: number
  token: string
}

export interface BookmarksResponse {
  item_ids: number[]
}

export interface ErrorResponse {
  error: string
}
