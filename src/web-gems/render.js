import { Gem } from "./Gem.class.js"
import { interpolateElement } from "./interpolateElement.js"

export function buildItemGemMap(
  gem,
  template, // {string, context}
  insertBefore,
  counts, // {removed:0, added:0}
) {
  const temporary = document.createElement('div')
  
  // render content with a first child that we can know is our first element
  temporary.innerHTML = '<div></div>' + template.string

  const context = gem.update()

  interpolateElement(temporary, context, gem)
  
  const clones = []

  const templateClone = temporary.children[0]
  const sibling = templateClone // a div we added
  let nextSibling = sibling.nextSibling
  temporary.removeChild(templateClone) // remove the div
  while (nextSibling) {
    const nextNextSibling = nextSibling.nextSibling
    temporary.removeChild(nextSibling)
    let waitFor = 0

    const classInsert = nextSibling.getAttribute && nextSibling.getAttribute('class:insert')
    let classNameList = []
    if(classInsert) {
      classNameList = classInsert.split(' ').filter(className => {
        const splits = className.split(':')

        if(splits.length > 1) {
          const name = splits[0]
          const value = splits[1]

          if(name === 'stagger') {
            waitFor = value * counts.added
            ++counts.added
          }

          return false
        }

        return true
      })
    }

    if(waitFor) {
      const n = nextSibling
      setTimeout(() => {
        n.style.visibility = 'visible'
        classNameList.forEach(className => n.classList.add(className))
      }, waitFor)

      n.style.visibility = 'hidden'
    } else {
      classNameList.forEach(className => nextSibling.classList.add(className))
    }
    
    insertBefore.parentNode.insertBefore(nextSibling, insertBefore)

    clones.push(nextSibling)
    nextSibling = nextNextSibling
  }

  gem.clones.push( ...clones )
}
