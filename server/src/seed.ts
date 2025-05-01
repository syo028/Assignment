import { find, seedRow, update } from 'better-sqlite3-proxy'
import {
  Item,
  Course,
  Exercise,
  YogaPose,
  Software,
  Hardware,
  Font,
  ClassicalMusic,
  WikiEntry,
  Attraction,
  PetBreed,
  proxy,
} from './proxy'
import { searchImage, searchYoutube } from 'media-search'

async function searchImageUrl(keyword: string) {
  console.log('searching image:', keyword)
  let images = await searchImage({ keyword })
  for (let image of images) {
    // check if the image is available
    let ok = await fetch(image.url)
      .then(res => res.ok)
      .catch(() => false)
    if (ok) {
      return image.url
    }
  }
  return ''
}

async function searchYoutubeUrl(keyword: string) {
  console.log('searching video:', keyword)
  let result = await searchYoutube({ keyword })
  for (let item of result.items) {
    return `https://www.youtube.com/watch?v=${item.id}`
  }
  return ''
}

type SeedItem = Omit<Item, 'image_url' | 'video_url'> & { tags: string[] }

async function seedItem(input: { item: SeedItem }) {
  let { tags, ...item } = input.item
  let row = find(proxy.item, { title: item.title })
  let item_id: number
  if (row) {
    update(proxy.item, { id: row.id }, item)
    if (!row.image_url) {
      row.image_url = await searchImageUrl(item.title)
    }
    if (!row.video_url) {
      row.video_url = await searchYoutubeUrl(item.title)
    }
    item_id = row.id!
  } else {
    let image_url = await searchImageUrl(item.title)
    let video_url = await searchYoutubeUrl(item.title)
    item_id = proxy.item.push({ ...item, image_url, video_url })
  }
  for (let tag of tags) {
    let tag_id = seedRow(proxy.tag, { name: tag })
    seedRow(proxy.item_tag, { item_id, tag_id })
  }
  return item_id
}

// 主題 1: 程式教學
async function seedCourse(input: {
  item: SeedItem
  course: Omit<Course, 'item_id'>
  prerequisite: string[]
}) {
  let { item, course } = input
  let item_id = await seedItem({ item })
  seedRow(proxy.course, { item_id }, course)
  for (let prerequisite of input.prerequisite) {
    seedRow(proxy.course_prerequisite, {
      course_id: item_id,
      prerequisite,
    })
  }
}

// 主題 2: 運動教學
async function seedExercise(input: {
  item: SeedItem
  exercise: Omit<Exercise, 'item_id'>
  muscles: string[]
  equipment: string[]
}) {
  let { item, exercise } = input
  let item_id = await seedItem({ item })
  seedRow(proxy.exercise, { id: item_id }, exercise)
  for (let muscle of input.muscles) {
    seedRow(proxy.exercise_muscle, {
      exercise_id: item_id,
      muscle,
    })
  }
  for (let equipment of input.equipment) {
    seedRow(proxy.exercise_equipment, {
      exercise_id: item_id,
      equipment,
    })
  }
}

// 主題 3: 瑜伽動作
async function seedYogaPose(input: {
  item: SeedItem
  pose: Omit<YogaPose, 'item_id'>
  benefits: string[]
}) {
  let { item, pose } = input
  let item_id = await seedItem({ item })
  seedRow(proxy.yoga_pose, { id: item_id }, pose)
  for (let benefit of input.benefits) {
    seedRow(proxy.yoga_benefit, {
      pose_id: item_id,
      benefit,
    })
  }
}

// 主題 4: 開源軟體
async function seedSoftware(input: {
  item: SeedItem
  software: Omit<Software, 'item_id'>
  languages: string[]
}) {
  let { item, software } = input
  let item_id = await seedItem({ item })
  seedRow(proxy.software, { id: item_id }, software)
  for (let language of input.languages) {
    seedRow(proxy.software_language, {
      software_id: item_id,
      language,
    })
  }
}

// 主題 5: 開源硬體
async function seedHardware(input: {
  item: SeedItem
  hardware: Omit<Hardware, 'item_id'>
  components: string[]
}) {
  let { item, hardware } = input
  let item_id = await seedItem({ item })
  seedRow(proxy.hardware, { id: item_id }, hardware)
  for (let component of input.components) {
    seedRow(proxy.hardware_component, {
      hardware_id: item_id,
      component,
    })
  }
}

// 主題 6: 免費字體
async function seedFont(input: {
  item: SeedItem
  font: Omit<Font, 'item_id'>
  styles: string[]
  languages: string[]
}) {
  let { item, font } = input
  let item_id = await seedItem({ item })
  seedRow(proxy.font, { id: item_id }, font)
  for (let style of input.styles) {
    seedRow(proxy.font_style, {
      font_id: item_id,
      style,
    })
  }
  for (let language of input.languages) {
    seedRow(proxy.font_language, {
      font_id: item_id,
      language,
    })
  }
}

// 主題 7: 古典音樂
async function seedClassicalMusic(input: {
  item: SeedItem
  music: Omit<ClassicalMusic, 'item_id'>
  movements: string[]
  instruments: string[]
}) {
  let { item, music } = input
  let item_id = await seedItem({ item })
  seedRow(proxy.classical_music, { id: item_id }, music)
  for (let movement of input.movements) {
    seedRow(proxy.music_movement, {
      music_id: item_id,
      movement,
    })
  }
  for (let instrument of input.instruments) {
    seedRow(proxy.music_instrument, {
      music_id: item_id,
      instrument,
    })
  }
}

// 主題 8: 維基百科
async function seedWikiEntry(input: {
  item: SeedItem
  entry: Omit<WikiEntry, 'item_id'>
  languages: string[]
  references: string[]
}) {
  let { item, entry } = input
  let item_id = await seedItem({ item })
  seedRow(proxy.wiki_entry, { id: item_id }, entry)
  for (let language of input.languages) {
    seedRow(proxy.wiki_language, {
      entry_id: item_id,
      language,
    })
  }
  for (let reference of input.references) {
    seedRow(proxy.wiki_reference, {
      entry_id: item_id,
      reference,
    })
  }
}

// 主題 9: 公眾景點
async function seedAttraction(input: {
  item: SeedItem
  attraction: Omit<Attraction, 'item_id'>
  facilities: string[]
}) {
  let { item, attraction } = input
  let item_id = await seedItem({ item })
  seedRow(proxy.attraction, { id: item_id }, attraction)
  for (let facility of input.facilities) {
    seedRow(proxy.attraction_facility, {
      attraction_id: item_id,
      facility,
    })
  }
}

// 主題 10: 寵物品種
async function seedPetBreed(input: {
  item: SeedItem
  breed: Omit<PetBreed, 'item_id'>
  temperaments: string[]
}) {
  let { item, breed } = input
  let item_id = await seedItem({ item })
  seedRow(proxy.pet_breed, { id: item_id }, breed)
  for (let temperament of input.temperaments) {
    seedRow(proxy.breed_temperament, {
      breed_id: item_id,
      temperament,
    })
  }
}

