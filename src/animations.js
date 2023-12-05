import { wait } from "./web-gems/index.js"

export const animateInit = async ({target, stagger}) => {
  target.style.visibility = 'hidden'
  
  if(stagger) {
    await wait(stagger * 300)
  }

  target.style.visibility = 'visible'
  target.classList.add('animate__animated','animate__fadeInDown')
}

export const animateDestroy = async ({target, stagger, capturePosition=true}) => {
  if(capturePosition) {
    captureElementPosition(target)
  }

  if(stagger) {
    await wait(stagger * 300)
  }

  target.classList.add('animate__animated','animate__fadeOutUp')
  
  await wait(1000) // don't allow remove from stage until animation completed
  
  target.classList.remove('animate__animated','animate__fadeOutUp')
}

export function captureElementPosition(element) {
  element.style.zIndex = element.style.zIndex || 1
  const toTop = element.offsetTop + 'px'
  const toLeft = element.offsetLeft + 'px'  
  const toWidth = (element.clientWidth + (element.offsetWidth - element.clientWidth) + 1) + 'px'
  const toHeight = (element.clientHeight + (element.offsetHeight - element.clientHeight) + 1) + 'px'
  
  // element.style.position = 'fixed'
  // allow other elements that are being removed to have a moment to figure out where they currently sit
  setTimeout(() => {
    element.style.top = toTop
    element.style.left = toLeft  
    element.style.width = toWidth
    element.style.height = toHeight
    element.style.position = 'fixed'
  }, 0)
}
