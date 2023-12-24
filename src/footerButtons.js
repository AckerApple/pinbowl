import { providers, html, tag } from "./taggedjs/index.js"
import { animateDestroy, animateInit } from "./animations.js"
import { Game } from "./game.js"

export const footerButtons = tag(({
  restartGame,
  endGame
}) => {
  // footerButtons.js
  const game = providers.inject(Game)

  return html`
    <!--footerButtons.js-->
    <div style="padding-top:1em;">
      <hr />
      <!-- add player -->
      ${game.currentFrame === 0 && html`
        <button type="button" id="player_add_button"
          oninit=${animateInit} ondestroy=${animateDestroy}
          onclick=${() => game.addPlayer()}
        >👤 Add ${game.players.length + 1}${(x => (x === '1' && 'st') || (x === '2' && 'nd')  || (x === '3' && 'rd') || 'th')((game.players.length+1).toString().slice(-1))} Player</button>
      `}

      ${!game.gameStarted && game.currentFrame === 0 && game.players.length > 1 && html`
        <button type="button" id="player_add_button"
          oninit=${animateInit} ondestroy=${animateDestroy}
          onclick=${() => game.removeAllPlayers()}
        >❌ 👤 Remove All Players</button>
      `}

      ${!game.gameStarted && game.players.length > 0 && html`
      <button type="button" id="start_game_button"
        oninit=${animateInit} ondestroy=${animateDestroy}
        onclick=${() => game.start()}
      >🟢 start game</button>
      `}

      ${game.gameStarted && html`
        <button type="button"
          oninit=${animateInit} ondestroy=${animateDestroy}
          onclick=${restartGame}
        >🔄 restart game</button>
      `}

      ${game.gameStarted && html`
        <button type="button" id="end_game_button" class="animate__animated"
          oninit=${animateInit} ondestroy=${animateDestroy}
        onclick=${endGame}
        >🔄 end game</button>
      `}
      <hr />
    </div>
  `
})
