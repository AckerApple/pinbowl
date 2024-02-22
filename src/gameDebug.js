import { html, state, tag } from "./taggedjs/index.js"
import runTest from "./app.test.js"

export const gameDebug = tag(game => {
  let showDump = state(false)(x => [showDump, showDump=x])
  // let showDump = state0(false, x => [showDump, showDump=x])

  function testAlert() {
    game.alert('this is a test')
  }

  /* gameDebug.js */
  return html`
    ${smallGameDump(game)}
    <button disabled=${runTest.testing} onclick=${runTest}>run test</button>
    <button disabled=${runTest.testing} onclick=${testAlert}>test alert</button>
    <button onclick=${() => showDump = !showDump}>show json dump</button>
    ${showDump && html`
      <textarea style="width:100%" rows="12" wrap="off">${JSON.stringify(game, null, 2)}</textarea>
    `}
  `
})

export const smallGameDump = (game) =>
html`
  <div style="display:flex;flex-wrap:wrap;gap:2em;justify-content: center;">
    ${['currentFrame','playerTurn'].map(name => html`
      <div>
        ${name}: ${game[name]}
      </div>
    `.key(name))}
    <div>gameStarted: ${game.gameStarted ? 'true' : 'false'}</div>
    <div>players: ${game.players.length}</div>
  </div>
`
