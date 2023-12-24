import { tag, html, providers } from "./taggedjs/index.js"
import { animateDestroy, animateInit } from "./animations.js"
import { showFrameScoreModal } from "./showFrameScoreModal.js"
import { Game, getPlayerScore } from "./game.js"

export const playerFrames = tag(({
  player, playerIndex, frameScoreModalDetails
}) => {
  const game = providers.inject( Game )

  return html`<!--playerFrames.js-->
    <div style="display: flex;flex-wrap:wrap"
      oninit=${animateInit} ondestroy=${animateDestroy}
    >
      ${player.frames.map((frame, frameIndex) => html`
        <a id=${`player_${playerIndex}_frame_${frameIndex}`}
          oninit=${animateInit} ondestroy=${animateDestroy}
          style=${
            'display:flex;flex-direction:column;flex-grow:1;border:1px solid white;' +
            (game.currentFrame === frameIndex ? 'font-weight:bold;' : '') +
            (game.playerTurn === playerIndex && game.currentFrame === frameIndex ? '' : 'cursor:default;')
          }
          onclick=${() => {
            if(!(game.playerTurn === playerIndex && game.currentFrame === frameIndex)) {
              console.warn('skip score edit click')
              if(!player.edit) {
                return // not allowed to edit
              }
            }

            showFrameScoreModal(player, playerIndex, frameIndex, frameScoreModalDetails)
          }}
        >
          <div style="display:flex;padding:0 .2em;">
            <span style="flex-grow:1;font-size:0.7em;opacity:.7">${frameIndex+1}</span>
            <span>${frameIndex === game.currentFrame ? html`<span>🔵</span>` : ''}</span>
          </div>
          <hr style="margin: 0;" />
          ${frameScore({
            frameIndex,
            player,
            playerIndex,
            frameScoreModalDetails
          })}
        </a>
      `.key(frame))}
    </div>

    <div style="padding:.75em;display:flex;gap:1em;flex-wrap:wrap;justify-content: center;">
      <!--score-->
      ${score({player})}
    </div>
  `
})

export const score = tag(({player}) => html`
  <div style="text-align: center;">
    ${!player.gameover && html`<strong>SCORE:</strong>`}
    ${player.gameover && html`<strong>FINAL SCORE:</strong>`}
    ${getPlayerScore(player)}
  </div>
`)

export const frameScore = tag(({
  player,
  playerIndex,
  frameIndex,
}) => {
  const game = providers.inject( Game )

  return html`
  <!-- playerFrames.frameScore.js -->
  <div
    style=${
      'display:flex;flex-grow:1;justify-content: center;align-items: center;text-align:center;' +
      (game.playerTurn === playerIndex ? 'min-width:15vw;min-height:15vw;' : '') + 
      (game.playerTurn === playerIndex && game.currentFrame === frameIndex ? 'background:rgba(255,234,142,.8);' : '')
    }
  >
    <!-- tap to score -->
    ${game.playerTurn === playerIndex && game.currentFrame === frameIndex && player.scores[frameIndex] == undefined && html`
      <div style="opacity:.5;font-size:.8em;line-height:1em;"
        class="animate__animated animate__jello animate__infinite animate__slower"
      >
        tap<br />to<br />score
      </div>
    `}

    ${player.scores[frameIndex] !== undefined && html`
      <div oninit=${animateInit} ondestroy=${animateDestroy}>
        ${player.scores[frameIndex] === 3 && (playerIndex!=game.playerTurn || frameIndex!=game.currentFrame) && '💎'}
        ${player.scores[frameIndex] == undefined ? '' : player.scores[frameIndex]}
      </div>
    `}
  </div>
`})
