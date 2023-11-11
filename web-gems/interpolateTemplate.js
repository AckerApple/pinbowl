import { buildItemGemMap } from "./render.js"
import { Gem, removeChild, variablePrefix } from "./Gem.class.js"
import { Subject } from "./Subject.js"

export function interpolateTemplate(
  template, // <template end interpolate /> (will be removed)
  context, // variable scope of {`__gemVar${index}`:'x'}
  ownerGem, // Gem class
) {
  if ( !template.hasAttribute('end') ) {
    return // only care about starts
  }

  const parent = template.getAttribute('parent')
  const isMine = !parent
  if ( !isMine ) {
    return// not for me, for someone else
  }

  const variableName = template.getAttribute('id')

  if(variableName.substring(0, variablePrefix.length) !== variablePrefix) {
    return // ignore, not a gemVar
  }

  const result = context[variableName]

  if(result instanceof Subject) {
    const callback = value => {
      callback.value = value
      callback.result = result
      callback.template = template
      processSubjectValue(value, result, template, ownerGem)
    }
    const sub = result.subscribe(callback)
    ownerGem.cloneSubs.push(sub)
    return
  }

  const clone = updateBetweenTemplates(
    result,
    template.clone || template, // this will be removed
  )
  ownerGem.clones.push(clone)
  template.clone = clone
  template.parentNode.removeChild(template) // it wont update again, remove template placeholder
  
  return
}

function processSubjectValue(
  value,
  result, // could be gem via result.gem
  template,
  ownerGem,
) {
  // *if processing resolved to Gem
  if (value instanceof Gem) {
    processGemResult(
      value,
      result,
      template
    )
    
    if(result.gem) {
      result.gem.ownerGem = ownerGem // Let the previous gem result know its owner (THIS MAY NOT BE NEEDED AND REDUDANT)      
      value.ownerGem = ownerGem // let new gem know the owner
      ownerGem.children.push(value) // let the owner know it has a new kid
    }

    // template.lastFirstChild = clones[0]
    return
  }

  // *if processing WAS a gem BUT NOW its some other non-gem value
  if (result.gem) {
    // put the template back
    let lastFirstChild = template.clone || template// result.gem.clones[0] // template.lastFirstChild
    lastFirstChild.parentNode.insertBefore(template, lastFirstChild)

    result.gem.destroy()
    delete result.gem

    const clone = updateBetweenTemplates(
      value,
      lastFirstChild // ✅ this will be removed
    ) // the template will be remove in here

    template.clone = clone

    return
  }

  // *for
  if (value instanceof Array && value.every(x => x instanceof Gem)) {
    return processGemArray(result, value, template, ownerGem)
  }

  // Processing of regular values
  const before = template.clone || template
  const clone = updateBetweenTemplates(
    value,
    before, // this will be removed
  )

  template.clone = clone
}

function processGemArray(
  result, // gem
  value, // arry of Gem classes
  template, // <template end interpolate />
  ownerGem,
) {
  result.lastArray = result.lastArray || [] // {gem, index}[] populated in processGemResult
  // result.templateArray = result.templateArray || []

  /** 🗑️ remove previous items first */
  result.lastArray.forEach((item, index) => {
    const subGem = value[index]
    const subArrayValue = subGem?.arrayValue
    const lessLength = value.length-1 < index
    if(lessLength || subArrayValue !== item.gem.arrayValue) {
      const last = result.lastArray[index]
      // const item = result.templateArray[index]
      const gem = last.gem
      // removeTemplateItem( last.build )
      gem.destroy()
      // subGem.destroy()
      result.lastArray.splice(index, 1)
      // removeTemplateItem( item )
      // result.templateArray.splice(index, 1)
    }
  })

  value.forEach((subGem, index) => {
    subGem.ownerGem = ownerGem
    
    ownerGem.children.push(subGem)

    if (subGem.arrayValue === undefined) {
      // appears arrayValue is not there but maybe arrayValue is actually the value of undefined
      if (!Object.keys(subGem).includes('arrayValue')) {
        const err = new Error('Use $.for(item)`html` instead of $`html` to template an Array. Example: array.map(item => $.for(item)``)')
        err.code = 'replace-with-for'
        throw err
      }
    }

    const previous = result.lastArray[index]
    if (previous) {
      if (previous.gem.arrayValue === subGem.arrayValue) {
        previous.gem.updateValues(subGem.values)
      }
    } else {
      const before = template || template.clone
      processGemResult(subGem, result, before, index, ownerGem)
    }
  })

  while (result.lastArray.length > value.length) {
    result.lastArray.pop()
  }

  return
}

// Function to update the value of x
export function updateBetweenTemplates(
  value,
  lastFirstChild,
) {
  const parent = lastFirstChild.parentNode
  
  // mimic React skipping to display
  if(value === undefined || value === false || value === true || value === null) {
    value = ''
  }

  // Insert the new value (never use innerHTML here)
  const textNode = document.createTextNode(value)
  parent.insertBefore(textNode, lastFirstChild)

  /* remove existing nodes */
  // removeTemplateItem(template)
  lastFirstChild.parentNode.removeChild(lastFirstChild)
  
  /*
  if(template.clones) {
    template.clones.push(textNode)
  }
  */

  return textNode
}

/** Returns {clones:[], subs:[]} */
function processGemResult(
  gem,
  result,
  insertBefore, // <template end interpolate />
  index,
) {
  const templateString = gem.getTemplate()

  // *for
  if(index !== undefined) {
    const existing = result.lastArray[index]

    if(existing?.gem.isLikeGem(gem)) {
      existing.gem.updateByGem(gem)
      return {clones: existing.gem.clones} // seen already
    }

    const lastFirstChild = insertBefore // gem.clones[0] // insertBefore.lastFirstChild
    buildItemGemMap(gem, templateString, lastFirstChild)
    // gem.clones = build.clones
    result.lastArray.push({
      gem, index
    })
    // result.templateArray.push(build)
    
    return
  }

  // *if appears we aready have seen
  if(result.gem) {
    // are we just updating an if we already had?
    if(result.gem.isLikeGem(gem)) {
      result.gem.updateByGem(gem)
      result.gem // we were a gem and still am the same gem
      return {clones: result.gem.clones}
    }
  }

  // *if just now appearing to be a Gem
  const before = insertBefore.clone || insertBefore // gem.clones[0]
  buildItemGemMap(gem, templateString, before)  
  result.gem = gem // let reprocessing know we saw this previously as an if
  
  gem.processed = true
}
