import { interpolateElement } from "./interpolateElement.js"

export function renderAppToElement(app, element, props) {
  // Create the app which returns [props, runOneTimeFunction]
  const wrapper = app(props)

  // have a function setup and call the gemWrapper with (props, {update, async, on})
  const result = applyGemUpdater(wrapper)
  const {gem, gemSupport} = result
  
  let lastGem
  gemSupport.mutatingRender = () => {
    gem.gemSupport.updateToNewest()
    const fromGem = lastGem = wrapper(gem.gemSupport)
    fromGem.setSupport(gem.gemSupport)
    gem.updateByGem(fromGem, true)

    if(lastGem) {
      lastGem.destroy(0)
    }

    return lastGem
  }
  
  // gemSupport.init = () => undefined
  const context = gem.updateValues(gem.values)
  const template = gem.getTemplate()
  
  element.innerHTML = template.string
  interpolateElement(element, context, gem)

}

export function applyGemUpdater(
  wrapper, //: ({render, async, watch}) => ({strings, values})
){
  const gemSupport = getGemSupport(wrapper)

  // Call the apps function for our gem templater
  const gem = wrapper(gemSupport)

  gem.gemSupport = gemSupport
  
  return { gem, gemSupport }
}

export function getGemSupport(
  templater
) {
  const stateSets = [] // my own
  const gemSupport = {
    templater,
    renderCount: 0,
    mutatingRender: () => {throw new Error('Gem function "render()" was called in sync but can only be called async')}, // loaded later and only callable async
    render: (...args) => {
      ++gemSupport.renderCount
      return gemSupport.mutatingRender(...args)
    }, // ensure this function still works even during deconstructing
    init: (runOnce) => {
      runOnce()
      gemSupport.init = () => undefined
    },
    async: callback => (...args) => {
      const result = callback(...args)
      gemSupport.render()

      // the callback function returned another promise
      if(result instanceof Promise) {
        result.then(() => {
          gemSupport.render()
        })
      }
    },
    updateOldest: () => updateOldest(gemSupport),
    updateToNewest: () => updateToNewest(gemSupport),
    stateSets,
    state: getGemState(stateSets),
  }

  return gemSupport
}

function updateOldest(gemSupport) {
  const myStateCallback = gemSupport.stateSets[0]

  if(!myStateCallback) {
    console.log('i am the oldest', gemSupport.templater)
    return // nothing to update, I maybe the main one
  }

  console.log('going for oldest....', gemSupport.templater)
  
  const myStateSets = myStateCallback()
  const oldestState = gemSupport.state.oldestCallback()
  myStateSets.forEach((get, index) => {
    if (index % 2 === 1) {
      return // skip odds
    }

    const setter = oldestState[index + 1]
    setter(get)
  })
}

function updateToNewest(gemSupport) {
  const myStateCallback = gemSupport.stateSets[0]

  if(!myStateCallback) {
    return // nothing to update, I maybe the main one
  }
  
  const myStateSets = myStateCallback()
  const newestState = gemSupport.state.oldestCallback()
  myStateSets.forEach((get, index) => {
    if (index % 2 === 1) {
      return // skip odds
    }

    const setter = newestState[index + 1]
    setter(get)
  })
}

export function getGemState(
  stateSets
) {
  const stateMethod = stateCallback => {
    stateSets[0] = stateCallback // remember yourself

    if(!stateMethod.callback) {
      stateMethod.callback = stateCallback
      stateMethod.oldestCallback = stateCallback
      return stateCallback
    }

    const oldStateSet = stateMethod.oldestCallback()
    const newStateSets = stateCallback()

    // Number of states must match
    if(newStateSets.length !== oldStateSet.length) {
      throw new Error(`states mismatch new(${newStateSets.length}) old(${oldStateSet.length})`)
    }

    // odd number of states throw error?
    if(newStateSets.length % 2 === 1) {
      throw new Error(`states has an odd numbered array. states(() => [get0, setter0, get1, setter1])`)
    }

    // loop new to set new values by old
    newStateSets.forEach((setter, index) => {
      if(index % 2 === 0) {
        return // skip even numbers
      }
      
      const get = oldStateSet[index - 1]
      setter(get)
    })

    stateMethod.callback = stateCallback
  }

  return stateMethod
}
