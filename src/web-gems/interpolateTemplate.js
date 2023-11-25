import { buildItemGemMap } from "./render.js"
import { Gem, variablePrefix } from "./Gem.class.js"
import { Subject } from "./Subject.js"
import { processGemArray } from "./processGemArray.js"
import { getGemSupport } from "./renderAppToElement.js"
import { deepClone, deepEqual } from "./deepFunctions.js"

export function interpolateTemplate(
  template, // <template end interpolate /> (will be removed)
  context, // variable scope of {`__gemVar${index}`:'x'}
  ownerGem, // Gem class
  counts, // {added:0, removed:0}
) {
  if ( !template.hasAttribute('end') ) {
    return // only care about starts
  }

  const variableName = template.getAttribute('id')
  if(variableName.substring(0, variablePrefix.length) !== variablePrefix) {
    return // ignore, not a gemVar
  }

  const result = context[variableName]
  if(result instanceof Subject) {
    const callback = templateNewValue => {
      processSubjectValue(templateNewValue, result, template, ownerGem, counts)

      setTimeout(() => {
        counts.added = 0 // reset
        counts.removed = 0 // reset
      }, 0)
    }
    const sub = result.subscribe(callback)
    ownerGem.cloneSubs.push(sub)
    return
  }

  const clone = updateBetweenTemplates(
    result,
    template.clone || template, // The element set here will be removed from document
  )
  
  ownerGem.clones.push(clone)
  template.clone = clone
  
  return
}

function processSubjectValue(
  value,
  result, // could be gem via result.gem
  template, // <template end interpolate /> (will be removed)
  ownerGem,
  counts, // {added:0, removed:0}
) {
  if (value instanceof Gem) {
    // first time seeing this gem?
    if(!value.gemSupport) {
      value.gemSupport = getGemSupport()
      value.gemSupport.mutatingRender = ownerGem.gemSupport.mutatingRender
      value.gemSupport.oldest = value
      
      ownerGem.children.push(value)
      value.ownerGem = ownerGem
    }

    // value.gemSupport.newest = value

    processGemResult(
      value,
      result, // Function will attach result.gem
      template,
      undefined,
      counts
    )

    return
  }

  // *if processing WAS a gem BUT NOW its some other non-gem value
  if (result.gem) {
    // put the template back
    const lastFirstChild = template.clone || template// result.gem.clones[0] // template.lastFirstChild
    lastFirstChild.parentNode.insertBefore(template, lastFirstChild)

    const animated = result.gem.destroy(counts.removed)
    counts.removed = counts.removed + animated
    delete result.gem

    const clone = updateBetweenTemplates(
      value,
      lastFirstChild // ✅ this will be removed
    ) // the template will be remove in here

    template.clone = clone

    return
  }

  // *for map
  if(value instanceof Array && value.every(x => x instanceof Gem)) {
    return processGemArray(result, value, template, ownerGem, counts)
  }

  if(isGemComponent(value)) {
    if(!value.cloneProps) {
      const error = new Error(`Not a gem component. Use functionName = component(functionName) on component:\n\n${value.toString().substring(0,120)}\n\n`)
      throw error
    }

    const gemSupport = result.gem?.gemSupport || getGemSupport( value )
    value.setCallback( ownerGem.gemSupport.async )

    gemSupport.mutatingRender = (bottomUp) => {
      const newProps = deepClone(value.props)
      // const newProps = value.cloneProps
      // const oldProps = result.value.cloneProps
      const oldProps = result.gem.gemSupport.templater.cloneProps

      if(deepEqual(newProps, oldProps)) {
        gemSupport.newest = value.redraw(newProps) // No change detected
        return gemSupport.newest
      }

      return gemSupport.newest = ownerGem.gemSupport.render( newProps )
    }
    
    const templater = value
    const gem = templater(gemSupport)
    templater._gem = gem
    gem.ownerGem = ownerGem
    gemSupport.oldest = gem
    // gemSupport.newest = gem

    // new
    //value.gemSupport = gemSupport
    value.deepCheckEquals = (lastProps) => {
      const oldProps = value.cloneProps
      const newProps = deepClone(oldProps)
      return deepEqual(lastProps, newProps)
    }

    gem.ownerGem = ownerGem
    ownerGem.children.push(gem)
    gem.setSupport(gemSupport)

    processGemResult(
      gem,
      result, // The element set here will be removed from document
      template,
      undefined,
      counts,
    )

    return
  }

  const before = template.clone || template // Either the template is on the doc OR its the first element we last put on doc

  // Processing of regular values
  const clone = updateBetweenTemplates(
    value,
    before, // this will be removed
  )

  template.clone = clone

  const oldPos = ownerGem.clones.indexOf(before)
  if(oldPos>=0 && !ownerGem.clones.includes(clone) && !before.parentNode) {
    ownerGem.clones.splice(oldPos, 1)
    ownerGem.clones.push(clone)    
  }
}

// Function to update the value of x
export function updateBetweenTemplates(
  value,
  lastFirstChild,
) {
  const parent = lastFirstChild.parentNode
  
  // mimic React skipping to display EXCEPT for true does display on page
  if(value === undefined || value === false || value === null) { // || value === true
    value = ''
  }

  // Insert the new value (never use innerHTML here)
  const textNode = document.createTextNode(value) // never innerHTML
  parent.insertBefore(textNode, lastFirstChild)

  /* remove existing nodes */
  lastFirstChild.parentNode.removeChild(lastFirstChild)
  
  return textNode
}

/** Returns {clones:[], subs:[]} */
export function processGemResult(
  gem,
  result, // used for recording past and current value
  insertBefore, // <template end interpolate />
  index,
  counts, // {added:0, removed:0}
) {
  const template = gem.getTemplate()

  // *for
  if(index !== undefined) {
    const existing = result.lastArray[index]

    if(existing?.gem.isLikeGem(gem)) {
      existing.gem.updateByGem(gem)
      return 
    }

    const lastFirstChild = insertBefore // gem.clones[0] // insertBefore.lastFirstChild
    buildItemGemMap(gem, template, lastFirstChild, counts)
    result.lastArray.push({
      gem, index
    })
    
    return
  }

  // *if appears we already have seen
  if(result.gem) {
    // are we just updating an if we already had?
    if(result.gem.isLikeGem(gem)) {
      if(result instanceof Function) {
        const newGem = result(result.gem.gemSupport)
        result.gem.updateByGem(newGem)
        return
      }

      result.gem.updateByGem(gem)
      
      return
    }    
  }

  // *if just now appearing to be a Gem
  const before = insertBefore.clone || insertBefore

  buildItemGemMap(gem, template, before, counts)
  result.gem = gem // let reprocessing know we saw this previously as an if
}


export function isGemComponent(value) {
  return value instanceof Function && value.toString().includes('html`')
}
