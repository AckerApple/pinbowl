import { gem, html } from "./web-gems/index.js"
import { getPlayerScore } from "./playersLoop.js"
import { animateDestroy, animateInit } from "./animations.js"
import { showFrameScoreModal } from "./game.js"

export let playerFrames = ({
  player, currentFrame, playerTurn, playerIndex, frameScoreModalDetails
}) => () => {
  return html`<!--playerFrames.js-->
    <div style="display: flex;flex-wrap:wrap"
      oninit=${animateInit} ondestroy=${animateDestroy}
    >
      ${player.frames.map((frame, frameIndex) => html`
        <a id=${`player_${playerIndex}_frame_${frameIndex}`}
          oninit=${animateInit} ondestroy=${animateDestroy}
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
      `.key(frame))}
    </div>

    <div style="padding:.75em;display:flex;gap:1em;flex-wrap:wrap;justify-content: center;">
      <!--score-->
      ${score({player})}
    </div>
  `
}
playerFrames = gem(playerFrames)

export let score = ({player}) => () => html`
  <div style="text-align: center;">
    ${!player.gameover && html`<strong>SCORE:</strong>`}
    ${player.gameover && html`<strong>FINAL SCORE:</strong>`}
    ${getPlayerScore(player)}
  </div>
`
score = gem(score)

export let frameScore = ({player, playerTurn, playerIndex, frameIndex, currentFrame}) => () => html`
  <!-- playerFrames.frameScore.js -->
  <div
    style=${
      'display:flex;flex-grow:1;justify-content: center;align-items: center;text-align:center;' +
      (playerTurn === playerIndex ? 'min-width:15vw;min-height:15vw;' : '') + 
      (playerTurn === playerIndex && currentFrame === frameIndex ? 'background:rgba(255,234,142,.8);' : '')
    }
  >
    <!-- tap to score -->
    ${playerTurn === playerIndex && currentFrame === frameIndex && player.scores[frameIndex] == undefined && html`
      <div style="opacity:.5;font-size:.8em;line-height:1em;">
        tap<br />to<br />score
      </div>
    `}

    ${player.scores[frameIndex] !== undefined && html`
      <div oninit=${animateInit} ondestroy=${animateDestroy}>
        ${player.scores[frameIndex] === 3 && (playerIndex!=playerTurn || frameIndex!=currentFrame) && '💎'}
        ${player.scores[frameIndex] == undefined ? '' : player.scores[frameIndex]}
      </div>
    `}
  </div>
`
frameScore = gem(frameScore)