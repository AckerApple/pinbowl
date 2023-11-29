import { globalSubCount, globalSubs } from "./web-gems/Subject.js"
import { html, gem } from "./web-gems/index.js"

export let gemDebug = () => ({state, init}) => {
  // gemDebug.js
  let renderCounter = 0
  let counter = 0
  let initCounter = 0

  state(() => [
    renderCounter, x => renderCounter = x,
    counter, x => counter = x,
    initCounter, x => initCounter = x,
  ])

  
  init(() => {
    ++initCounter
    console.log('👉 i should only ever run once')
    
    /*
    setInterval(async(() => {
      ++counter
      console.log('counter fired', counter)
    }), 3000)
    */
  })

  const increaseCounter = () => {
    console.log('increaseCounter', counter)
    ++counter
  }

  console.log('--- renderCounter ---')
  ++renderCounter // for debugging

  return html`
    <!-- gemDebug.js -->
    <div style="padding:1em;background:rgba(0,0,0,.5)">
      <h4>Gem Debug</h4>
      <div>Subscriptions:${globalSubCount}:${globalSubs.length}</div>
      <div>renderCounter:${renderCounter}</div>
      <div>initCounter:${initCounter}</div>
            
      <button onclick=${increaseCounter}>counter:${counter}</button>
      <button onclick=${() => console.log('subs', globalSubs)}>log subs</button>
      
      <br />
      
      <div>
        <div style="font-size:0.8em">You should see "0" here => "${0}"</div>
        <!--proof you cannot see false values -->
        <div style="font-size:0.8em">You should see "" here => "${false}"</div>
        <div style="font-size:0.8em">You should see "" here => "${null}"</div>
        <div style="font-size:0.8em">You should see "" here => "${undefined}"</div>
        <!--proof you can see true booleans -->
        <div style="font-size:0.8em">You should see "true" here => "${true}"</div>
        <!--proof you can try to use the gemVar syntax -->
        <div style="font-size:0.8em">You should see "${'{'}22${'}'}" here => "{22}"</div>
        <div style="font-size:0.8em">You should see "${'{'}__gemvar0${'}'}" here => "{__gemVar0}"</div>
      </div>
    </div>
  `
}
gemDebug = gem(gemDebug)
