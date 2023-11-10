import { ValueSubject } from "./ValueSubject.js"
import { interpolateElement } from "./interpolateElement.js"

export const variablePrefix = '__gemVar'

export class Gem {
  props = undefined
  context = {}
  clones = []

  constructor(strings, values) {
    this.strings = strings
    this.values = values
    this.updateValues(values)
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
    
    while(gem.ownerGem) {
      gem = gem.ownerGem // let the highest gem do the updating
    }

    if(!gem.templater) {
      throw 'Cannot find owning gem that rerender content'
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
    if(!gem.lastTemplateString || !this.lastTemplateString) {
      throw 'bad comparison'
    }

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
        subject.gemOwner = config
      }
    })

    return context
  }
}

export function buildItemGemMap(
  gem,
  template,
  insertBefore,
) {
  const temporary = document.createElement('div')
  
  // render content with a first child that we can know is our first element
  temporary.innerHTML = '<div></div>' + template.template

  interpolateElement(temporary, gem.context, temporary)
  
  const clones = []

  const templateClone = temporary.children[0]
  let sibling = templateClone;
  let nextSibling = sibling.nextSibling
  temporary.removeChild(templateClone) // remove the div
  while (nextSibling) {
    const nextNextSibling = nextSibling.nextSibling
    temporary.removeChild(nextSibling)
    insertBefore.parentNode.insertBefore(nextSibling, insertBefore)
    clones.push(nextSibling)
    nextSibling = nextNextSibling
  }

  if(gem.clones) {
    if(!clones.find(clone => gem.clones.includes(clone))) {
      gem.clones.push(...clones)
    }
  } else {
    gem.clones = clones
  }
  
  return { clones, subs: [], parentNode:insertBefore.parentNode }
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
