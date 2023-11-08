import { interpolateAttributes } from "./interpolateAttributes.js"
import { interpolateToTemplates } from "./interpolations.js"
import { interpolateContentTemplates } from "./interpolateContentTemplates.js"

export function interpolateElement(
  element,
  context, // variables used to evaluate
  // owner, // this aka element
) {
  const result = interpolateChild(element, context, element)
  // const result = interpolateChild(element, context, owner)
  if(result.keys.length) {
    interpolateContentTemplates(element, context)
    // interpolateContentTemplates(owner, context)
  }
  interpolateAttributes(element, context)

  function processChildren(children) {
    new Array(...children).forEach(child => {
      interpolateAttributes(child, context)

      if(child.children) {
        processChildren(child.children)
      }
    })
  }

  processChildren(element.children)
}

/** Convert interpolations into template tags */
export function interpolateChild(
  child, context, owner, toAppend
) {
  const html = child.innerHTML
 
  const result = interpolateToTemplates(html, context)
  child.innerHTML = result.string

  // 🔒 Prevent anyone from editing template which would cause that content to be executable
  if(toAppend) {
    owner.appendChild(toAppend)
  }

  return result
}
