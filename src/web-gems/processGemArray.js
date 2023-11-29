import { processGemResult } from "./interpolateTemplate.js"

export function processGemArray(
  result, // gem
  value, // arry of Gem classes
  template, // <template end interpolate />
  ownerGem,
  counts, // {added:0, removed:0}
) {
  result.lastArray = result.lastArray || [] // {gem, index}[] populated in processGemResult

  let removed = 0
  /** 🗑️ remove previous items first */
  result.lastArray = result.lastArray.filter((item, index) => {
    const lessLength = value.length-1 < index - removed
    const subGem = value[index - removed]
    const subArrayValue = subGem?.arrayValue
    if(lessLength || subArrayValue !== item.gem.arrayValue) {
      const last = result.lastArray[index]
      const gem = last.gem
      gem.destroy(counts.removed)
      ++removed
      ++counts.removed
      return false
    }
    return true
  })

  value.forEach((subGem, index) => {
    subGem.gemSupport = ownerGem.gemSupport
    subGem.ownerGem = ownerGem
    ownerGem.children.push(subGem)

    if (subGem.arrayValue === undefined) {
      // appears arrayValue is not there but maybe arrayValue is actually the value of undefined
      if (!Object.keys(subGem).includes('arrayValue')) {
        const err = new Error('Use key(item).html`...` instead of html`...` to template an Array')
        err.code = 'replace-with-key'
        throw err
      }
    }

    const previous = result.lastArray[index]
    if (previous) {
      if (previous.gem.arrayValue === subGem.arrayValue) {
        previous.gem.updateValues(subGem.values)
      }
      return
    }

    const before = template || template.clone
    processGemResult(
      subGem,
      result,
      before,
      index,
      counts,
    )
  })

  return
}
