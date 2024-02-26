import { tagDebug } from "./tagJsDebug.js"
import { gameDebug } from "./gameDebug.js"
import { html, tag, setLet } from "./taggedjs/index.js"
import { animateDestroy, animateInit } from "./animations.js"

export const debugApp = tag((game) => {  
  let debugTags = setLet(false)(x => [debugTags, debugTags = x])

  return html`
    <!--debugApp.js-->
    <div oninit=${animateInit} ondestroy=${animateDestroy}>
      <h2>🐞</h2>

      <fieldset>
        <legend>Game Debugging</legend>
        ${gameDebug(game)}
      </fieldset>

      <fieldset>
        <legend>Tag Debug</legend>        
        <button type="button"
          onclick=${() => debugTags = !debugTags}
        >debug tags</button> 
  
        ${debugTags && tagDebug()}
      </fieldset>
    </div>
  `
})
