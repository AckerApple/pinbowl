import { html, gem } from "./web-gems/index.js"
import { animateIn, animateOut } from "./animations.js"

export let footerButtons = ({
  currentFrame,
  gameStarted,
  playersLength,
  
  removeAllPlayers,
  addPlayer,
  startGame,
  restartGame,
  endGame
}) => () => {
  // footerButtons.js
  return html`
    <!--footerButtons.js-->
    <div style="padding-top:1em;">
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

footerButtons = gem(footerButtons)