import { Subject } from "./Subject.js"

export function interpolateAttributes(
  child, scope, ownerGem
) {
  const subs = []
  child.getAttributeNames().forEach(attrName => {
    const value = child.getAttribute(attrName)

    // An attempt to replicate React
    if ( value.search(/^\s*{/) >= 0 && value.search(/}\s*$/) >= 0 ) {
      // get the code inside the brackets like "variable0" or "{variable0}"
      const code = value.replace('{','').split('').reverse().join('').replace('}','').split('').reverse().join('')
      const result = scope[code]

      // attach as callback
      if(result instanceof Function) {
        child[attrName] = function(...args) {
          result(child, args)
        }
        return
      }

      if(result instanceof Subject) {
        child.removeAttribute(attrName)
        const callback = newValue => {
          callback.value = newValue
          callback.child = child
          callback.scope = scope
          callback.attrName = attrName
          
          if(newValue instanceof Function) {
            child[attrName] = function(...args) {
              newValue(child, args)
            }

            return
          }

          child.setAttribute(attrName, newValue)
        }

        const sub = result.subscribe(callback)
        ownerGem.cloneSubs.push(sub)

        return
      }

      child.setAttribute(attrName, result)
    }
  })
}