async function main() {
  // 1. Programming Courses
  {
    // Programming Course - 1
    await seedCourse({
      item: {
        title: 'Python 零基礎入門課程',
        description:
          '全面的 Python 程式語言入門課程。學習基本概念、資料結構，並建立實際應用程式。',
        category: '程式基礎',
        published_at: '2024-01-15',
        tags: ['Python', '程式入門', '零基礎', '資料結構'],
      },
      course: {
        language: 'Python',
        level: 'beginner' as const,
        duration_minutes: 30 * 60,
        instructor: '陳思穎',
      },
      prerequisite: ['基本電腦操作技能', '無需程式設計經驗'],
    })

    // Programming Course - 2
    await seedCourse({
      item: {
        title: '進階 JavaScript 與現代 ES6+',
        description:
          '掌握現代 JavaScript 特性、非同步程式設計，以及網頁開發進階概念。',
        category: '網頁開發',
        published_at: '2024-01-20',
        tags: ['JavaScript', 'ES6', '網頁開發', '非同步程式設計'],
      },
      course: {
        language: 'JavaScript',
        level: 'advanced' as const,
        duration_minutes: 25 * 60,
        instructor: '張志明',
      },
      prerequisite: ['基礎 JavaScript 知識', 'HTML/CSS 基礎'],
    })

    // Programming Course - 3
    await seedCourse({
      item: {
        title: 'React.js 完整指南',
        description:
          '學習使用 React.js 建立現代網頁應用。涵蓋組件、Hooks、狀態管理和實際專案開發。',
        category: '網頁開發',
        published_at: '2024-01-25',
        tags: ['React.js', '網頁開發', '組件', 'Hooks', '狀態管理'],
      },
      course: {
        language: 'React',
        level: 'intermediate' as const,
        duration_minutes: 20 * 60,
        instructor: '黃美玲',
      },
      prerequisite: ['JavaScript 基礎', '基本 HTML/CSS', 'ES6 知識'],
    })

    // Programming Course - 4
    await seedCourse({
      item: {
        title: 'R 語言數據科學',
        description: '使用 R 程式語言進行全面的數據分析、視覺化和統計建模。',
        category: '數據科學',
        published_at: '2024-02-01',
        tags: ['R', '數據科學', '統計建模', '視覺化'],
      },
      course: {
        language: 'R',
        level: 'intermediate' as const,
        duration_minutes: 28 * 60,
        instructor: '張博士',
      },
      prerequisite: ['基礎統計知識', '程式設計概念'],
    })

    // Programming Course - 5
    await seedCourse({
      item: {
        title: 'iOS 開發與 Swift',
        description:
          '從零開始學習 iOS 應用程式開發。學習 Swift 程式設計、UI 設計模式和 App Store 發布。',
        category: '手機開發',
        published_at: '2024-02-05',
        tags: ['iOS', 'Swift', '手機開發', 'UI 設計模式', 'App Store 發布'],
      },
      course: {
        language: 'Swift',
        level: 'beginner' as const,
        duration_minutes: 35 * 60,
        instructor: '李詠琪',
      },
      prerequisite: ['Mac 電腦', '無需 iOS 開發經驗'],
    })

    // Programming Course - 6
    await seedCourse({
      item: {
        title: 'Python 機器學習',
        description:
          '探索機器學習算法、神經網絡，以及使用 Python 和流行機器學習庫的實際 AI 應用。',
        category: '人工智能',
        published_at: '2024-02-10',
        tags: ['Python', '機器學習', '神經網絡', 'AI 應用'],
      },
      course: {
        language: 'Python',
        level: 'advanced' as const,
        duration_minutes: 40 * 60,
        instructor: '吳教授',
      },
      prerequisite: ['Python 程式設計', '線性代數', '統計學'],
    })

    // Programming Course - 7
    await seedCourse({
      item: {
        title: 'Java Spring Boot 精要',
        description:
          '掌握 Spring Boot 企業級應用開發。建立 RESTful API、處理安全性，以及使用數據庫。',
        category: '後端開發',
        published_at: '2024-02-15',
        tags: ['Java', 'Spring Boot', '企業級應用', 'RESTful API', '數據庫'],
      },
      course: {
        language: 'Java',
        level: 'intermediate' as const,
        duration_minutes: 32 * 60,
        instructor: '林大偉',
      },
      prerequisite: ['Java 基礎', '物件導向概念', 'SQL 基礎'],
    })

    // Programming Course - 8
    await seedCourse({
      item: {
        title: 'Go 語言後端開發',
        description:
          '學習使用 Go 語言開發高性能後端服務。涵蓋並發、微服務和雲端部署。',
        category: '後端開發',
        published_at: '2024-02-20',
        tags: ['Go', '後端開發', '高性能', '並發', '微服務', '雲端部署'],
      },
      course: {
        language: 'Go',
        level: 'intermediate' as const,
        duration_minutes: 25 * 60,
        instructor: '張文浩',
      },
      prerequisite: ['程式設計經驗', '後端開發概念'],
    })

    // Programming Course - 9
    await seedCourse({
      item: {
        title: 'TypeScript 進階模式',
        description: '深入探討 TypeScript 進階特性、設計模式和企業級應用架構。',
        category: '網頁開發',
        published_at: '2024-02-25',
        tags: ['TypeScript', '進階模式', '設計模式', '企業級應用架構'],
      },
      course: {
        language: 'TypeScript',
        level: 'advanced' as const,
        duration_minutes: 22 * 60,
        instructor: '陳安娜',
      },
      prerequisite: ['TypeScript 基礎', 'JavaScript 熟練度'],
    })

    // Programming Course - 10
    await seedCourse({
      item: {
        title: 'Rust 系統程式設計',
        description:
          '使用 Rust 構建高效且安全的系統級應用。學習記憶體管理、並發和底層程式設計。',
        category: '系統程式設計',
        published_at: '2024-03-01',
        tags: ['Rust', '系統程式設計', '高效', '安全', '記憶體管理', '並發'],
      },
      course: {
        language: 'Rust',
        level: 'advanced' as const,
        duration_minutes: 45 * 60,
        instructor: '黃博士',
      },
      prerequisite: ['系統程式設計概念', 'C/C++ 經驗有幫助'],
    })
  }

  // 2. Exercise Tutorials
  {
    // Exercise Tutorial - 1
    await seedExercise({
      item: {
        title: '全身高強度間歇訓練',
        description: '高強度間歇訓練，燃燒卡路里並改善心肺功能。',
        category: '心肺訓練',
        published_at: '2024-01-15',
        tags: ['HIIT', '心肺訓練', '減重', '全身訓練'],
      },
      exercise: {
        difficulty: 'medium' as const,
        duration_minutes: 30,
        calories: 300,
      },
      muscles: ['核心', '腿部', '手臂', '背部'],
      equipment: ['啞鈴', '運動墊'],
    })

    // Exercise Tutorial - 2
    await seedExercise({
      item: {
        title: '核心力量與穩定訓練',
        description: '通過針對性的腹部訓練，建立強健的核心肌群。',
        category: '力量訓練',
        published_at: '2024-01-20',
        tags: ['核心力量', '穩定訓練', '腹部訓練', '力量訓練'],
      },
      exercise: {
        difficulty: 'hard' as const,
        duration_minutes: 20,
        calories: 200,
      },
      muscles: ['腹肌', '斜肌', '下背部'],
      equipment: ['運動墊', '彈力帶'],
    })

    // Exercise Tutorial - 3
    await seedExercise({
      item: {
        title: '初學者徒手訓練',
        description: '完美的入門訓練，只需使用自身體重，無需任何器材。',
        category: '徒手訓練',
        published_at: '2024-01-25',
        tags: ['徒手訓練', '初學者適合', '全身訓練', '核心訓練'],
      },
      exercise: {
        difficulty: 'easy' as const,
        duration_minutes: 25,
        calories: 150,
      },
      muscles: ['全身', '核心', '腿部'],
      equipment: ['無需器材'],
    })

    // Exercise Tutorial - 4
    await seedExercise({
      item: {
        title: '上半身力量訓練',
        description: '通過這個強度訓練，增強上半身肌肉力量。',
        category: '力量訓練',
        published_at: '2024-01-30',
        tags: ['力量訓練', '上半身', '肌肉力量', '訓練'],
      },
      exercise: {
        difficulty: 'hard' as const,
        duration_minutes: 45,
        calories: 350,
      },
      muscles: ['胸部', '肩部', '三頭肌', '背部', '二頭肌'],
      equipment: ['啞鈴', '槓鈴', '臥推凳', '引體向上架'],
    })

    // Exercise Tutorial - 5
    await seedExercise({
      item: {
        title: '下半身靈活度與力量訓練',
        description: '改善靈活度並增強腿部力量的全面訓練。',
        category: '靈活度訓練',
        published_at: '2024-02-05',
        tags: ['靈活度訓練', '腿部力量', '全面訓練', '肌肉力量'],
      },
      exercise: {
        difficulty: 'medium' as const,
        duration_minutes: 35,
        calories: 250,
      },
      muscles: ['股四頭肌', '腿後肌', '小腿', '臀部'],
      equipment: ['彈力帶', '泡沫軸'],
    })

    // Exercise Tutorial - 6
    await seedExercise({
      item: {
        title: '午休快速健身',
        description: '適合忙碌人士的15分鐘高效訓練。',
        category: '快速訓練',
        published_at: '2024-02-10',
        tags: ['快速訓練', '高效訓練', '忙碌人士', '15分鐘訓練'],
      },
      exercise: {
        difficulty: 'medium' as const,
        duration_minutes: 15,
        calories: 120,
      },
      muscles: ['核心', '手臂', '腿部'],
      equipment: ['彈力帶', '椅子'],
    })

    // Exercise Tutorial - 7
    await seedExercise({
      item: {
        title: '進階徒手健身',
        description: '掌握進階徒手動作，建立功能性力量。',
        category: '徒手訓練',
        published_at: '2024-02-15',
        tags: ['進階徒手健身', '功能性力量', '徒手訓練'],
      },
      exercise: {
        difficulty: 'hard' as const,
        duration_minutes: 50,
        calories: 400,
      },
      muscles: ['全身', '核心', '肩部', '背部'],
      equipment: ['引體向上架', '雙杠', '運動墊'],
    })

    // Exercise Tutorial - 8
    await seedExercise({
      item: {
        title: '銀髮族健身課程',
        description: '專為長者設計的安全有效訓練，維持力量和活動能力。',
        category: '銀髮族健身',
        published_at: '2024-02-20',
        tags: ['銀髮族健身', '安全有效訓練', '力量和活動能力'],
      },
      exercise: {
        difficulty: 'easy' as const,
        duration_minutes: 30,
        calories: 150,
      },
      muscles: ['全身', '核心', '平衡'],
      equipment: ['椅子', '輕量啞鈴', '彈力帶'],
    })

    // Exercise Tutorial - 9
    await seedExercise({
      item: {
        title: '壺鈴全身訓練',
        description: '使用壺鈴進行全身調理，同時訓練力量和心肺功能。',
        category: '力量訓練',
        published_at: '2024-02-25',
        tags: ['壺鈴', '全身訓練', '力量', '心肺功能'],
      },
      exercise: {
        difficulty: 'medium' as const,
        duration_minutes: 40,
        calories: 350,
      },
      muscles: ['全身', '核心', '腿部', '背部'],
      equipment: ['壺鈴', '運動墊'],
    })

    // Exercise Tutorial - 10
    await seedExercise({
      item: {
        title: '恢復與伸展例程',
        description: '必要的伸展和靈活性訓練，預防受傷並改善柔軟度。',
        category: '恢復訓練',
        published_at: '2024-03-01',
        tags: ['恢復訓練', '伸展', '靈活性訓練', '柔軟度'],
      },
      exercise: {
        difficulty: 'easy' as const,
        duration_minutes: 25,
        calories: 100,
      },
      muscles: ['全身', '髖部屈肌', '背部', '肩部'],
      equipment: ['泡沫軸', '運動墊', '彈力帶'],
    })
  }

  // 3. Yoga Poses
  {
    // Yoga Pose - 1
    seedYogaPose({
      item: {
        title: '下犬式',
        description:
          '一個基礎瑜伽姿勢，可以伸展和強化全身。適合初學者和進階練習者。',
        category: '站立式',
        published_at: '2024-01-15',
        tags: ['基礎動作', '全身伸展', '初學者適合', '站立式'],
      },
      pose: {
        sanskrit_name: 'Adho Mukha Svanasana',
        difficulty: 'beginner' as const,
        duration_minutes: 5,
        instructor: '陳美玲',
      },
      benefits: [
        '強化手臂和肩膀',
        '伸展脊椎和腿後肌',
        '平靜心神',
        '改善消化功能',
      ],
    })

    // Yoga Pose - 2
    seedYogaPose({
      item: {
        title: '樹式',
        description:
          '一個平衡姿勢，可以提升專注力和集中力，同時強化腿部和核心肌群。',
        category: '平衡式',
        published_at: '2024-01-20',
        tags: ['平衡式', '專注力', '腿部', '核心肌群'],
      },
      pose: {
        sanskrit_name: 'Vrksasana',
        difficulty: 'beginner' as const,
        duration_minutes: 3,
        instructor: '陳大文',
      },
      benefits: ['改善平衡感', '強化腿部和核心', '提升專注力', '建立自信心'],
    })

    // Yoga Pose - 3
    seedYogaPose({
      item: {
        title: '戰士一式',
        description:
          '一個強而有力的站立姿勢，可以強化腿部穩定性，同時打開胸部和肩膀。',
        category: '站立式',
        published_at: '2024-01-25',
        tags: ['站立式', '平衡式', '腿部穩定性', '胸部和肩膀'],
      },
      pose: {
        sanskrit_name: 'Virabhadrasana I',
        difficulty: 'intermediate' as const,
        duration_minutes: 4,
        instructor: '王美華',
      },
      benefits: ['強化腿部和核心', '打開髖關節', '改善姿勢', '增強耐力'],
    })

    // Yoga Pose - 4
    seedYogaPose({
      item: {
        title: '烏鴉式',
        description:
          '一個手臂平衡姿勢，可以強化上半身力量和核心穩定性，同時挑戰平衡感。',
        category: '手臂平衡式',
        published_at: '2024-01-30',
        tags: ['手臂平衡式', '上半身力量', '核心穩定性', '平衡感'],
      },
      pose: {
        sanskrit_name: 'Bakasana',
        difficulty: 'advanced' as const,
        duration_minutes: 2,
        instructor: '李志強',
      },
      benefits: [
        '強化手臂力量',
        '提升核心穩定性',
        '增強專注力',
        '改善手腕靈活度',
      ],
    })

    // Yoga Pose - 5
    seedYogaPose({
      item: {
        title: '嬰兒式',
        description:
          '一個休息姿勢，可以溫和地伸展背部、臀部和大腿，同時促進放鬆。',
        category: '休息式',
        published_at: '2024-02-05',
        tags: ['休息式', '背部伸展', '臀部和大腿', '放鬆'],
      },
      pose: {
        sanskrit_name: 'Balasana',
        difficulty: 'beginner' as const,
        duration_minutes: 5,
        instructor: '黃詠詩',
      },
      benefits: ['舒緩背部緊張', '平靜神經系統', '伸展臀部和大腿', '促進放鬆'],
    })

    // Yoga Pose - 6
    seedYogaPose({
      item: {
        title: '倒立式',
        description:
          '一個進階倒立姿勢，可以增強力量、平衡感和自信心，同時改善血液循環。',
        category: '倒立式',
        published_at: '2024-02-10',
        tags: ['倒立式', '力量', '平衡感', '自信心'],
      },
      pose: {
        sanskrit_name: 'Sirsasana',
        difficulty: 'advanced' as const,
        duration_minutes: 3,
        instructor: '沈嘉明',
      },
      benefits: ['改善血液循環', '強化核心力量', '增強專注力', '提升平衡感'],
    })

    // Yoga Pose - 7
    seedYogaPose({
      item: {
        title: '橋式',
        description: '一個後彎姿勢，可以打開胸部並強化脊椎、臀部和腿部。',
        category: '後彎式',
        published_at: '2024-02-15',
        tags: ['後彎式', '胸部', '脊椎', '臀部', '腿部'],
      },
      pose: {
        sanskrit_name: 'Setu Bandha Sarvangasana',
        difficulty: 'intermediate' as const,
        duration_minutes: 4,
        instructor: '林詩詩',
      },
      benefits: [
        '強化背部肌肉',
        '打開胸部和肩膀',
        '改善脊椎靈活度',
        '刺激甲狀腺',
      ],
    })

    // Yoga Pose - 8
    seedYogaPose({
      item: {
        title: '鴿子式',
        description:
          '一個開髖式姿勢，可以放鬆髖部和下背部的緊張，同時伸展大腿。',
        category: '開髖式',
        published_at: '2024-02-20',
        tags: ['開髖式', '髖部', '下背部', '伸展大腿'],
      },
      pose: {
        sanskrit_name: 'Eka Pada Rajakapotasana',
        difficulty: 'intermediate' as const,
        duration_minutes: 5,
        instructor: '吳雅琪',
      },
      benefits: ['打開髖關節', '舒緩下背部緊張', '伸展大腿', '平靜心神'],
    })

    // Yoga Pose - 9
    seedYogaPose({
      item: {
        title: '蓮花式',
        description: '一個冥想坐姿，需要髖部和膝蓋的靈活度，同時促進心靈清明。',
        category: '坐姿式',
        published_at: '2024-02-25',
        tags: ['坐姿式', '冥想', '髖部', '膝蓋', '靈活度', '心靈清明'],
      },
      pose: {
        sanskrit_name: 'Padmasana',
        difficulty: 'advanced' as const,
        duration_minutes: 10,
        instructor: '田中幸子',
      },
      benefits: ['提升冥想專注力', '打開髖部', '平靜神經系統', '促進良好姿勢'],
    })

    // Yoga Pose - 10
    seedYogaPose({
      item: {
        title: '屍式',
        description:
          '一個放鬆姿勢，讓身體能夠整合練習成果，同時促進深度休息和更新。',
        category: '休息式',
        published_at: '2024-03-01',
        tags: ['休息式', '整合練習成果', '深度休息', '更新'],
      },
      pose: {
        sanskrit_name: 'Savasana',
        difficulty: 'beginner' as const,
        duration_minutes: 10,
        instructor: '張美玲',
      },
      benefits: ['減輕壓力', '促進深度放鬆', '降低血壓', '改善睡眠品質'],
    })
  }

  // 4. Open Source Software
  {
    // Software - 1
    await seedSoftware({
      item: {
        title: 'VS Code 程式碼編輯器',
        description:
          '強大的開源程式碼編輯器，支援多種程式語言和豐富的擴充功能。',
        category: '開發工具',
        published_at: '2024-01-15',
        tags: ['VS Code', '程式碼編輯器', '開源', '程式語言', '擴充功能'],
      },
      software: {
        license: 'MIT',
        github_url: 'https://github.com/microsoft/vscode',
      },
      languages: ['TypeScript', 'JavaScript', 'CSS'],
    })

    // Software - 2
    await seedSoftware({
      item: {
        title: 'Firefox 瀏覽器',
        description: '注重隱私和安全的開源網頁瀏覽器，支援豐富的擴充套件。',
        category: '網頁瀏覽器',
        published_at: '2024-01-20',
        tags: ['Firefox', '瀏覽器', '開源', '隱私', '安全'],
      },
      software: {
        license: 'MPL-2.0',
        github_url: 'https://github.com/mozilla/gecko-dev',
      },
      languages: ['C++', 'JavaScript', 'Rust'],
    })

    // Software - 3
    await seedSoftware({
      item: {
        title: 'VLC 媒體播放器',
        description: '功能豐富的開源媒體播放器，支援幾乎所有影音格式。',
        category: '多媒體',
        published_at: '2024-01-25',
        tags: ['VLC', '媒體播放器', '開源', '影音格式', '多媒體'],
      },
      software: {
        license: 'GPL-2.0',
        github_url: 'https://github.com/videolan/vlc',
      },
      languages: ['C', 'C++', 'Objective-C'],
    })

    // Software - 4
    await seedSoftware({
      item: {
        title: 'GIMP 圖像編輯器',
        description: '專業級開源圖像編輯軟體，提供豐富的圖像處理工具。',
        category: '圖像處理',
        published_at: '2024-01-30',
        tags: ['GIMP', '圖像編輯器', '開源', '圖像處理', '圖像編輯'],
      },
      software: {
        license: 'GPL-3.0',
        github_url: 'https://github.com/GNOME/gimp',
      },
      languages: ['C', 'Python', 'Scheme'],
    })

    // Software - 5
    await seedSoftware({
      item: {
        title: 'Blender 3D 建模軟體',
        description: '專業的開源 3D 建模、動畫和視覺特效製作軟體。',
        category: '3D 建模',
        published_at: '2024-02-05',
        tags: ['Blender', '3D 建模', '動畫', '視覺特效', '3D 建模軟體'],
      },
      software: {
        license: 'GPL-3.0',
        github_url: 'https://github.com/blender/blender',
      },
      languages: ['C', 'C++', 'Python'],
    })

    // Software - 6
    await seedSoftware({
      item: {
        title: 'Audacity 音頻編輯器',
        description:
          '功能完整的開源音頻編輯和錄音軟體，適合音樂製作和播客編輯。',
        category: '音頻處理',
        published_at: '2024-02-10',
        tags: ['Audacity', '音頻編輯器', '開源', '音樂製作', '播客編輯'],
      },
      software: {
        license: 'GPL-3.0',
        github_url: 'https://github.com/audacity/audacity',
      },
      languages: ['C++', 'Python', 'Lua'],
    })

    // Software - 7
    await seedSoftware({
      item: {
        title: 'Inkscape 向量圖形編輯器',
        description:
          '專業的開源向量圖形設計工具，支援 SVG 格式和豐富的繪圖功能。',
        category: '圖形設計',
        published_at: '2024-02-15',
        tags: ['Inkscape', '向量圖形編輯器', '開源', 'SVG', '繪圖功能'],
      },
      software: {
        license: 'GPL-3.0',
        github_url: 'https://github.com/inkscape/inkscape',
      },
      languages: ['C++', 'Python', 'JavaScript'],
    })

    // Software - 8
    await seedSoftware({
      item: {
        title: 'OBS Studio 直播錄影工具',
        description: '專業級開源直播和錄影軟體，支援多種來源混合和實時串流。',
        category: '多媒體製作',
        published_at: '2024-02-20',
        tags: ['OBS Studio', '直播錄影工具', '開源', '直播', '錄影'],
      },
      software: {
        license: 'GPL-2.0',
        github_url: 'https://github.com/obsproject/obs-studio',
      },
      languages: ['C', 'C++', 'Lua'],
    })

    // Software - 9
    await seedSoftware({
      item: {
        title: 'Krita 數位繪圖軟體',
        description:
          '專業的開源數位繪圖和插畫製作軟體，提供豐富的繪畫工具和畫筆選項。',
        category: '數位藝術',
        published_at: '2024-02-25',
        tags: ['Krita', '數位繪圖軟體', '開源', '繪畫工具', '畫筆選項'],
      },
      software: {
        license: 'GPL-3.0',
        github_url: 'https://github.com/KDE/krita',
      },
      languages: ['C++', 'Python', 'Qt'],
    })

    // Software - 10
    await seedSoftware({
      item: {
        title: 'Kdenlive 影片編輯器',
        description:
          '功能強大的開源影片編輯軟體，支援多軌道編輯和專業的視頻特效。',
        category: '影片編輯',
        published_at: '2024-03-01',
        tags: ['Kdenlive', '影片編輯器', '開源', '多軌道編輯', '視頻特效'],
      },
      software: {
        license: 'GPL-3.0',
        github_url: 'https://github.com/KDE/kdenlive',
      },
      languages: ['C++', 'QML', 'JavaScript'],
    })
  }

  // 5. Open Source Hardware
  {
    // Hardware - 1
    await seedHardware({
      item: {
        title: 'Arduino UNO 開發板',
        description:
          '最受歡迎的開源微控制器開發板，適合初學者學習電子和程式設計。',
        category: '微控制器',
        published_at: '2024-01-15',
        tags: ['Arduino', '開源', '微控制器', '初學者', '電子', '程式設計'],
      },
      hardware: {
        license: 'CC BY-SA 3.0',
        schematic_url: 'https://github.com/arduino/ArduinoCore-avr',
        manufacturer: 'Arduino',
      },
      components: ['ATmega328P', 'USB接口', '數位/類比接腳', '電源管理'],
    })

    // Hardware - 2
    await seedHardware({
      item: {
        title: 'Raspberry Pi 4B',
        description:
          '功能強大的單板電腦，支援 Linux 系統，適合各種DIY項目和教育用途。',
        category: '單板電腦',
        published_at: '2024-01-20',
        tags: ['Raspberry Pi', '開源', '單板電腦', 'Linux', 'DIY', '教育'],
      },
      hardware: {
        license: 'CC BY-SA 4.0',
        schematic_url: 'https://github.com/raspberrypi/documentation',
        manufacturer: 'Raspberry Pi Foundation',
      },
      components: ['ARM處理器', 'GPIO接腳', 'HDMI接口', '乙太網路'],
    })

    // Hardware - 3
    await seedHardware({
      item: {
        title: 'ESP32 開發板',
        description:
          '具備 WiFi 和藍牙功能的高性能微控制器，適合物聯網專案開發。',
        category: '物聯網',
        published_at: '2024-01-25',
        tags: ['ESP32', '開源', '微控制器', 'WiFi', '藍牙', '物聯網'],
      },
      hardware: {
        license: 'MIT',
        schematic_url: 'https://github.com/espressif/esp-idf',
        manufacturer: 'Espressif',
      },
      components: ['ESP32晶片', 'WiFi模組', '藍牙模組', 'GPIO接腳'],
    })

    // Hardware - 4
    await seedHardware({
      item: {
        title: '3D列印機 Prusa i3',
        description: '開源3D列印機設計，提供高品質列印效果和完整的硬體規格。',
        category: '3D列印',
        published_at: '2024-01-30',
        tags: ['3D列印機', '開源', '3D列印', '高品質', '硬體規格'],
      },
      hardware: {
        license: 'GPL-3.0',
        schematic_url: 'https://github.com/prusa3d/Original-Prusa-i3',
        manufacturer: 'Prusa Research',
      },
      components: ['步進馬達', '加熱床', '擠出機', '控制板'],
    })

    // Hardware - 5
    await seedHardware({
      item: {
        title: 'BeagleBone Black',
        description: '適合嵌入式系統開發的開源單板電腦，提供豐富的擴展接口。',
        category: '嵌入式系統',
        published_at: '2024-02-05',
        tags: ['BeagleBone Black', '開源', '嵌入式系統', '擴展接口'],
      },
      hardware: {
        license: 'CC BY-SA 3.0',
        schematic_url: 'https://github.com/beagleboard/beaglebone-black',
        manufacturer: 'BeagleBoard.org',
      },
      components: ['AM335x處理器', 'DDR3記憶體', 'eMMC存儲', '擴展接頭'],
    })

    // Hardware - 6
    await seedHardware({
      item: {
        title: 'OpenCorexy 3D列印機',
        description: '高速且精確的開源3D列印機設計，適合進階用戶和專業製造。',
        category: '3D列印',
        published_at: '2024-02-10',
        tags: [
          'OpenCorexy',
          '3D列印機',
          '開源',
          '3D列印',
          '進階用戶',
          '專業製造',
        ],
      },
      hardware: {
        license: 'GPL-3.0',
        schematic_url: 'https://github.com/opencore/corexy',
        manufacturer: 'OpenCore',
      },
      components: ['CoreXY機構', '直線導軌', '雙Z軸', '熱端組件'],
    })

    // Hardware - 7
    await seedHardware({
      item: {
        title: 'OpenMV AI相機',
        description: '開源機器視覺開發板，支援影像處理和深度學習應用。',
        category: '機器視覺',
        published_at: '2024-02-15',
        tags: ['OpenMV', 'AI相機', '開源', '機器視覺', '深度學習'],
      },
      hardware: {
        license: 'MIT',
        schematic_url: 'https://github.com/openmv/openmv',
        manufacturer: 'OpenMV',
      },
      components: ['STM32處理器', '攝像頭模組', 'LCD螢幕', 'SD卡槽'],
    })

    // Hardware - 8
    await seedHardware({
      item: {
        title: 'PinePhone 開源手機',
        description: '完全開源的 Linux 智能手機，支援多種開源作業系統。',
        category: '移動設備',
        published_at: '2024-02-20',
        tags: ['PinePhone', '開源手機', 'Linux', '智能手機', '開源作業系統'],
      },
      hardware: {
        license: 'CC BY-SA 4.0',
        schematic_url: 'https://github.com/pine64/pinephone',
        manufacturer: 'Pine64',
      },
      components: ['ARM處理器', '觸控螢幕', '攝像頭', '可更換電池'],
    })

    // Hardware - 9
    await seedHardware({
      item: {
        title: 'LibreCube 衛星平台',
        description: '開源奈米衛星設計，適合教育和研究用途的太空科技專案。',
        category: '太空科技',
        published_at: '2024-02-25',
        tags: [
          'LibreCube',
          '衛星平台',
          '開源奈米衛星',
          '教育和研究',
          '太空科技',
        ],
      },
      hardware: {
        license: 'CERN OHL',
        schematic_url: 'https://github.com/librecube/librecube',
        manufacturer: 'LibreCube',
      },
      components: ['太陽能板', '姿態控制', '通訊模組', '電源系統'],
    })

    // Hardware - 10
    await seedHardware({
      item: {
        title: 'OpenBot 機器人平台',
        description: '模組化開源機器人平台，支援多種感測器和執行器的整合。',
        category: '機器人',
        published_at: '2024-03-01',
        tags: ['OpenBot', '機器人', '開源', '機器人平台', '感測器', '執行器'],
      },
      hardware: {
        license: 'MIT',
        schematic_url: 'https://github.com/openbot/openbot',
        manufacturer: 'OpenBot',
      },
      components: ['主控板', '馬達驅動', '感測器組', '機械結構'],
    })
  }

  // 6. Free Fonts
  {
    // Font - 1
    await seedFont({
      item: {
        title: '思源黑體',
        description:
          '由 Adobe 和 Google 合作開發的開源中文字體，支援多種字重和完整的中日韓文字。',
        category: '無襯線字體',
        published_at: '2024-01-15',
        tags: ['思源黑體', '開源', '中文字體', '多種字重', '中日韓文字'],
      },
      font: {
        designer: 'Adobe & Google',
        file_format: 'OTF' as const,
        download_url: 'https://github.com/adobe-fonts/source-han-sans',
      },
      styles: ['細體', '正常', '中黑', '粗體', '特粗'],
      languages: ['繁體中文', '簡體中文', '日文', '韓文'],
    })

    // Font - 2
    await seedFont({
      item: {
        title: '霞鶩文楷',
        description: '優雅的開源楷體字型，適合正文排版和標題使用。',
        category: '楷體',
        published_at: '2024-01-20',
        tags: ['霞鶩文楷', '開源', '楷體', '正文排版', '標題使用'],
      },
      font: {
        designer: 'LXGW',
        file_format: 'OTF' as const,
        download_url: 'https://github.com/lxgw/LxgwWenKai',
      },
      styles: ['細體', '正常', '粗體'],
      languages: ['繁體中文', '簡體中文'],
    })

    // Font - 3
    await seedFont({
      item: {
        title: '未來荧黑',
        description: '現代感十足的開源黑體字型，提供多種字重選擇。',
        category: '無襯線字體',
        published_at: '2024-01-25',
        tags: ['未來荧黑', '開源', '黑體', '多種字重', '現代感'],
      },
      font: {
        designer: 'Fusion Lab',
        file_format: 'OTF' as const,
        download_url: 'https://github.com/welai/glow-sans',
      },
      styles: ['超細', '細體', '正常', '中黑', '粗體', '特粗'],
      languages: ['繁體中文', '簡體中文', '日文'],
    })

    // Font - 4
    await seedFont({
      item: {
        title: '台北黑體',
        description: '由台北市政府發布的開源黑體字型，適合各種場合使用。',
        category: '無襯線字體',
        published_at: '2024-01-30',
        tags: ['台北黑體', '開源', '黑體', '各種場合', '使用'],
      },
      font: {
        designer: '台北市政府',
        file_format: 'OTF' as const,
        download_url: 'https://sites.google.com/view/jtfoundry',
      },
      styles: ['細體', '正常', '粗體'],
      languages: ['繁體中文'],
    })

    // Font - 5
    await seedFont({
      item: {
        title: '花園明朝',
        description: '優雅的開源明體字型，適合長篇文章排版。',
        category: '明體',
        published_at: '2024-02-05',
        tags: ['花園明朝', '開源', '明體', '長篇文章', '排版'],
      },
      font: {
        designer: 'Hanazono Project',
        file_format: 'TTF' as const,
        download_url: 'http://fonts.jp/hanazono/',
      },
      styles: ['正常'],
      languages: ['繁體中文', '簡體中文', '日文'],
    })

    // Font - 6
    await seedFont({
      item: {
        title: '粉圓體',
        description: '圓潤可愛的開源中文字體，適合設計活潑風格的平面作品。',
        category: '圓體',
        published_at: '2024-02-10',
        tags: ['粉圓體', '開源', '圓體', '活潑風格', '平面作品'],
      },
      font: {
        designer: 'justfont',
        file_format: 'OTF' as const,
        download_url: 'https://github.com/justfont/open-huninn-font',
      },
      styles: ['細體', '正常', '粗體'],
      languages: ['繁體中文', '簡體中文'],
    })

    // Font - 7
    await seedFont({
      item: {
        title: '清松手寫體',
        description: '自然流暢的開源手寫字體，適合製作個人風格的設計作品。',
        category: '手寫體',
        published_at: '2024-02-15',
        tags: ['清松手寫體', '開源', '手寫字體', '個人風格', '設計作品'],
      },
      font: {
        designer: '清松',
        file_format: 'TTF' as const,
        download_url: 'https://github.com/max32002/TsingSong',
      },
      styles: ['正常'],
      languages: ['繁體中文'],
    })

    // Font - 8
    await seedFont({
      item: {
        title: '源泉圓體',
        description: '現代風格的開源圓體字型，提供多種字重變化。',
        category: '圓體',
        published_at: '2024-02-20',
        tags: ['源泉圓體', '開源', '圓體', '多種字重', '現代風格'],
      },
      font: {
        designer: 'Adobe',
        file_format: 'OTF' as const,
        download_url: 'https://github.com/adobe-fonts/source-han-sans',
      },
      styles: ['輕盈', '正常', '中等', '粗體'],
      languages: ['繁體中文', '簡體中文', '日文', '韓文'],
    })

    // Font - 9
    await seedFont({
      item: {
        title: '芫荽體',
        description: '獨特風格的開源美術字體，適合設計特殊主題的標題。',
        category: '美術字體',
        published_at: '2024-02-25',
        tags: ['芫荽體', '開源', '美術字體', '特殊主題', '標題'],
      },
      font: {
        designer: '字遊工房',
        file_format: 'OTF' as const,
        download_url: 'https://github.com/ButTaiwan/iansui',
      },
      styles: ['正常'],
      languages: ['繁體中文'],
    })

    // Font - 10
    await seedFont({
      item: {
        title: '獅尾圓體',
        description: '現代感的開源圓體字型，支援多種字重，適合各種設計場景。',
        category: '圓體',
        published_at: '2024-03-01',
        tags: ['獅尾圓體', '開源', '圓體', '多種字重', '設計場景'],
      },
      font: {
        designer: '獅尾字型作者群',
        file_format: 'OTF' as const,
        download_url: 'https://github.com/max32002/swei-gothic',
      },
      styles: ['細體', '正常', '粗體', '超粗'],
      languages: ['繁體中文', '簡體中文'],
    })
  }

  // 7. Classical Music
  {
    // Classical Music - 1
    await seedClassicalMusic({
      item: {
        title: '第五交響曲《命運》',
        description: '貝多芬最著名的交響曲之一，以其獨特的「命運動機」聞名。',
        category: '交響曲',
        published_at: '1808-12-22',
        tags: ['第五交響曲', '命運', '貝多芬', '交響曲', '古典時期'],
      },
      music: {
        composer: '貝多芬',
        period: '古典時期',
        duration_minutes: 35,
      },
      movements: ['快板', '行板與更快板', '諧謔曲', '終曲'],
      instruments: ['管弦樂團'],
    })

    // Classical Music - 2
    await seedClassicalMusic({
      item: {
        title: '四季',
        description: '維瓦爾第描繪春夏秋冬四季景色的小提琴協奏曲集。',
        category: '協奏曲',
        published_at: '1723',
        tags: ['四季', '維瓦爾第', '小提琴協奏曲', '巴洛克時期', '古典音樂'],
      },
      music: {
        composer: '維瓦爾第',
        period: '巴洛克時期',
        duration_minutes: 40,
      },
      movements: ['春', '夏', '秋', '冬'],
      instruments: ['小提琴獨奏', '弦樂團', '大鍵琴'],
    })

    // Classical Music - 3
    await seedClassicalMusic({
      item: {
        title: '月光奏鳴曲',
        description: '貝多芬浪漫優美的鋼琴奏鳴曲，以其夢幻般的第一樂章聞名。',
        category: '奏鳴曲',
        published_at: '1801',
        tags: [
          '月光奏鳴曲',
          '貝多芬',
          '鋼琴奏鳴曲',
          '浪漫優美',
          '夢幻第一樂章',
        ],
      },
      music: {
        composer: '貝多芬',
        period: '古典時期',
        duration_minutes: 15,
      },
      movements: ['慢板', '小快板', '急板'],
      instruments: ['鋼琴'],
    })

    // Classical Music - 4
    await seedClassicalMusic({
      item: {
        title: '梁祝小提琴協奏曲',
        description: '根據中國民間傳說改編的協奏曲，展現東方音樂之美。',
        category: '協奏曲',
        published_at: '1959',
        tags: [
          '梁祝小提琴協奏曲',
          '中國民間傳說',
          '協奏曲',
          '東方音樂',
          '中國民間傳說',
        ],
      },
      music: {
        composer: '何占豪、陳鋼',
        period: '現代時期',
        duration_minutes: 28,
      },
      movements: ['序曲', '主題變奏', '終曲'],
      instruments: ['小提琴獨奏', '管弦樂團'],
    })

    // Classical Music - 5
    await seedClassicalMusic({
      item: {
        title: '胡桃鉗組曲',
        description: '柴可夫斯基經典芭蕾舞劇音樂，充滿童話般的魔幻色彩。',
        category: '芭蕾舞劇',
        published_at: '1892-12-18',
        tags: ['胡桃鉗組曲', '柴可夫斯基', '芭蕾舞劇', '童話色彩', '浪漫時期'],
      },
      music: {
        composer: '柴可夫斯基',
        period: '浪漫時期',
        duration_minutes: 45,
      },
      movements: [
        '序曲小行進曲',
        '糖梅仙子之舞',
        '俄羅斯舞曲',
        '阿拉伯舞曲',
        '中國舞曲',
      ],
      instruments: ['管弦樂團', '鋼琴'],
    })

    // Classical Music - 6
    await seedClassicalMusic({
      item: {
        title: '田園交響曲',
        description: '貝多芬描繪鄉村生活的交響曲，展現大自然的美麗與和諧。',
        category: '交響曲',
        published_at: '1808-12-22',
        tags: ['田園交響曲', '貝多芬', '交響曲', '鄉村生活', '大自然'],
      },
      music: {
        composer: '貝多芬',
        period: '古典時期',
        duration_minutes: 40,
      },
      movements: ['愉快的鄉村生活', '溪畔情景', '農民歡聚', '暴風雨與感恩'],
      instruments: ['管弦樂團'],
    })

    // Classical Music - 7
    await seedClassicalMusic({
      item: {
        title: '卡門組曲',
        description: '比才歌劇《卡門》的配樂精選，充滿西班牙風情的經典作品。',
        category: '歌劇',
        published_at: '1875-03-03',
        tags: ['卡門組曲', '比才', '歌劇', '西班牙風情', '經典作品'],
      },
      music: {
        composer: '比才',
        period: '浪漫時期',
        duration_minutes: 25,
      },
      movements: ['前奏曲', '哈巴涅拉', '間奏曲', '鬥牛士進行曲'],
      instruments: ['管弦樂團'],
    })

    // Classical Music - 8
    await seedClassicalMusic({
      item: {
        title: '藍色狂想曲',
        description: '格什溫融合古典與爵士的代表作，展現美國音樂的獨特魅力。',
        category: '協奏曲',
        published_at: '1924-02-12',
        tags: ['藍色狂想曲', '格什溫', '古典與爵士', '美國音樂', '獨特魅力'],
      },
      music: {
        composer: '格什溫',
        period: '現代時期',
        duration_minutes: 16,
      },
      movements: ['中板', '藍調'],
      instruments: ['鋼琴獨奏', '管弦樂團'],
    })

    // Classical Music - 9
    await seedClassicalMusic({
      item: {
        title: '春之祭',
        description: '史特拉文斯基革命性的芭蕾舞劇音樂，以其原始力量震撼樂壇。',
        category: '芭蕾舞劇',
        published_at: '1913-05-29',
        tags: ['春之祭', '史特拉文斯基', '芭蕾舞劇', '原始力量', '震撼樂壇'],
      },
      music: {
        composer: '史特拉文斯基',
        period: '現代時期',
        duration_minutes: 35,
      },
      movements: ['大地的崇拜', '犧牲'],
      instruments: ['大型管弦樂團'],
    })

    // Classical Music - 10
    await seedClassicalMusic({
      item: {
        title: '威廉泰爾序曲',
        description: '羅西尼歌劇的著名序曲，以其激動人心的終曲聞名於世。',
        category: '歌劇',
        published_at: '1829',
        tags: ['威廉泰爾序曲', '羅西尼', '歌劇', '序曲', '終曲'],
      },
      music: {
        composer: '羅西尼',
        period: '浪漫時期',
        duration_minutes: 12,
      },
      movements: ['序曲', '黎明', '風暴', '終曲'],
      instruments: ['管弦樂團'],
    })
  }

  // 8. Wikipedia Entries
  {
    // Wikipedia Entry - 1
    await seedWikiEntry({
      item: {
        title: '香港歷史',
        description:
          '從古代到現代的香港發展史，包括殖民地時期和回歸後的重要事件。',
        category: '歷史',
        published_at: '2024-01-15',
        tags: ['香港歷史', '香港發展史', '殖民地時期', '回歸後', '重要事件'],
      },
      entry: {
        last_editor: '歷史研究者',
        last_edit_date: '2024-01-14',
        views: 15000,
      },
      languages: ['繁體中文', '簡體中文', '英文', '日文'],
      references: [
        '香港政府檔案處',
        '香港歷史博物館',
        '英國殖民地檔案',
        '中國近代史研究所',
      ],
    })

    // Wikipedia Entry - 2
    await seedWikiEntry({
      item: {
        title: '人工智能發展史',
        description: '人工智能從概念提出到現代應用的發展歷程和重要里程碑。',
        category: '科技',
        published_at: '2024-01-20',
        tags: ['人工智能', '發展史', '發展歷程', '重要里程碑', '科技'],
      },
      entry: {
        last_editor: 'AI研究員',
        last_edit_date: '2024-01-19',
        views: 25000,
      },
      languages: ['繁體中文', '簡體中文', '英文', '德文', '日文'],
      references: [
        'MIT人工智能實驗室',
        'DeepMind研究報告',
        'IEEE論文集',
        'Stanford AI研究中心',
      ],
    })

    // Wikipedia Entry - 3
    await seedWikiEntry({
      item: {
        title: '中華飲食文化',
        description: '中國傳統飲食文化的起源、發展和地區特色。',
        category: '文化',
        published_at: '2024-01-25',
        tags: [
          '中華飲食文化',
          '中國傳統飲食文化',
          '起源',
          '發展',
          '地區特色',
          '文化',
        ],
      },
      entry: {
        last_editor: '美食文化研究者',
        last_edit_date: '2024-01-24',
        views: 18000,
      },
      languages: ['繁體中文', '簡體中文', '英文', '法文', '日文', '韓文'],
      references: [
        '中國飲食文化研究所',
        '各地方志記載',
        '歷代美食典籍',
        '現代烹飪研究',
      ],
    })

    // Wikipedia Entry - 4
    await seedWikiEntry({
      item: {
        title: '氣候變遷',
        description: '全球氣候變遷的原因、影響和可能的解決方案。',
        category: '環境',
        published_at: '2024-01-30',
        tags: ['氣候變遷', '全球氣候變遷', '原因', '影響', '解決方案', '環境'],
      },
      entry: {
        last_editor: '環境科學家',
        last_edit_date: '2024-01-29',
        views: 30000,
      },
      languages: ['繁體中文', '簡體中文', '英文', '西班牙文', '法文', '德文'],
      references: [
        'IPCC報告',
        'NASA氣候研究',
        '世界氣象組織數據',
        '環保署研究報告',
      ],
    })

    // Wikipedia Entry - 5
    await seedWikiEntry({
      item: {
        title: '量子力學基礎',
        description: '量子力學的基本概念、發展歷史和主要理論框架。',
        category: '物理',
        published_at: '2024-02-05',
        tags: [
          '量子力學',
          '量子力學基礎',
          '基本概念',
          '發展歷史',
          '主要理論框架',
          '物理',
        ],
      },
      entry: {
        last_editor: '物理學教授',
        last_edit_date: '2024-02-04',
        views: 12000,
      },
      languages: ['繁體中文', '簡體中文', '英文', '德文', '俄文'],
      references: [
        '費曼物理學講義',
        '哥本哈根解釋',
        '量子力學教科書',
        '諾貝爾物理獎論文',
      ],
    })

    // Wikipedia Entry - 6
    await seedWikiEntry({
      item: {
        title: '中醫藥理論',
        description:
          '傳統中醫的基本理論、診斷方法和治療原則，以及現代科學研究。',
        category: '醫學',
        published_at: '2024-02-10',
        tags: [
          '中醫藥理論',
          '中醫基本理論',
          '診斷方法',
          '治療原則',
          '現代科學研究',
          '醫學',
        ],
      },
      entry: {
        last_editor: '中醫研究學者',
        last_edit_date: '2024-02-09',
        views: 22000,
      },
      languages: ['繁體中文', '簡體中文', '英文', '日文', '韓文'],
      references: [
        '黃帝內經',
        '中醫藥大全',
        '現代中醫研究文獻',
        '世界衛生組織報告',
      ],
    })

    // Wikipedia Entry - 7
    await seedWikiEntry({
      item: {
        title: '區塊鏈技術',
        description: '區塊鏈的運作原理、應用場景和對未來社會的潛在影響。',
        category: '科技',
        published_at: '2024-02-15',
        tags: [
          '區塊鏈',
          '區塊鏈技術',
          '運作原理',
          '應用場景',
          '未來社會',
          '科技',
        ],
      },
      entry: {
        last_editor: '區塊鏈專家',
        last_edit_date: '2024-02-14',
        views: 28000,
      },
      languages: ['繁體中文', '簡體中文', '英文', '日文', '韓文', '德文'],
      references: [
        '比特幣白皮書',
        '以太坊文檔',
        '區塊鏈研究論文',
        '金融科技報告',
      ],
    })

    // Wikipedia Entry - 8
    await seedWikiEntry({
      item: {
        title: '太空探索史',
        description: '人類太空探索的重要里程碑、技術突破和未來展望。',
        category: '科學',
        published_at: '2024-02-20',
        tags: [
          '太空探索史',
          '人類太空探索',
          '重要里程碑',
          '技術突破',
          '未來展望',
          '科學',
        ],
      },
      entry: {
        last_editor: '航太工程師',
        last_edit_date: '2024-02-19',
        views: 20000,
      },
      languages: ['繁體中文', '簡體中文', '英文', '俄文', '法文', '德文'],
      references: [
        'NASA檔案',
        '太空總署報告',
        '航太科技期刊',
        '太空探索大事記',
      ],
    })

    // Wikipedia Entry - 9
    await seedWikiEntry({
      item: {
        title: '世界建築史',
        description: '從古代到現代的世界重要建築風格、流派和代表作品。',
        category: '建築',
        published_at: '2024-02-25',
        tags: ['世界建築史', '建築風格', '流派', '代表作品', '建築', '建築史'],
      },
      entry: {
        last_editor: '建築史學者',
        last_edit_date: '2024-02-24',
        views: 16000,
      },
      languages: [
        '繁體中文',
        '簡體中文',
        '英文',
        '法文',
        '義大利文',
        '西班牙文',
      ],
      references: [
        '世界建築史料',
        '建築理論文獻',
        '現代建築評論',
        '建築師傳記集',
      ],
    })

    // Wikipedia Entry - 10
    await seedWikiEntry({
      item: {
        title: '生物多樣性',
        description: '地球生態系統的多樣性、保育挑戰和永續發展策略。',
        category: '生態',
        published_at: '2024-03-01',
        tags: [
          '生物多樣性',
          '地球生態系統',
          '多樣性',
          '保育挑戰',
          '永續發展策略',
          '生態',
        ],
      },
      entry: {
        last_editor: '生態學家',
        last_edit_date: '2024-02-29',
        views: 19000,
      },
      languages: [
        '繁體中文',
        '簡體中文',
        '英文',
        '法文',
        '西班牙文',
        '葡萄牙文',
      ],
      references: [
        '生物多樣性公約',
        'WWF研究報告',
        '生態保育期刊',
        '物種紅皮書',
      ],
    })
  }

  // 9. Public Attractions
  {
    // Attraction - 1
    await seedAttraction({
      item: {
        title: '香港太平山頂',
        description:
          '香港著名觀光景點，可俯瞰維多利亞港美景，設有凌霄閣和摩天台。',
        category: '觀光景點',
        published_at: '2024-01-15',
        tags: [
          '香港太平山頂',
          '觀光景點',
          '維多利亞港',
          '凌霄閣',
          '摩天台',
          '觀光',
        ],
      },
      attraction: {
        address: '山頂道128號',
        city: '香港',
        country: '中國',
        opening_hours: '週一至週日 07:00-22:00',
      },
      facilities: [
        '觀景台',
        '餐廳',
        '購物中心',
        '纜車站',
        '停車場',
        '無障礙設施',
      ],
    })

    // Attraction - 2
    await seedAttraction({
      item: {
        title: '台北101',
        description: '台北地標性建築，結合觀景、購物、美食的多功能大樓。',
        category: '觀光景點',
        published_at: '2024-01-20',
        tags: [
          '台北101',
          '台北地標',
          '觀景',
          '購物',
          '美食',
          '多功能大樓',
          '觀光景點',
        ],
      },
      attraction: {
        address: '信義路五段7號',
        city: '台北',
        country: '台灣',
        opening_hours: '週一至週日 09:00-22:00',
      },
      facilities: [
        '觀景台',
        '購物中心',
        '美食街',
        '停車場',
        '無障礙設施',
        '遊客服務中心',
      ],
    })

    // Attraction - 3
    await seedAttraction({
      item: {
        title: '澳門大三巴牌坊',
        description: '澳門著名歷史建築，融合中西文化的天主教聖保祿教堂遺址。',
        category: '歷史古蹟',
        published_at: '2024-01-25',
        tags: [
          '澳門大三巴牌坊',
          '澳門歷史建築',
          '天主教聖保祿教堂',
          '中西文化',
          '歷史古蹟',
        ],
      },
      attraction: {
        address: '大三巴街',
        city: '澳門',
        country: '中國',
        opening_hours: '全天開放',
      },
      facilities: ['博物館', '導覽服務', '紀念品店', '公共洗手間', '休息區'],
    })

    // Attraction - 4
    await seedAttraction({
      item: {
        title: '西湖',
        description: '杭州著名景區，以優美湖景、歷史遺跡和園林建築聞名。',
        category: '自然景觀',
        published_at: '2024-01-30',
        tags: [
          '西湖',
          '杭州著名景區',
          '優美湖景',
          '歷史遺跡',
          '園林建築',
          '自然景觀',
        ],
      },
      attraction: {
        address: '杭州西湖風景區',
        city: '杭州',
        country: '中國',
        opening_hours: '全天開放',
      },
      facilities: [
        '遊船碼頭',
        '茶館',
        '公園',
        '博物館',
        '餐廳',
        '停車場',
        '遊客中心',
      ],
    })

    // Attraction - 5
    await seedAttraction({
      item: {
        title: '故宮博物院',
        description: '中國最大的古代文化藝術博物館，收藏大量珍貴文物。',
        category: '博物館',
        published_at: '2024-02-05',
        tags: [
          '故宮博物院',
          '中國最大古代文化藝術博物館',
          '珍貴文物',
          '博物館',
          '文化藝術',
        ],
      },
      attraction: {
        address: '景山前街4號',
        city: '北京',
        country: '中國',
        opening_hours: '週二至週日 08:30-17:00',
      },
      facilities: [
        '展覽館',
        '導覽服務',
        '紀念品店',
        '餐廳',
        '休息區',
        '無障礙設施',
        '寄物處',
      ],
    })

    // Attraction - 6
    await seedAttraction({
      item: {
        title: '日月潭',
        description:
          '台灣最大的天然湖泊，環繞著山景與原住民文化，是著名的觀光勝地。',
        category: '自然景觀',
        published_at: '2024-02-10',
        tags: [
          '日月潭',
          '台灣最大天然湖泊',
          '山景',
          '原住民文化',
          '觀光勝地',
          '自然景觀',
        ],
      },
      attraction: {
        address: '南投縣魚池鄉',
        city: '南投',
        country: '台灣',
        opening_hours: '全天開放',
      },
      facilities: [
        '遊船碼頭',
        '纜車',
        '自行車道',
        '觀景台',
        '餐廳',
        '停車場',
        '遊客中心',
      ],
    })

    // Attraction - 7
    await seedAttraction({
      item: {
        title: '長城',
        description: '中國最具代表性的古代建築，延綿萬里的世界文化遺產。',
        category: '歷史古蹟',
        published_at: '2024-02-15',
        tags: [
          '長城',
          '中國最具代表性古代建築',
          '世界文化遺產',
          '歷史古蹟',
          '中國文化',
        ],
      },
      attraction: {
        address: '北京市八達嶺',
        city: '北京',
        country: '中國',
        opening_hours: '週一至週日 06:30-19:00',
      },
      facilities: [
        '纜車',
        '博物館',
        '紀念品店',
        '餐廳',
        '公共洗手間',
        '停車場',
        '導覽服務',
      ],
    })

    // Attraction - 8
    await seedAttraction({
      item: {
        title: '澳門威尼斯人',
        description:
          '結合購物、娛樂、住宿的大型綜合度假村，以威尼斯建築風格聞名。',
        category: '休閒娛樂',
        published_at: '2024-02-20',
        tags: [
          '澳門威尼斯人',
          '購物',
          '娛樂',
          '住宿',
          '大型綜合度假村',
          '威尼斯建築風格',
          '休閒娛樂',
        ],
      },
      attraction: {
        address: '路氹金光大道',
        city: '澳門',
        country: '中國',
        opening_hours: '全天開放',
      },
      facilities: [
        '購物中心',
        '劇場',
        '賭場',
        '餐廳',
        '運河船遊',
        '停車場',
        '酒店',
        '會議中心',
      ],
    })

    // Attraction - 9
    await seedAttraction({
      item: {
        title: '海洋公園',
        description: '香港著名主題公園，結合海洋生態、遊樂設施和教育展覽。',
        category: '主題公園',
        published_at: '2024-02-25',
        tags: [
          '海洋公園',
          '香港著名主題公園',
          '海洋生態',
          '遊樂設施',
          '教育展覽',
          '主題公園',
        ],
      },
      attraction: {
        address: '香港仔黃竹坑道180號',
        city: '香港',
        country: '中國',
        opening_hours: '週一至週日 10:00-19:00',
      },
      facilities: [
        '遊樂設施',
        '水族館',
        '動物展館',
        '餐廳',
        '紀念品店',
        '纜車',
        '表演場地',
        '教育中心',
      ],
    })

    // Attraction - 10
    await seedAttraction({
      item: {
        title: '阿里山',
        description: '台灣著名高山景區，以日出、雲海、森林鐵路和櫻花聞名。',
        category: '自然景觀',
        published_at: '2024-03-01',
        tags: [
          '阿里山',
          '台灣著名高山景區',
          '日出',
          '雲海',
          '森林鐵路',
          '櫻花',
          '自然景觀',
        ],
      },
      attraction: {
        address: '嘉義縣阿里山鄉',
        city: '嘉義',
        country: '台灣',
        opening_hours: '全天開放',
      },
      facilities: [
        '森林鐵路',
        '觀景台',
        '步道',
        '寺廟',
        '餐廳',
        '住宿設施',
        '遊客中心',
        '停車場',
      ],
    })
  }

  // 10. Pet Breeds
  {
    // Pet Breed - 1
    await seedPetBreed({
      item: {
        title: '柴犬',
        description: '來自日本的中型犬種，以忠誠、警覺和獨立的性格聞名。',
        category: '狗',
        published_at: '2024-01-15',
        tags: ['柴犬', '日本中型犬種', '忠誠', '警覺', '獨立', '性格', '狗'],
      },
      breed: {
        species: '犬',
        origin: '日本',
        lifespan: '12-15年',
        size: 'medium' as const,
      },
      temperaments: ['忠誠', '警覺', '獨立', '聰明', '活潑'],
    })

    // Pet Breed - 2
    await seedPetBreed({
      item: {
        title: '英國短毛貓',
        description: '性格溫和友善的貓種，有著圓潤的臉龐和厚實的毛髮。',
        category: '貓',
        published_at: '2024-01-20',
        tags: [
          '英國短毛貓',
          '性格溫和',
          '友善',
          '圓潤臉龐',
          '厚實毛髮',
          '貓',
          '貓種',
        ],
      },
      breed: {
        species: '貓',
        origin: '英國',
        lifespan: '15-20年',
        size: 'medium' as const,
      },
      temperaments: ['溫和', '友善', '安靜', '適應力強'],
    })

    // Pet Breed - 3
    await seedPetBreed({
      item: {
        title: '黃金獵犬',
        description: '深受歡迎的大型犬種，以友善、聰明和易於訓練的特性著稱。',
        category: '狗',
        published_at: '2024-01-25',
        tags: [
          '黃金獵犬',
          '大型犬種',
          '友善',
          '聰明',
          '易於訓練',
          '狗',
          '犬種',
        ],
      },
      breed: {
        species: '犬',
        origin: '蘇格蘭',
        lifespan: '10-12年',
        size: 'large' as const,
      },
      temperaments: ['友善', '聰明', '忠誠', '溫和', '活潑'],
    })

    // Pet Breed - 4
    await seedPetBreed({
      item: {
        title: '波斯貓',
        description: '優雅的長毛貓種，有著扁平的臉型和華麗的毛髮。',
        category: '貓',
        published_at: '2024-01-30',
        tags: [
          '波斯貓',
          '優雅',
          '長毛貓',
          '扁平臉型',
          '華麗毛髮',
          '貓',
          '貓種',
        ],
      },
      breed: {
        species: '貓',
        origin: '伊朗',
        lifespan: '12-17年',
        size: 'medium' as const,
      },
      temperaments: ['優雅', '安靜', '溫和', '黏人'],
    })

    // Pet Breed - 5
    await seedPetBreed({
      item: {
        title: '吉娃娃',
        description: '世界最小的狗品種之一，以活潑、勇敢和忠誠的性格著稱。',
        category: '狗',
        published_at: '2024-02-05',
        tags: [
          '吉娃娃',
          '世界最小狗品種',
          '活潑',
          '勇敢',
          '忠誠',
          '狗',
          '犬種',
        ],
      },
      breed: {
        species: '犬',
        origin: '墨西哥',
        lifespan: '12-20年',
        size: 'small' as const,
      },
      temperaments: ['活潑', '勇敢', '忠誠', '警覺', '黏人'],
    })

    // Pet Breed - 6
    await seedPetBreed({
      item: {
        title: '暹羅貓',
        description: '聰明活潑的東方貓種，以獨特的外表和好動的性格著稱。',
        category: '貓',
        published_at: '2024-02-10',
        tags: [
          '暹羅貓',
          '聰明',
          '活潑',
          '東方貓',
          '獨特外表',
          '好動性格',
          '貓',
          '貓種',
        ],
      },
      breed: {
        species: '貓',
        origin: '泰國',
        lifespan: '15-20年',
        size: 'medium' as const,
      },
      temperaments: ['聰明', '活潑', '好動', '親人', '愛說話'],
    })

    // Pet Breed - 7
    await seedPetBreed({
      item: {
        title: '哈士奇',
        description: '精力充沛的雪橇犬，以其獨立、頑皮和友善的性格聞名。',
        category: '狗',
        published_at: '2024-02-15',
        tags: [
          '哈士奇',
          '精力充沛',
          '雪橇犬',
          '獨立',
          '頑皮',
          '友善',
          '狗',
          '犬種',
        ],
      },
      breed: {
        species: '犬',
        origin: '西伯利亞',
        lifespan: '12-14年',
        size: 'large' as const,
      },
      temperaments: ['獨立', '頑皮', '友善', '精力充沛', '聰明'],
    })

    // Pet Breed - 8
    await seedPetBreed({
      item: {
        title: '緬因貓',
        description: '體型巨大的長毛貓種，性格溫和友善，被稱為溫柔的巨人。',
        category: '貓',
        published_at: '2024-02-20',
        tags: [
          '緬因貓',
          '體型巨大',
          '長毛貓',
          '性格溫和',
          '友善',
          '溫柔的巨人',
          '貓',
          '貓種',
        ],
      },
      breed: {
        species: '貓',
        origin: '美國',
        lifespan: '12-15年',
        size: 'large' as const,
      },
      temperaments: ['溫和', '友善', '聰明', '親人', '好奇'],
    })

    // Pet Breed - 9
    await seedPetBreed({
      item: {
        title: '拉布拉多',
        description: '最受歡迎的導盲犬之一，以忠誠、溫和和易訓練的特性著稱。',
        category: '狗',
        published_at: '2024-02-25',
        tags: [
          '拉布拉多',
          '最受歡迎導盲犬',
          '忠誠',
          '溫和',
          '易訓練',
          '狗',
          '犬種',
        ],
      },
      breed: {
        species: '犬',
        origin: '加拿大',
        lifespan: '10-12年',
        size: 'large' as const,
      },
      temperaments: ['忠誠', '溫和', '聰明', '友善', '易訓練'],
    })

    // Pet Breed - 10
    await seedPetBreed({
      item: {
        title: '蘇格蘭摺耳貓',
        description: '以獨特的折耳外表聞名，性格溫順親人的可愛貓種。',
        category: '貓',
        published_at: '2024-03-01',
        tags: [
          '蘇格蘭摺耳貓',
          '獨特折耳外表',
          '性格溫順',
          '親人',
          '可愛貓種',
          '貓',
          '貓種',
        ],
      },
      breed: {
        species: '貓',
        origin: '蘇格蘭',
        lifespan: '11-14年',
        size: 'medium' as const,
      },
      temperaments: ['溫順', '親人', '安靜', '適應力強', '黏人'],
    })
  }
}
main().catch(e => console.error(e))
