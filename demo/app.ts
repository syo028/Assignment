import { IonButton } from '@ionic/core/components/ion-button'
import { IonToast } from '@ionic/core/components/ion-toast'
import { IonList } from '@ionic/core/components/ion-list'
import { IonModal } from '@ionic/core/components/ion-modal'
import { IonAlert } from '@ionic/core/components/ion-alert'

let baseUrl = 'https://dae-mobile-assignment.hkit.cc/api'



//let items = [1,2,3]

declare var refreshButton: IonButton
refreshButton?.addEventListener('click', loadItems)

declare var errorToast: IonToast

declare var loginModal: IonModal

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

let token ='123456789' 

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
    items: item[]
    pagination: {
      page: number
      limit: number
      total: number
    }
  }

type item = {
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
let items = json.items as item[]
console.log('items:',items)

if (courseList) {
  courseList.textContent = ''
  
  // Create and append item cards
  for (const item of items) {
    if (itemCardTemplate) {
      const card = itemCardTemplate.cloneNode(true) as HTMLElement
      
      // Set course title
      const titleElement = card.querySelector('.course-title')
      if (titleElement) {
        titleElement.textContent = item.title
      }
      
      // Set course image
      const imageElement = card.querySelector<HTMLImageElement>('.course-image')
      if (imageElement) {
        imageElement.src = item.image_url
      }
      
      // Set up favorite button
      const favoriteButton = card.querySelector('.favorite-button')
      if (favoriteButton) {
        const favoriteIcon = favoriteButton.querySelector('ion-icon')
        if (favoriteIcon) {
          // Use the item's bookmarked property or default to false
          item.bookmarked = item.bookmarked || false
          favoriteIcon.setAttribute('name', item.bookmarked ? 'heart' : 'heart-outline')
          
          favoriteButton.addEventListener('click', () => {
            if (!token) {
              errorToast.setAttribute('message','請先登入以使用收藏功能')
              // @ts-ignore - Using Ionic methods
              errorToast.present?.()
              return
            }



            item.bookmarked = !item.bookmarked
            favoriteIcon.setAttribute('name', item.bookmarked ? 'heart' : 'heart-outline')
            // TODO: Implement bookmark functionality
          })
        }
      }
      
      // Set course description
      const descriptionElement = card.querySelector('.course-description')
      if (descriptionElement) {
        descriptionElement.textContent = item.description
      }
      
      // Set course meta information
      const metaElement = card.querySelector('.course-meta')
      if (metaElement) {
        metaElement.innerHTML = `
          <span>程式語言: ${item.category}</span>
          <span>程度: ${item.level}</span>
        `
      }
      
      // Set up tags
      const tagContainer = card.querySelector('.tag-container')
      if (tagContainer) {
        const chipTemplate = tagContainer.querySelector('.ion-chip')
        if (chipTemplate) {
          chipTemplate.remove()
          
          for (const tag of item.tags) {
            const chip = chipTemplate.cloneNode(true) as HTMLElement
            chip.textContent = tag
            chip.setAttribute('data-type', tag)
            
            chip.addEventListener('click', () => {
              // TODO: Implement filterByTag(tag)
            })
            
            tagContainer.appendChild(chip)
          }
        }
      }
      
      courseList.appendChild(card)
  }


loadItems()
