import { Subject } from "./Subject.js"

export function interpolateAttributes(
  child, scope
) {
  const subs = child.gemSubs = child.gemSubs || []
  child.getAttributeNames().forEach(attrName => {
    const value = child.getAttribute(attrName)

    // An attempt to replicate React
    if ( value.search(/^\s*{/) >= 0 && value.search(/}\s*$/) >= 0 ) {
      // get the code inside the brackets like "variable0" or "{variable0}"
      const code = value.replace('{','').split('').reverse().join('').replace('}','').split('').reverse().join('')
      //const result = evalOver(scope, code)
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
        const sub = result.subscribe(newValue => {
          if(newValue instanceof Function) {
            child[attrName] = function(...args) {
              newValue(child, args)
            }

            return
          }

          child.setAttribute(attrName, newValue)
        })
        subs.push(sub)
        return
      }

      child.setAttribute(attrName, result)
    }
  })
}
