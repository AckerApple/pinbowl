import { html } from "./web-gems/render.js"
import { showFrameScoreModal } from "./app.js"
import { getPlayerScore } from "./playersLoop.js"
import { animateIn, animateOut } from "./animations.js"

export const playerFrames = ({
  player, currentFrame, playerTurn, playerIndex, frameScoreModalDetails
}) => () => {
  return html`<!--playerGems.js-->
    <div style="display: flex;flex-wrap:wrap"
      class:insert=${animateIn} class:remove=${animateOut}
    >
      ${player.frames.map((frame, frameIndex) => html.for(frame)`
        <a id=${`player_${playerIndex}_frame_${frameIndex}`}
          class:insert=${animateIn} class:remove=${animateOut}
          style=${
            'display:flex;flex-direction:column;flex-grow:1;border:1px solid white;' +
            (currentFrame === frameIndex ? 'font-weight:bold;' : '') +
            (playerTurn === playerIndex && currentFrame === frameIndex ? '' : 'cursor:default;')
          }
          onclick=${() => showFrameScoreModal(player, playerIndex, frameIndex, frameScoreModalDetails)}
        >
          <div style="display:flex;padding:0 .2em;">
            <span style="flex-grow:1;font-size:0.7em;opacity:.7">${frameIndex+1}</span>
            <span>${frameIndex === currentFrame ? html`<span>🔵</span>` : ''}</span>
          </div>
          <hr style="margin: 0;" />
          ${frameScore({frameIndex, player, currentFrame, playerTurn, playerIndex, frameScoreModalDetails})}
        </a>
      `)}
    </div>

    <div style="padding:.75em;display:flex;gap:1em;flex-wrap:wrap;justify-content: center;">
      <!--score-->
      ${score({player})}
    </div>
  `
}

export const score = ({player}) => () => html`
  <div style="text-align: center;">
    ${!player.gameover && html`<strong>SCORE:</strong>`}
    ${player.gameover && html`<strong>FINAL SCORE:</strong>`}
    ${getPlayerScore(player)}
  </div>
`

export const frameScore = ({player, playerTurn, playerIndex, frameIndex, currentFrame}) => () => html`
  <div
    style=${
      'display:flex;flex-grow:1;justify-content: center;align-items: center;text-align:center;' +
      (playerTurn === playerIndex ? 'min-width:15vw;min-height:15vw;' : '') + 
      (playerTurn === playerIndex && currentFrame === frameIndex ? 'background:rgba(255,234,142,.8);' : '')
    }
  >
    ${playerTurn === playerIndex && currentFrame === frameIndex && player.scores[frameIndex] == undefined && html`
      <div style="opacity:.5;font-size:.8em;line-height:1em;">
        tap<br />to<br />score
      </div>
    `}

    ${player.scores[frameIndex] !== undefined && html`
      <div class:insert=${animateIn} class:remove=${animateOut}>
        ${player.scores[frameIndex] === 3 && (playerIndex!=playerTurn || frameIndex!=currentFrame) && '💎'}
        ${player.scores[frameIndex] == undefined ? '' : player.scores[frameIndex]}
      </div>
    `}
  </div>
`