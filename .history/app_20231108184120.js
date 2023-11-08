import { render, renderFor } from "./render.js"
import { interpolateElement } from "./web-gems/interpolateElement.js"

export function SmallBowlApp() {
  const players = []
  
  let playerTurn = 0
  let currentFrame = 0
  let gameStarted = false

  const addPlayer = () => players.push({
    name: `Player ${players.length + 1}`,
    frames: [0,1,2,3,4],
    scores: [],
    edit: true,
    gameover: false,
  })

  const startGame = () => gameStarted=true
  const restartGame = () => {
    if(!confirm('Are you sure you want to restart game?')){
      return
    }
    currentFrame = 0
    playerTurn = 0
    gameStarted = false

    players.forEach(player => {
      player.frames.length = 5
      player.scores = []
      player.gameover = false
    })
  }

  const increasePlayerTurn = () => {
    ++playerTurn
                        
    if(playerTurn >= players.length){
      ++currentFrame
      playerTurn=0
    }
  }

  const submitPlayerScore = (player) => {
    // maybe player game over
    if(player.scores.length === player.frames.length) {
      // its not a 3, game over
      if(player.scores[player.scores.length - 1] !== 3) {
        player.gameover = true
      }

      // its a 3, make a new frame
      if(player.scores[player.frames.length-1] === 3){
        player.frames.push(player.frames.length)
        alert('💥 Strike on the last frame! Another frame added.\n\nFor now, it\'s the next players turn.')
      }  
    }

    if(players.every(player => player.gameover)) {
      runGameOver()
      return
    }

    increasePlayerTurn()

    setTimeout(() => {
      const elm = document.getElementById('player_' + playerTurn)
      elm.scrollIntoView({
        behavior: 'smooth'
      })
    }, 300)
  }

  const runGameOver = () => {
    const leadersMeta = players.reduce((all,player, playerIndex) => {
      const score = getPlayerScore(player)
	    if(score > all[0]) {
        all[0] = score
        all[1] = [{player, playerIndex}]
        return all
      }

      // tie
      if(score === all[0]) {
        all[1].push({player, playerIndex})
        return all
      }

      return all
    }, [-1,[]])

    const leaders = leadersMeta[1]

    if(leaders.length > 1) {
      alert('🤗 Multiple winners, get ready for a additional round!')
      console.log('leaders', leaders)
      leaders.forEach(({player}) => {
        player.frames.push(player.frames.length)
        player.gameover = false
        console.log('player',player)
      })
      playerTurn = leaders[0].playerIndex
      ++currentFrame
      return
    }

    alert(`🎉 Winner is Player ${leaders[0].playerIndex + 1}, ${leaders[0].player.name}`)
    playerTurn = -1
    currentFrame = -1
  }

  const getPlayerScore = (player) => {
    return player.scores.reduce((all,score) => {
      return all + score
    },0)
  }

  const isPlayerIndexWinning = (targetPlayerIndex) => {
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

  const scorePlayerFrame = (currentFrame, player, frameIndex) => {
    if(!player.edit) {
      if(playerTurn !== playerIndex) {
        return // wrong player scoring
      }
    
      if(frameIndex !== currentFrame) {
        return // ignore
      }
    }
  
    updatePlayerFrame(player, frameIndex)
  }

  const updatePlayerFrame = (player, frameIndex) => {
    const hasScore = player.scores[frameIndex] == undefined
    let value = hasScore ? 1 : player.scores[frameIndex]
    
    if ( value > 2 ) {
      value = -1
    }
  
    player.scores[frameIndex] = value + 1  
  }

  // test data
  /*(() => {
    addPlayer()
    addPlayer()
    startGame()
    currentFrame = 2
    players[0].scores = [2,2,0,0]
    players[1].scores = [2,2,0,0]
  })()*/
  
  return render($ => $`
    <div>
      <h2>🎳 ${players.length} Player Pinbowl game</h2>
      <div style="display: flex;flex-wrap: wrap;gap:.5em">
        <!-- 👤 players loop -->
        ${players.map((player, playerIndex) => renderFor(player, $ => $`
          <div id=${`player_${playerIndex}`}
            style=${
              "border-radius:.5em;padding:.75em;text-align: left;flex-grow:1;" +
              (player.gameover ?
                'background-color:rgb(89 76 231 / 44%);' :
                player.edit ? 'background-color:rgb(290 76 131 / 44%);' :
                (gameStarted && playerTurn === playerIndex ? 'width:100%;border:.2em solid yellow;font-size:1.2em;line-height:1.1em;' : 'border:1px solid white;'))
            }
          >
            <div style="display: flex;flex-direction: column;">
              <!-- player info-->
              <div>
                <div style="display: flex;">
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

                      ${player.edit && render($ => $`
                        <input ()="this.select()"
                          onblur=${() => player.edit = false}
                          onkeyup=${event => player.name=event.target.value}
                          value=${player.name}
                        />
                      `)}
                    </div>
                  </div>
                  <div>
                    ${ players.length > 1 && isPlayerIndexWinning(playerIndex) ? '⭐️' : '' }
                    <a style=${player.edit ? 'background-color:orange;' : ''} onclick=${() => player.edit = !player.edit}>✏️</a>
                  </div>
              </div>

              <!-- frame info-->
              ${gameStarted && render($ => $`
                <div style="display: flex;flex-wrap:wrap">
                  ${player.frames.map((frame, frameIndex) => renderFor(frame, $ => $`
                    <a
                      style=${
                        'display:flex;flex-direction:column;flex-grow:1;border:1px solid white;' +
                        (currentFrame === frameIndex ? 'font-weight:bold;' : '') +
                        (playerTurn === playerIndex && currentFrame === frameIndex ? '' : 'cursor:default;')
                      }
                      onclick=${() => scorePlayerFrame(currentFrame, player, frameIndex)}
                    >
                      <div style="display:flex;padding:0 .2em;">
                        <span style="flex-grow:1;font-size:0.7em;">${frameIndex+1}</span>
                        <span>${frameIndex === currentFrame ? render($ => $`<span>🔵</span>`) : ''}</span>
                      </div>
                      <hr style="margin: 0;" />
                      <div
                        style=${
                          'display:flex;flex-grow:1;justify-content: center;align-items: center;text-align:center;' +
                          (playerTurn === playerIndex ? 'min-width:15vw;min-height:15vw;' : '') + 
                          (playerTurn === playerIndex && currentFrame === frameIndex ? 'background:rgba(255,234,142,.8);' : '')
                        }
                      >
                        ${playerTurn === playerIndex && currentFrame === frameIndex && player.scores[frameIndex] == undefined && render($ => $`
                          <div style="opacity:.5;font-size:.8em;line-height:1em;">
                            tap<br />to<br />score
                          </div>
                        `)}
                        ${player.scores[frameIndex] == undefined ? '' : player.scores[frameIndex]}
                      </div>
                    </a>
                  `))}
                </div>

                <div style="display:flex;gap:1em;flex-wrap:wrap;justify-content: center;">
                  <!--score-->
                  <div style="text-align: center;">
                    ${!player.gameover && render($ => $`<strong>SCORE:</strong>`)}
                    ${player.gameover && render($ => $`<strong>FINAL SCORE:</strong>`)}
                    ${getPlayerScore(player)}
                  </div>

                  ${playerTurn === playerIndex && player.scores[currentFrame] != undefined && render($ => $`
                    <button
                      onclick=${() => submitPlayerScore(player)}
                    >👉 submit score</button>
                  `)}
                </div>
              `)}
              
              ${!gameStarted && render($ => $`
                <div style="text-align: center;padding-top:1em">
                  <button
                    onclick=${() => players.splice(playerIndex,1)}
                  >🗑️ remove player ${playerIndex+1}</button>
                </div>
              `)}
            </div>
          </div>
        `))}
      </div>

      <div style="padding-top:1em;">
        ${currentFrame === 0 && render($ => $`
          <button type="button"
            onclick=${addPlayer}
          >👤 Add Player</button>
        `)}

        ${!gameStarted && players.length > 0 && render($ => $`
            <button type="button" onclick=${startGame}>🟢 start game</button>
        `)}

        ${gameStarted && render($ => $`
            <button type="button" onclick=${restartGame}>🔄 restart game</button>
        `)}
      </div>
      <br /><br />
      ✍️ written & created by Acker Apple
      <br /><br />
    </div>
  `)
}

export default () => {
  const app = SmallBowlApp()

  const element = document.getElementsByTagName('small-bowl-app')[0]
  const {template, context} = app.getTemplate()
  element.innerHTML = template

  interpolateElement(element, context, element)
}
