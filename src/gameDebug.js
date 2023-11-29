import { html, gem } from "./web-gems/index.js"
import runTest from "./app.test.js"

export let gameDebug = ({
  gameStarted, players, playerTurn
}) => () => html`
  <div>gameStarted: ${gameStarted ? 'true' : 'false'}</div>
  <div>players: ${players.length}</div>
  <div>playerTurn: ${playerTurn}</div>
  <h3>Extras</h3>
  <button onclick=${runTest}>run test</button>
`
gameDebug = gem(gameDebug)
