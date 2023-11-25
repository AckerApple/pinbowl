import { ValueSubject } from "./ValueSubject.js"
import { deepClone, deepEqual } from "./deepFunctions.js"
import { isSpecialAttr } from "./interpolateAttributes.js"
import { isGemComponent } from "./interpolateTemplate.js"
import { getGemSupport } from "./renderAppToElement.js"
export const variablePrefix = '__gemVar'

export class Gem {
  context = {} // populated after reading interpolated.values array converted to an object {variable0, variable:1}
  clones = [] // elements on document
  cloneSubs = [] // subscriptions created by clones
  children = [] // gems on me
  
  // only present when a child of a gem
  // ownerGem: Gem
  
  // present only when an array
  // arrayValue: any[]

  constructor(strings, values) {
    this.strings = strings
    this.values = values
    // this.updateValues(values)
  }

  destroy(
    stagger = 0,
    byParent, // who's destroying me? if byParent, ignore possible animations
  ) {
    this.children.forEach(kid => {
      kid.destroy(0, true)
    })
    this.destroySubscriptions()

    if(!byParent) {
      stagger = this.destroyClones(stagger)
    }

    return stagger
  }

  destroySubscriptions() {
    this.cloneSubs.forEach(cloneSub => cloneSub.unsubscribe())
    this.cloneSubs.length = 0
  }

  destroyClones(
    stagger = 0
  ) {
    this.clones.reverse().forEach(clone => {
      let waitFor = 0
      if(clone.getAttributeNames) {
        waitFor = clone.getAttributeNames().reduce((max, name) => {
          if(isSpecialAttr(name)) {
            const splits = name.split(':')
            const attrType = splits.shift() // remove class
            const value = clone.getAttribute(name)

            if(attrType === 'class') {
              if(splits[0] === 'remove') {
                let classList = value.split(' ')
                let length = 0
                let newMax = max

                let newClassList = classList.filter(className => {
                  const valueSplit = className.split(':')
                  const specialName = valueSplit[0]
                  if(specialName === 'capture') {
                    const capture = valueSplit[1]
                    if(capture === 'position') {
                      captureElementPosition(clone)
                      return false
                    }
                  }

                  if(specialName === 'length') {
                    const timeout = Number(valueSplit[1])
                    length = timeout
                    if(newMax < timeout) {
                      newMax = timeout
                    }
                    return false
                  }

                  return true
                }, max)
                
                let waitToAdd = 0
                newClassList = newClassList.filter(className => {
                  const valueSplit = className.split(':')

                  if(valueSplit.length > 1) {

                    const specialName = valueSplit[0]
                    if(specialName === 'stagger') {
                      waitToAdd = Number(valueSplit[1])
                      const totalTime = waitToAdd * stagger
                      waitToAdd = totalTime

                      ++stagger

                      if(!totalTime) {
                        return false
                      }

                      const newTotalTime = totalTime + length
                      if(newMax < newTotalTime) {
                        newMax = newTotalTime
                      }
                      
                      return false
                    }
                  }

                  return true
                })

                
                if(waitToAdd) {
                  setTimeout(() =>
                    newClassList.forEach(className =>
                      clone.classList.add(className)
                    )  
                  , waitToAdd)
                } else {
                  newClassList.forEach(className =>
                    clone.classList.add(className)
                  )
                }

                return newMax
              }
            }
          }

          return max
        }, 0)
      }

      if(waitFor) {
        //clone.parentNode.removeChild(clone)
        const myClone = clone
        setTimeout(() => myClone.parentNode.removeChild(myClone), waitFor)
        return
      }

      clone.parentNode.removeChild(clone)
    })
    this.clones.length = 0
    
    return stagger
  }

  updateByGem(gem) {
    ++this.gemSupport.renderCount
    this.updateConfig(gem.strings, gem.values)
    this.gemSupport.templater = gem.gemSupport.templater
    this.gemSupport.updateOldest()
  }

  lastTemplateString = undefined // used to compare templates for updates

  /** A method of passing down the same render method */
  setSupport(gemSupport) {
    this.gemSupport = this.gemSupport || gemSupport
    this.gemSupport.mutatingRender = this.gemSupport.mutatingRender || gemSupport.mutatingRender
    this.children.forEach(kid => kid.setSupport(gemSupport))
  }

  updateOwner() {
    // this.render()
    let templateOwner = this
    while(templateOwner.ownerGem) {
      
      if(templateOwner.gemSupport.templater) {
        templateOwner.gemSupport.render(true)
        //templateOwner.updateOwner()
        return
      }

      templateOwner = templateOwner.ownerGem
    }
  }
  
  updateConfig(strings, values) {
    this.strings = strings
    this.updateValues(values)
  }

  getTemplate() {
    const string = this.lastTemplateString = this.strings.map((string, index) => {
      const endString = string + (this.values.length > index ? `{${variablePrefix}${index}}` : '')
      return endString
    }).join('')

    return { string, strings: this.strings, values: this.values, context:this.context }
  }

