import { html } from "./web-gems/render.js"
import { animateIn, animateOut } from "./animations.js"
import { component } from "./component.js"

export let footerButtons = ({
  currentFrame,
  gameStarted,
  playersLength,
  
  removeAllPlayers,
  addPlayer,
  startGame,
  restartGame,
  endGame
}) => ({ render, async, init, state }) => {
  // footerButtons.js
  let counter = 0

  state(() => [counter, x => counter = x])

  /*
  init(() => {
    console.log('👉 i should only ever run once')

    setInterval(async(() => {
      ++counter
      console.log('counter fired', counter)
    }), 3000)
  })
  */

  console.log('counter', counter)

  return html`
    <!--footerButtons.js-->
    <div style="padding-top:1em;">
      <button onclick=${() => {console.log('current counter',counter);++counter}}>counter:${counter}</button>
      <hr />
      ${currentFrame === 0 && html`
        <button type="button" id="player_add_button"
          class:insert=${animateIn} class:remove=${animateOut}
          onclick=${addPlayer}
        >👤 Add ${playersLength + 1}${(x => (x === '1' && 'st') || (x === '2' && 'nd')  || (x === '3' && 'rd') || 'th')((playersLength+1).toString().slice(-1))} Player</button>
      `}

      ${!gameStarted && currentFrame === 0 && playersLength > 1 && html`
        <button type="button" id="player_add_button"
          class:insert=${animateIn} class:remove=${animateOut}
          onclick=${removeAllPlayers}
        >❌ 👤 Remove All Players</button>
      `}

      ${!gameStarted && playersLength > 0 && html`
      <button type="button" id="start_game_button"
        class:insert=${animateIn} class:remove=${animateOut}
        onclick=${startGame}
      >🟢 start game</button>
      `}

      ${gameStarted && html`
        <button type="button"
          class:insert=${animateIn} class:remove=${animateOut}
          onclick=${restartGame}
        >🔄 restart game</button>
      `}

      ${gameStarted && html`
        <button type="button" id="end_game_button" class="animate__animated"
          class:insert=${animateIn} class:remove=${animateOut}
        onclick=${endGame}
        >🔄 end game</button>
      `}
      <hr />
    </div>
  `
}

footerButtons = component(footerButtons)