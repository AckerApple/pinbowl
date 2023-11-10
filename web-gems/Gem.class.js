import { ValueSubject } from "./ValueSubject.js"
export const variablePrefix = '__gemVar'

export class Gem {
  props = undefined
  context = {} // {variable0, variable:1}
  clones = [] // elements on document
  cloneSubs = [] // subscriptions created by clones
  children = [] // gems on me
  // arrayValue // present only when an array
  // ownerGem

  constructor(strings, values) {
    this.strings = strings
    this.values = values
    this.updateValues(values)
  }

  destroy() {
    this.children.forEach(kid => {
      kid.destroy()
    })
    this.destroySubscriptions()
    this.destroyClones()
  }

  destroySubscriptions() {
    this.cloneSubs.forEach(cloneSub => cloneSub.unsubscribe())
    this.cloneSubs.length = 0
  }

  destroyClones() {
    this.clones.forEach(clone =>
      removeChild(clone)
    )
    this.clones.length = 0
  }
  
  setTemplater(templater) {
    this.templater = templater
  }
    
  update() {
    const {strings, values} = this.templater()
    this.updateConfig(strings, values)
  }

  updateByGem(gem) {
    this.updateConfig(gem.strings, gem.values)
  }

  lastTemplateString = undefined // used to compare templates for updates

  updateOwner() {
    let gem = this
    while (gem.ownerGem) {
      gem = gem.ownerGem // let the highest gem do the updating
    }

    if(!gem.templater) {
      const msg = '🔴 Cannot find owning gem that rerender content'
      console.error(msg, gem)
      throw msg
    }

    gem.update() // only time this function should be called
  }
  
  updateConfig(strings, values) {
    this.strings = strings
    this.updateValues(values)
  }

  getTemplate() {
    const template = this.lastTemplateString = this.strings.map((string, index) => {
      const endString = string + (this.values.length > index ? `{${variablePrefix}${index}}` : '')
      return endString
    }).join('')

    return { template, context:this.context }
  }

  isLikeGem(gem) {
    if(gem.lastTemplateString !== this.lastTemplateString) {
      return false
    }
    
    if(gem.values.length !== this.values.length) {
      return
    }

    const allVarsMatch = gem.values.every((value, index)=> {
      const compareTo = this.values[index]
      const isFunctions = value instanceof Function && compareTo instanceof Function
      
      if(isFunctions) {
        const stringMatch = value.toString() === compareTo.toString()
        if(stringMatch) {
          return true
        }

        return false
      }

      if(value instanceof Gem && compareTo instanceof Gem) {        
        value.ownerGem = this // let children know I own them
        this.children.push(value) // record children I created
        
        value.lastTemplateString || value.getTemplate() // ensure last template string is generated
        compareTo.lastTemplateString || compareTo.getTemplate() // ensure last template string is generated

        if(value.isLikeGem(compareTo)) {
          return true
        }

        return false
      }
      
      return true
      // Cannot compare simple values
      // return value === compareTo
    })

    if(allVarsMatch) {
      return true
    }

    return false
  }

  updateValues(values) {
    this.values = values
    this.updateContext(this.context)
  }

  updateContext(context) {
    const config = this
    config.strings.map((_string, index) => {
      const variableName = variablePrefix + index
      const hasValue = config.values.length > index
      const value = config.values[index]

      // is something already there?
      const existing = context[variableName]
      if(existing) {
        // already a function wrapped in subject
        if(value instanceof ValueSubject && values.value instanceof Function) {
          existing.set(bindSubjectFunction(value, config))
          return
        }
        
        // now its a function
        if(value instanceof Function) {
          existing.set(bindSubjectFunction(value, config))
          return
        }

        existing.set(value) // let ValueSubject know of newest value
        return
      }

      if(value instanceof Function) {
        context[variableName] = getSubjectFunction(value, config)
      } else {
        if(!hasValue) {
          return // more strings than values, stop here
        }
        const subject = new ValueSubject(value)
        context[variableName] = subject
      }
    })

    return context
  }
}

function getSubjectFunction(value, config) {
  return new ValueSubject(bindSubjectFunction(value, config))
}

function bindSubjectFunction(value, gem) {
  return function subjectFunction(element, args) {
    const result = value.bind(element)(...args)
    
    gem.updateOwner()

    if(result instanceof Promise) {
      result.then(() => gem.updateOwner())
    }
  }
}

export function removeChild(child) {
  if(child.gemSubs) {
      child.gemSubs.forEach(gemSub => gemSub.unsubscribe())
      child.gemSubs.length = 0
      delete child.gemSubs
  }

  if(child.childNodes) {
    new Array(...child.childNodes).forEach(subChild =>
      removeChild(subChild)
    )
  }

  child.parentNode.removeChild(child)
}