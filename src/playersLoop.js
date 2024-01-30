import { playerFrames } from "./playerFrames.js"
import { animateDestroy, animateInit } from "./animations.js"
import { providers, tag, html } from "./taggedjs/index.js"
import { Game, getPlayerScore, frameScoreDetails } from "./game.js"

export const playersLoop = tag(
(
  /** @type {{frameScoreModalDetails: frameScoreDetails}} */
  {
    frameScoreModalDetails
  }
) => {
  const game = providers.inject( Game )

  // playersLoop.js
  function isPlayerIndexWinning(targetPlayerIndex) {
    const leader = game.players.reduce((leader,player,playerIndex) => {
      const stats = {score:getPlayerScore(player), playerIndex}
      if(stats.score > leader.score && (game.playerTurn > 0 || game.currentFrame > 0)) {
        return stats
      }

      const isMyTie = stats.score === leader.score && targetPlayerIndex === stats.playerIndex
      if(isMyTie && leader.score > 0) {
        return stats
      }
      return leader
    }, {playerIndex:-1, score:0})
    

    return leader.playerIndex === targetPlayerIndex
  }

  const playersContent = game.players.map((player, playerIndex) => html`
    <div name=${`test-player_${playerIndex}`} id=${`player_${playerIndex}`}
      oninit=${animateInit} ondestroy=${animateDestroy}
      style=${"margin:.25em;display:flex;" +
        (game.gameStarted && game.playerTurn === playerIndex ? 'width:100%;' : 'flex:1 1 10em;')
      }
    >
      <div
        style=${
          "margin:.5em;border-radius:.5em;text-align: left;flex:1;" +
          (game.gameStarted && game.playerTurn === playerIndex ? 'border:.2em solid yellow;font-size:1.2em;line-height:1.1em;' : 'border:1px solid white;')
        }
        style.background-color=${player.gameover ? 'rgb(89 76 231 / 44%)' : game.gameStarted && player.edit ? 'rgb(290 76 131 / 44%)' : 'black'}
      >
        <div style="display: flex;flex-direction: column;">
          <!-- player -->
          <div style="padding:.75em;">
            <div style="display: flex;">
              <!-- player info -->
              <div style="flex-grow:1">
                <div style="display: flex;align-items: center;gap:.25em">
                  <div style="padding-right:.5em;"
                    onclick=${() => player.edit = !player.edit}
                  >
                    <strong>👤</strong>
                  </div>

                  <a onclick=${() => player.edit = !player.edit}>
                    ${!player.edit && player.name}
                  </a>

                  ${player.edit && html`
                    <input id=${`player_${playerIndex}_input`}
                      oninit=${({target}) => target.select()}
                      onclick=${({target}) => !game.gameStarted && target.select()}
                      onblur=${() => game.gameStarted || (player.edit = false)}
                      onkeyup=${({target}) => player.name=target.value}
                      value=${player.name}
                    />
                  `}

                  ${ game.players.length > 1 && game.gameStarted && game.playerTurn === playerIndex && html`
                    <span style="position:relative;">
                      <span style="position:absolute;" class="animate__slow animate__animated animate__wobble animate__infinite">&nbsp;&nbsp;👈</span>
                      &nbsp;&nbsp;&nbsp;
                    </span>
                  ` }
                </div>
              </div>
              <div>
                ${ game.players.length > 1 && isPlayerIndexWinning(playerIndex) && '🐺' }  
                ${ player.won && '🏆' }

                <a style=${player.edit ? 'background-color:orange;' : ''}
                  onclick=${() => player.edit = !player.edit}
                >✏️</a>

                ${(!game.gameStarted || (game.gameStarted && player.edit)) && html`
                  <a id=${`player_${playerIndex}_remove`} 
                    onclick=${() => {
                      if(game.gameStarted && !confirm(`Confirm remove player ${playerIndex + 1} ${player.name}`)) return
                      game.players.splice(playerIndex,1)
                    }}
                  >🗑️</a>
                `}
              </div>
            </div>
          </div>

          <!-- frame info-->
          ${game.gameStarted && playerFrames({            
            player,
            playerIndex,
            frameScoreModalDetails,
          })}          
        </div>
      </div>
    </div>
  `.key(player))

  // console.log('playersContent',playersContent)

  return html`
    <!-- playersLoop.js -->
    ${playersContent}
    <!-- end:playersLoop.js -->
  `
})
