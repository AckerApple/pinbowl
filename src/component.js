import { deepClone } from "./web-gems/deepFunctions.js"

export function component(gemComponent) {
  return (props) => {
    let asyncFunc = param => param
    
    const callback = (toCall, callWith) => {
      const callbackResult = toCall(...callWith)

      // gem.gemSupport.updateOldest()
      const ownerGem = templater._gem.ownerGem
      ownerGem.gemSupport.render()

      return callbackResult
    }
    
    const newProps = resetProps(props, callback)

    const templater = gemComponent( newProps )
    templater.props = props
    templater.cloneProps = deepClone(newProps)
    /*templater.setProps = p => {
      const newProps = resetProps(p, callback)
      templater.cloneProps = deepClone(newProps)
    }*/
    templater.setCallback = x => {
      return asyncFunc = x
    }
    return templater
  }
}

function resetProps(props, callback) {
  const newProps = {...props}

  Object.entries(newProps).forEach(([name, value]) => {
    if(value instanceof Function) {
      newProps[name] = (...args) => {
        //const asyncFunc = callback(value,...args)
        //return asyncFunc(...args)
        return callback(value,args)
      }
      return
    }

    newProps[name] = value
  })

  return newProps
}