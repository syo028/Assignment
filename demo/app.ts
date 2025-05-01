
import { IonButton } from '@ionic/core/components/ion-button'
import { IonToast } from '@ionic/core/components/ion-toast'
import { IonList } from '@ionic/core/components/ion-list'
import { IonModal } from '@ionic/core/components/ion-modal'

let baseUrl = 'https://dae-mobile-assignment.hkit.cc/api'


//let items = [1,2,3]

declare var refreshButton: IonButton
refreshButton?.addEventListener('click', loadItems)

declare var loginModal: IonModal
declare var errorToast: IonToast

declare var courseList: IonList

let page = 1

declare var prevPageButton: IonButton
prevPageButton.addEventListener('click', () => {
  page--
  loadItems()
})

declare var nextPageButton: IonButton
nextPageButton.addEventListener('click', () => {
  page++
  loadItems()
})

let skeletonItem = courseList.querySelector('.skeleton-item')!
skeletonItem.remove()

let itemCardTemplate = courseList.querySelector('.item-card')!
itemCardTemplate.remove()


let token =localStorage.getItem('token')

async function loadItems() {
    console.log("loading items...");
    courseList.textContent = ''
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    let params = new URLSearchParams()
    params.set('page', page.toString())
let res = await fetch(`${baseUrl}/courses?${params}`, {
    method:'GET',
    headers:{
        'Authorization':`Bearer ${token}`    }
})
let json = await res.json() as Result
if (json.error) {
errorToast.message = json.error
errorToast.present()
courseList.textContent = ''
return
}
errorToast.dismiss()

let maxPage = Math.ceil(json.pagination.total / json.pagination.limit)

prevPageButton.hidden = json.pagination.page <= 1
nextPageButton.hidden = json.pagination.page >= maxPage

type Result = {
    error: string
    items: Item[]
    pagination: {
      page: number
      limit: number
      total: number
    }
  }

type Item = {
    id:number,
    tags:string[],
    language:string,
    level:string,
    title:string,
    description:string,
    category:string,
    image_url:string,
    video_url:string
}
let items = json.items as Item[]
console.log('items:',items)

courseList.textContent = ''
for(let item of items){

let card = itemCardTemplate.cloneNode(true) as HTMLIonCardElement

card.querySelector<HTMLImageElement>('.course-image')!.src = item.image_url
card.querySelector<HTMLImageElement>('.course-image')!.alt = item.title


card.querySelector('.play-button')!.setAttribute('onclick', `openVideoModal('${item.video_url}', '${item.title}')`)

let favoriteButton = card.querySelector('.favorite-button')!
let favoriteIcon = favoriteButton.querySelector('ion-icon')!
let hasBookmarked = false
favoriteIcon.name = hasBookmarked ? 'heart' : 'heart-outline'
favoriteButton.addEventListener('click', () => {

  if (!token) {
    errorToast.setAttribute('message','請先登入以使用收藏功能')
    // @ts-ignore - Using Ionic methods
    errorToast.present?.()
    return
  }



  hasBookmarked = !hasBookmarked
  favoriteIcon.name = hasBookmarked ? 'heart' : 'heart-outline'
  //TODO: 實作收藏功能  
})

  card.querySelector('.course-title')!.textContent = item.title
  card.querySelector('.course-meta span:nth-child(1)')!.textContent = `程式語言: ${item.category}`
  card.querySelector('.course-meta span:nth-child(2)')!.textContent = `程度: ${item.level}`
  card.querySelector('.course-description')!.textContent = item.description
  
let tagContainer = card.querySelector<HTMLDivElement>('.tag-container')!
let chipTemplate = tagContainer.querySelector<HTMLIonChipElement>('ion-chip')!
chipTemplate.remove()
for(let tag of item.tags){
  let chip = chipTemplate.cloneNode(true) as HTMLIonChipElement
  chip.textContent = tag
  chip.dataset.type = tag
  chip.addEventListener('click', () => {
    //TODO: filterByTag(tag)
  })
  tagContainer.appendChild(chip)
}

  courseList.appendChild(card)
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('headerLoginButton');
  const loginModal = document.querySelector('ion-modal#loginModal');

  loginButton?.addEventListener('click', () => {
    loginModal?.present();
  });
});
loadItems()





