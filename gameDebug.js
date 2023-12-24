import { html, tag } from "./taggedjs/index.js"
import runTest from "./app.test.js"

export const gameDebug = tag(({
  gameStarted, players, playerTurn
}) => {
  /* gameDebug.js */
  return html`
    <div>gameStarted: ${gameStarted ? 'true' : 'false'}</div>
    <div>players: ${players.length}</div>
    <div>playerTurn: ${playerTurn}</div>
    <button disabled=${runTest.testing} onclick=${runTest}>run test</button>
  `
})