  isLikeGem(gem) {
    if(gem.lastTemplateString !== this.lastTemplateString) {
      return false
    }
    
    if(gem.values.length !== this.values.length) {
      return false
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
        //value.gemSupport = this.gemSupport
        this.children.push(value) // record children I created
        
        // TODO: This maybe redundant because the first condition already rejects if not defined
        value.lastTemplateString || value.getTemplate().string // ensure last template string is generated
        compareTo.lastTemplateString || compareTo.getTemplate().string // ensure last template string is generated

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

  update() {
    return this.updateContext( this.context )
  }

  updateValues(values, topDown) {
    this.values = values
    return this.updateContext(this.context, topDown)
  }

  updateContext(context) {
    this.strings.map((_string, index) => {
      const variableName = variablePrefix + index
      const hasValue = this.values.length > index
      const value = this.values[index]

      // is something already there?
      const existing = context[variableName]

      if(existing) {
        const ogGEm = existing.value?.gem

        // handle already seen gems
        if(ogGEm) {  
          const gemSupport = ogGEm.gemSupport
          const templater = value
          const regem = templater(gemSupport)
          templater._gem = regem
          regem.ownerGem = ogGEm.ownerGem
          regem.getTemplate() // cause lastTemplateString to render
          regem.setSupport(gemSupport)
          ogGEm.updateByGem(regem)
          existing.set(value)
          return
        }

        // handle already seen gem components
        if(isGemComponent(value)) {
          const latestProps = deepClone(value.props) // value.cloneProps
          const existingGem = existing.gem

          // previously was something else, now a gem component
          if(!existing.gem) {
            setValueRedraw(value, existing, this)
            value.redraw(latestProps)
            return
          }

          const oldGemSetup = existingGem.gemSupport
          const oldestGem = oldGemSetup.oldest
          // const oldProps = oldestGem.gemSupport.templater.cloneProps // existingSupport.mutatingRender.lastProps
          const oldProps = this.gemSupport.templater.cloneProps // existingSupport.mutatingRender.lastProps

          if(existingGem) {
            const equal = deepEqual(oldProps, latestProps)  
            if(equal) {
              return
            }
          }
          
          setValueRedraw(value, existing, this)
          oldGemSetup.templater = value
          oldGemSetup.newest = value.redraw(latestProps)
          return
        }

        // now its a function
        if(value instanceof Function) {
          existing.set(bindSubjectFunction(value, this))
          return
        }

        existing.set(value) // let ValueSubject now of newest value
        
        return
      }

      // First time values below

      if(isGemComponent(value)) {
        const existing = context[variableName] = new ValueSubject(value)
        setValueRedraw(value, existing, this)
        return
      }

      if(value instanceof Function) {
        context[variableName] = getSubjectFunction(value, this)
        return
      }

      if(!hasValue) {
        return // more strings than values, stop here
      }

      if(value instanceof Gem) {
        value.ownerGem = this
        this.children.push(value)
      }

      context[variableName] = new ValueSubject(value)
    })

    return context
  }
}

function getSubjectFunction(value, gem) {
  return new ValueSubject(bindSubjectFunction(value, gem))
}

function bindSubjectFunction(value, gem) {
  function subjectFunction(element, args) {
    const renderCount = gem.gemSupport.renderCount

    const callbackResult = value.bind(element)(...args)

    if(renderCount !== gem.gemSupport.renderCount) {
      return // already rendered
    }

    console.log('self render')
    // gem.updateOwner()
    gem.gemSupport.render()
    gem.gemSupport.updateOldest()
    
    if(callbackResult instanceof Promise) {
      callbackResult.then(() => {
        // gem.updateOwner()
        gem.render()
        gem.gemSupport.updateOldest()
      })
    }

    return callbackResult
  }

  subjectFunction.gemFunction = value

  return subjectFunction
}

function captureElementPosition(element) {
  element.style.zIndex = element.style.zIndex || 1
  element.style.top = element.offsetTop + 'px'
  element.style.left = element.offsetLeft + 'px'
  
  element.style.width = (element.clientWidth + (element.offsetWidth - element.clientWidth) + 1) + 'px'
  element.style.height = (element.clientHeight + (element.offsetHeight - element.clientHeight) + 1) + 'px'
    
  setTimeout(() => {
    element.style.position = 'fixed'
  }, 0);
}

function setValueRedraw(
  templater, // latest gem function to call for rendering
  existing,
  ownerGem
) {
  templater.redraw = () => {
    // Find previous variables
    const existingGem = existing.gem
    const gemSupport = existingGem?.gemSupport || getGemSupport(templater) // this.gemSupport
    gemSupport.mutatingRender = gemSupport.mutatingRender || existing.gemSupport?.mutatingRender || this.gemSupport.mutatingRender
    
    console.log('redraw run', existingGem?.values, gemSupport.newest?.values, templater._gem?.value)

    const regem = templater(gemSupport)
    // regem.setSupport(gemSupport)
    templater._gem = regem
    // existing.gem = regem
    regem.ownerGem = existingGem?.ownerGem || ownerGem
    //templater.gemSupport = gemSupport

    gemSupport.oldest = gemSupport.oldest || regem
    gemSupport.newest = regem

    console.log('update gem support --->', gemSupport.oldest.gemSupport.templater, gemSupport.templater)
    gemSupport.oldest.gemSupport = gemSupport.oldest.gemSupport || gemSupport
    gemSupport.oldest.gemSupport.templater = templater
    // existingGem.gemSupport.templater = templater

    regem.getTemplate() // cause lastTemplateString to render
    regem.setSupport(gemSupport)
    const isSameGem = existingGem && existingGem.isLikeGem(regem)

    // If previously was a gem and seems to be same gem, then just update current gem with new values
    if(isSameGem) {
      console.log('xxxx-0', regem.values, existingGem.values)
      gemSupport.oldest.updateByGem(regem)
      console.log('xxxx-1', regem.values, existingGem.values)
      // gemSupport.updateOldest()
      return
    }

    existing.set(templater)

    return regem
  }
}
