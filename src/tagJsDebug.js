import { animateDestroy, animateInit } from "./animations.js"
import { state, html, tag, providers, Subject, onInit } from "./taggedjs/index.js"

function tagDebugProvider() {
  const upper = {
    test: -2,
  }
  // const upper = providers.create( upperTagDebugProvider )
  console.log('upper',upper)
  return {
    upper,
    test: 1
  }
}

function upperTagDebugProvider() {
  return {
    name: 'upperTagDebugProvider',
    test: 2
  }
}

export const tagDebug = tag(() => {
  // tagDebug.js
  let renderCount = state(0, x => [renderCount, renderCount = x])
  let counter = state(0, x => [counter, counter = x])
  let initCounter = state(0, x => [initCounter, initCounter = x])

  const provider = providers.create( tagDebugProvider )
  console.log('provider',provider)
  
  onInit(() => {
    ++initCounter
    console.info('👉 i should only ever run once')
    
    /*
    setInterval(async(() => {
      ++counter
      console.info('counter fired', counter)
    }), 3000)
    */
  })

  const increaseCounter = () => {
    console.info('increaseCounter', counter)
    ++counter
  }

  ++renderCount // for debugging
  console.info('--- renderCount ---', renderCount)

  return html`
    <!-- tagDebug.js -->
    <div style="padding:1em;background:rgba(0,0,0,.5)" oninit=${animateInit} ondestroy=${animateDestroy}>
      <div>Subscriptions:${Subject.globalSubCount}:${Subject.globalSubs.length}</div>
      <div>renderCount:${renderCount}</div>
      <div>initCounter:${initCounter}</div>
            
      <button onclick=${increaseCounter}>counter:${counter}</button>
      <button onclick=${() => console.info('subs', Subject.globalSubs)}>log subs</button>
      
      <br />
      <h4>Provider Debug: ${provider.test}:${provider.upper?.test | '?'}</h4>
      ${providerDebug()}
      
      <h4>Content Debug: ${provider.test}</h4>
      <div>
        <div style="font-size:0.8em">You should see "0" here => "${0}"</div>
        <!--proof you cannot see false values -->
        <div style="font-size:0.8em">You should see "" here => "${false}"</div>
        <div style="font-size:0.8em">You should see "" here => "${null}"</div>
        <div style="font-size:0.8em">You should see "" here => "${undefined}"</div>
        <!--proof you can see true booleans -->
        <div style="font-size:0.8em">You should see "true" here => "${true}"</div>
        <!--proof you can try to use the tagVar syntax -->
        <div style="font-size:0.8em">You should see "${'{'}22${'}'}" here => "{22}"</div>
        <div style="font-size:0.8em">You should see "${'{'}__tagVar0${'}'}" here => "{__tagVar0}"</div>
      </div>
    </div>
  `
})

const providerDebug = tag(() => {
  const provider = providers.inject( tagDebugProvider )
  const upperProvider = provider.upper // providers.inject( upperTagDebugProvider )

  let renderCount = state(0, x => [renderCount, renderCount = x])

  ++renderCount

  return html`
    <button onclick=${() => ++provider.test}
    >increase provider.test ${provider.test}</button>
    
    <button onclick=${() => console.info('render count', renderCount)}>render counter: ${renderCount}</button>
    
    <button onclick=${() => ++upperProvider.test}
    >increase upper.provider.test ${upperProvider.test}</button>
  `
})