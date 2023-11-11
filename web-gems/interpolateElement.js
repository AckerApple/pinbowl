import { interpolateAttributes } from "./interpolateAttributes.js"
import { interpolateToTemplates } from "./interpolations.js"
import { interpolateContentTemplates } from "./interpolateContentTemplates.js"

export function interpolateElement(
  element,
  context, // variables used to evaluate
  ownerGem,
) {
  const result = interpolateElementChild(element, context, element)

  if(result.keys.length) {
    interpolateContentTemplates(element, context, ownerGem)
  }

  interpolateAttributes(element, context)

  function processChildren(children) {
    new Array(...children).forEach(child => {
      interpolateAttributes(child, context, ownerGem)

      if(child.children) {
        processChildren(child.children)
      }
    })
  }

  processChildren(element.children)

  return
}

/** Convert interpolations into template tags */
export function interpolateElementChild(
  child, context,
) {
  const html = child.innerHTML
 
  const result = interpolateToTemplates(html, context)
  child.innerHTML = result.string

  return result
}
