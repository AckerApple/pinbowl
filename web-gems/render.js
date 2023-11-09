import { ValueSubject } from "./ValueSubject.js"
import { interpolateElement } from "./interpolateElement.js"

export const variablePrefix = '__gemVar'

export class Gem {
  strings = undefined
  values = undefined
  props = undefined
  context = {}
  clones = []
  
  constructor(update) {
    this.update = update
  }

  lastTemplateString = undefined // used to compare templates for updates
  
  getTemplate() {
    // string could contain {this is not a variable}, lets remap those    
    const newStrings = this.strings.map(string => {
      return string
      /*
      const braces = breakBraces(string) // detect braces
      
      if(!braces.values.length && !braces.strings.length) {
        return string // no work todo
      }

      let newString = braces.strings.map((string, index) => {
        const varName = variablePrefix + `_braced_${index}`
        
        if(braces.values[index]) {
          this.context[varName] = '{' + braces.values[index] + '}'
          return string + `{${varName}}`
        }

        return string
      }).join('')

  
      const diff = braces.values.length - braces.strings.length
      if(diff > 0) {
        newString = braces.values.splice(diff-1, diff).map(value => {
          const varName = variablePrefix + `_braced_${index}`
          this.context[varName] = '{' + value + '}'
          return `{${varName}}`
        }).join('')
      }    

      return newString
      */
    })

    const template = this.lastTemplateString = newStrings.map((string, index) => {
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

export function renderFor(
  arrayValue,
  templater //: (props)=>string the function that both provides the original template AND variable updates
) {
  const config = render(templater)
  config.arrayValue = arrayValue
  return config
}

/** Returns config */
export function render(
  templater //: (props)=>string the function that both provides the original template AND variable updates
) {
  const config = new Gem(update)

  // Build context
  function updateConfig(strings, values) {
    config.strings = strings
    config.updateValues(values)
  }
  
  function interpolate(strings, ...values) {
    ++setupCount
    updateConfig(strings, values)
  }

  function update() {
    // config.values = newValues // does nothing because just updated below
    setupCount = 0
    templater(interpolate)
    if(setupCount > 1) {
      throw 'template interpolation function was called more than once. To render additional templates, call render(template => template\`\`)'
    }
  }

  let setupCount = 0
  templater(interpolate)
  
  if(setupCount > 1) {
    throw 'template interpolation function was called more than once. To render additional templates, call render(template => template\`\`)'
  }
  
  return config
}

function getSubjectFunction(value, config) {
  return new ValueSubject(bindSubjectFunction(value, config))
}

function bindSubjectFunction(value, config) {
  return function subjectFunction(element, args) {
    const result = value.bind(element)(...args)
    
    while(config.ownerGem) {
      config = config.ownerGem // let the highest gem do the updating
    }

    config.update()

    if(result instanceof Promise) {
      result.then(() => config.update())
    }
  }
}

function breakBraces(inputString) {
  let strings = [];
  let values = [];
  let startIndex = 0;
  let endIndex;

  while ((startIndex = inputString.indexOf('{', startIndex)) !== -1) {
    endIndex = inputString.indexOf('}', startIndex);
    if (endIndex !== -1) {
      strings.push(inputString.substring(0, startIndex));
      values.push(inputString.substring(startIndex + 1, endIndex));
      inputString = inputString.substring(endIndex + 1);
    } else {
      // Unmatched opening brace found
      strings.push(inputString.substring(0, startIndex));
      values.push('');
      inputString = '';
      break;
    }
  }

  strings.push(inputString);
  return { strings, values };
}
