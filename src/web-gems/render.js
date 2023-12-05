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
  
  const clones = buildClones(temporary, insertBefore, counts)
  gem.clones.push( ...clones )
}

function buildClones(
  temporary,
  insertBefore,
  counts, // {removed:0, added:0}
) {
  const clones = []
  const templateClone = temporary.children[0]
  const sibling = templateClone // a div we added
  let nextSibling = sibling.nextSibling
  temporary.removeChild(templateClone) // remove the div
  
  while (nextSibling) {
    const nextNextSibling = nextSibling.nextSibling
    buildSibling(nextSibling, temporary, insertBefore, counts)
    clones.push(nextSibling)
    nextSibling = nextNextSibling
  }

  return clones
}

function buildSibling(
  nextSibling,
  temporary,
  insertBefore,
  counts, // {removed:0, added:0}
) {
  temporary.removeChild(nextSibling)

  if(nextSibling.getAttribute) {
    elementInitCheck(nextSibling, counts)
  }
  
  insertBefore.parentNode.insertBefore(nextSibling, insertBefore)  
}

function elementInitCheck(nextSibling, counts) {
  const onInitDoubleWrap = nextSibling.oninit // nextSibling.getAttribute('oninit')
  if(!onInitDoubleWrap) {
    return
  }

  const onInitWrap = onInitDoubleWrap.gemFunction
  if(!onInitWrap) {
    return
  }

  const onInit = onInitWrap.gemFunction
  if(!onInit) {
    return
  }

  const event = {target: nextSibling, stagger: counts.added}
  onInit(event)

  ++counts.added
}