import { gemDebug } from "./gemDebug.js"
import { gameDebug } from "./gameDebug.js"
import { animateIn, animateOut } from "./animations.js"
import { html, gem } from "./web-gems/index.js"

export let debugApp = (game) => ({state}) => {
  // debugApp.js
  let renderCounter = 0
  let debugGems = false

  state(() => [
    renderCounter, x => renderCounter = x,
    debugGems, x => debugGems = x,
  ])

  ++renderCounter

  return html`
    <!--debugApp.js-->
    <div class:insert=${animateIn} class:remove=${animateOut}>
      <h2>🐞</h2>
      ${gameDebug(game)}

      outer debug counter:${renderCounter}

      <button type="button"
        onclick=${() => debugGems = !debugGems}
      >debug gems</button> 

      ${debugGems && gemDebug()}
    </div>
  `
}
debugApp = gem(debugApp)
