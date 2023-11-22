import { html } from "./web-gems/render.js"
import { animateIn, animateOut } from "./animations.js"

export const footerButtons = ({
  currentFrame, addPlayer, gameStarted, players, startGame, restartGame, endGame
}) => ({ render, async, init, state }) => {
  // footerButtons.js
  /*
  let counter = 0

  state(() => [counter, x => counter = x])

  init(() => {
    console.log('👉 i should only ever run once')

    setInterval(async(() => {
      ++counter
      console.log('counter fired', counter)
    }), 3000)
  })
  */

  return html`
    <!--footerButtons.js-->
    <div style="padding-top:1em;">
      <hr />
      ${currentFrame === 0 && html`
        <button type="button" id="player_add_button"
          class:insert=${animateIn} class:remove=${animateOut}
          onclick=${addPlayer}
        >👤 Add Player</button>
      `}

      ${!gameStarted && currentFrame === 0 && players.length > 1 && html`
        <button type="button" id="player_add_button"
          class:insert=${animateIn} class:remove=${animateOut}
          onclick=${() => players.length = 0}
        >❌ 👤 Remove All Players</button>
      `}

      ${!gameStarted && players.length > 0 && html`
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