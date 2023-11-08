import { Subject } from "./Subject.js"
import { evalOver } from "./evals.js"

export function interpolateAttributes(
  child, scope
) {
  const attrHandler = getInputAttributeHandler(child, scope)
  const subs = child.gemSubs = child.gemSubs || []
  child.getAttributeNames().forEach(attrName => {
    const value = child.getAttribute(attrName)
    attrHandler(attrName, value)

    // An attempt to replicate React
    if ( value.search(/^\s*{/) >= 0 && value.search(/}\s*$/) >= 0 ) {
      // get the code inside the brackets like "variable0" or "{variable0}"
      const code = value.replace('{','').split('').reverse().join('').replace('}','').split('').reverse().join('')
      const result = evalOver(scope, code)

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

export function getInputAttributeHandler(
  component,
  scope,
) {
  return (name, value) => {
    // [something] = "x"
    if (name.search(/^\[.*\]/) >= 0) {
      return inputAttribute(name, value, component, scope)
    }

    // something: = "new Date()"
    if (name.search(/:$/) >= 0) {
      const realName = name.replace(/:$/g, '')
      const result = evalWith(value, component)
      component[realName] = result
      return
    }

    // (something) = "component.style.display = something"
    // (click)
    if (name.search(/^\([^()]+\)$/) >= 0) {
      const realName = name.replace(/^\(([^()]+)\)$/g, '$1')
      const result = () => {
        evalWith(value, scope, component, false, true)
      }
      component[realName] = result
      component.removeAttribute(name)
      return
    }
  }
}
