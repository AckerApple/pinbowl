import { Gem, buildItemGemMap, variablePrefix } from "./render.js"
import { Subject } from "./Subject.js"
import { removeChild } from "./removeChild.js"

export function interpolateTemplate(
  template, // <template end interpolate />
  context, // variable scope of {`__gemVar${index}`:'x'}
  subs,
) {
  if ( !template.hasAttribute('end') ) {
    return // only care about starts
  }

  const parent = template.getAttribute('parent')
  const isMine = !parent
  if ( !isMine ) {
    return // not for me, for someone else
  }

  const variableName = template.getAttribute('id')

  if(variableName.substring(0, variablePrefix.length) !== variablePrefix) {
    return // ignore, not a gemVar
  }

  const result = context[variableName]
  template.clones = []
  template.lastFirstChild = template

  if(result instanceof Subject) {
    return processSubject(result, template, subs)
  }

  updateBetweenTemplates(result, template)
  template.parentNode.removeChild(template) // it wont update again, remove template placeholder
}

function processSubject(result, template, subs) {
  const sub = result.subscribe(value => {
    // *if processing resolved to Gem
    if (value instanceof Gem) {
      value.ownerGem = result.gemOwner
      const clones = processGemResult(
        value,
        result,
        template
      )
      template.lastFirstChild = clones[0]
      return
    }

    // *if processing was a gem now other non-gem value
    if (result.gem) {      
      // put the template back
      template.lastFirstChild.parentNode.insertBefore(template, template.lastFirstChild)
      template.clones.forEach(x=>
        x.parentNode.removeChild(x)
      )
      template.clones.length = 0
      template.lastFirstChild=template


      result.gem.clones.forEach(clone => {
        clone.parentNode.removeChild(clone)
      })
      delete result.gem


      const clones = updateBetweenTemplates(value, template)
      template.lastFirstChild = clones[0]
      return
    }

    // *for
    if (value instanceof Array && value.every(x => x instanceof Gem)) {
      return processGemArray(result, value, template)
    }

    // Processing of regular values
    const clones = updateBetweenTemplates(
      value,
      template
    )

    // remove template from stage and save place holder of where we will throw down next
    if (template.parentNode) {
      template.parentNode.removeChild(template)
    }
    template.lastFirstChild = clones[0]
  })

  subs.push(sub)

  return
}

function processGemArray(
  result,
  value,
  template, // <template end interpolate />
) {
  result.lastArray = result.lastArray || [] // {build, gem, index}[]
  result.templateArray = result.templateArray || []

  /** remove previous items first */
  result.lastArray.forEach((item, index) => {
    const subGem = value[index]
    const subArrayValue = subGem?.arrayValue
    const lessLength = value.length-1 < index
    if(lessLength || subArrayValue !== item.gem.arrayValue) {
      result.lastArray.splice(index, 1)
      // TODO: may need to unsubscribe to things?
      result.templateArray[index].clones.forEach(clone => removeChild(clone.parentNode, clone))
      result.templateArray.splice(index, 1)
    }
  })

  value.forEach((subGem, index) => {
    if (subGem.arrayValue === undefined) {
      // appears arrayValue is not there but maybe arrayValue is actually the value of undefined
      if (!Object.keys(subGem).includes('arrayValue')) {
        console.log('bad value', value, subGem)
        const err = new Error('Use renderFor() instead of render() to template an Array. Example: array.map(item => renderFor(item, $ => $``))')
        throw err
      }
    }

    const previous = result.lastArray[index]
    if (previous) {
      if (previous.gem.arrayValue === subGem.arrayValue) {
        previous.gem.updateValues(subGem.values)
      } else {
        console.warn('possible array issue here')
      }
      // TODO: will need to unsubscribe
    } else {
      subGem.ownerGem = result.gemOwner
      const newClones = processGemResult(subGem, result, template, index)
      result.templateArray[index] = {
        clones: newClones
      }
    }
  })

  while (result.lastArray.length > value.length) {
    result.lastArray.pop()
    const template = result.templateArray.pop() 
    template.clones.forEach(clone => {
      removeChild(clone.parentNode, clone)
      // TODO: will need to unsubscribe
    })
  }

  return
}

// Function to update the value of x
export function updateBetweenTemplates(
  value,
  template
) {
  const parent = template.lastFirstChild.parentNode
  
  // mimic React skipping to display
  if(value === undefined || value === false || value === true || value === null) {
    value = ''
  }

  // Insert the new value (never use innerHTML here)
  const textNode = document.createTextNode(value)
  parent.insertBefore(textNode, template.lastFirstChild)

  /* remove existing nodes */
  template.clones.forEach(clone => parent.removeChild(clone))
  template.clones.length = 0
  
  if(template.clones) {
    template.clones.push(textNode)
  }

  return template.clones
}

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
      existing.gem.update(gem.values)
      return existing.gem.clones // seen already
    }

    // result.lastArray[index]
    const build = buildItemGemMap(gem, templateString, insertBefore.lastFirstChild)
    gem.clones = build.clones
    result.lastArray.push({
      build, gem, index
    })
    result.templateArray.push({
      clones: gem.clones
    })
    
    return build.clones
  }

  // *if
  if(result.gem) {
    if(result.gem.isLikeGem(gem)) {
      result.gem.update(gem.values)
      result.gem // we were a gem and still am the same gem
      return result.gem.clones
    }
  }

  // add first time
  const build = buildItemGemMap(gem, templateString, insertBefore.lastFirstChild)
  result.gem = gem
  result.gem.clones = build.clones
  gem.processed = true
  return build.clones
}
