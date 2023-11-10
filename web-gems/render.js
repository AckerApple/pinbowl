import { Gem } from "./Gem.class.js"
import { interpolateElement } from "./interpolateElement.js"

export function buildItemGemMap(
  gem,
  template,
  insertBefore,
) {
  const temporary = document.createElement('div')
  
  // render content with a first child that we can know is our first element
  temporary.innerHTML = '<div></div>' + template.template

  interpolateElement(temporary, gem.context, gem)
  
  const clones = []

  const templateClone = temporary.children[0]
  const sibling = templateClone // a div we added
  let nextSibling = sibling.nextSibling
  temporary.removeChild(templateClone) // remove the div
  while (nextSibling) {
    const nextNextSibling = nextSibling.nextSibling
    temporary.removeChild(nextSibling)
    insertBefore.parentNode.insertBefore(nextSibling, insertBefore)
    clones.push(nextSibling)
    nextSibling = nextNextSibling
  }

  gem.clones.push( ...clones )
}

export function $(strings, ...values) {
  return new Gem(strings, values)
}

$.for = (
  arrayValue
) => {
  return (strings, ...values) => {
    const gem = $(strings, ...values)
    gem.arrayValue = arrayValue
    return gem
  }
}
