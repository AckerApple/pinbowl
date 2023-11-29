import { playerFrames } from "./playerFrames.js"
import { animateIn, animateOut } from "./animations.js"
import { gem, key, html } from "./web-gems/index.js"

export function getPlayerScore (player) {
  return player.scores.reduce((all,score) => {
    return all + score
  },0)
}

export let playersLoop = ({
  players, gameStarted, currentFrame, playerTurn, frameScoreModalDetails
}) => () => {
  // playersLoop.js
  function isPlayerIndexWinning(targetPlayerIndex) {
    const leader = players.reduce((leader,player,playerIndex) => {
      const stats = {score:getPlayerScore(player), playerIndex}
      if(stats.score > leader.score && (playerTurn > 0 || currentFrame > 0)) {
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

  return html`
    <!--playersLoop.js -->
    ${players.map((player, playerIndex) => key(player).html`
      <div id=${`player_${playerIndex}`}
        class:insert=${animateIn} class:remove=${animateOut}
        style=${
          "border-radius:.5em;text-align: left;flex-grow:1;" +
          (gameStarted && playerTurn === playerIndex ? 'width:100%;border:.2em solid yellow;font-size:1.2em;line-height:1.1em;' : 'border:1px solid white;')
        }
        style.background-color=${player.gameover ? 'rgb(89 76 231 / 44%)' : gameStarted && player.edit ? 'rgb(290 76 131 / 44%)' : 'black'}
      >
        <div style="display: flex;flex-direction: column;">
          <!-- player -->
          <div style="padding:.75em;">
            <div style="display: flex;">
              <!-- player info -->
              <div style="flex-grow:1">
                <div style="display: flex;align-items: center;">
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
                      onclick=${event => !gameStarted && event.target.select()}
                      onblur=${() => player.edit = false}
                      onkeyup=${event => player.name=event.target.value}
                      value=${player.name}
                    />
                  `}
                </div>
              </div>
              <div>
                ${ players.length > 1 && isPlayerIndexWinning(playerIndex) && '🐺' }  
                ${ player.won && '🏆' }

                <a style=${player.edit ? 'background-color:orange;' : ''}
                  onclick=${() => player.edit = !player.edit}
                >✏️</a>

                ${(!gameStarted || (gameStarted && player.edit)) && html`
                  <a id=${`player_${playerIndex}_remove`} 
                    onclick=${() => {
                      if(gameStarted && !confirm(`Confirm remove player ${playerIndex + 1} ${player.name}`)) return
                      players.splice(playerIndex,1)
                    }}
                  >🗑️</a>
                `}
              </div>
            </div>
          </div>

          <!-- frame info-->
          ${gameStarted && playerFrames({player, currentFrame, playerTurn, playerIndex, frameScoreModalDetails})}          
        </div>
      </div>
    `)}
  `
}


playersLoop = gem(playersLoop)