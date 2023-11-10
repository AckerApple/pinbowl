import { $ } from "./web-gems/render.js"
import { interpolateElement } from "./web-gems/interpolateElement.js"

export function SmallBowlApp() {
  const players = []
  
  let playerTurn = 0
  let currentFrame = 0
  let gameStarted = false
  let frameScoreModalDetails = {
    player: undefined,
    playerIndex: undefined,
    frameIndex: undefined,
  }
  let changePlayerTimeout

  const addPlayer = () => {
    console.info('adding player...')
    players.push({
      name: `Player ${players.length + 1}`,
      frames: [0,1,2,3,4],
      scores: [],
      edit: true,
      gameover: false,
      won: false,
    })
    console.info('✅ player added')
}

  const startGame = () => {
    gameStarted=true
    players.forEach(player => player.edit = false)
  }

  const restartGame = () => {
    if(!confirm('Are you sure you want to restart game?')){
      return
    }
    
    currentFrame = 0
    playerTurn = 0
    gameStarted = false

    players.forEach(player => {
      player.won = false
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

      if(players.every(player => player.gameover)) {
        runGameOver()
      }
    }

    if(players[playerTurn].gameover) {
      increasePlayerTurn()
    }
  }

  const submitPlayerScore = (player) => {
    clearTimeout(changePlayerTimeout)
    
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
      alert('🤗 Multiple winners, get ready for an additional round!')
      leaders.forEach(({player}) => {
        player.frames.push(player.frames.length)
        player.gameover = false
      })
      playerTurn = leaders[0].playerIndex
      ++currentFrame
      return
    }

    leaders[0].player.won = true
    playerTurn = -1
    currentFrame = -1

    // let screen render
    setTimeout(() => {
      alert(`🎉 Winner is Player ${leaders[0].playerIndex + 1}, ${leaders[0].player.name}`)
    }, 5)
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

  const showFrameScoreModal = (player, playerIndex, frameIndex) => {
    enterScore.showModal()
    frameScoreModalDetails = {player, playerIndex, frameIndex}
  }

  const scoreByModal = (score) => {
    const {player, playerIndex, frameIndex} = frameScoreModalDetails
    scorePlayerFrame(score, player, playerIndex, frameIndex)
    enterScore.close()
  }

  const scorePlayerFrame = (score, player, playerIndex, frameIndex) => {
    if(!player.edit) {
      if(playerTurn !== playerIndex) {
        return // wrong player scoring
      }
    
      if(frameIndex !== currentFrame) {
        return // ignore
      }
    }
  
    player.scores[frameIndex] = score
    submitPlayerScore(player)
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
  
  return () => $`
    <div>
      <h2>🎳 ${players.length ? players.length+' Player' : 'New'} Pinbowl game</h2>
      <div style="display: flex;flex-wrap: wrap;gap:.5em">
        <!-- 👤 players loop -->
        ${players.map((player, playerIndex) => $.for(player)`
          <div id=${`player_${playerIndex}`}
            style=${
              "border-radius:.5em;text-align: left;flex-grow:1;" +
              (player.gameover ?
                'background-color:rgb(89 76 231 / 44%);' :
                gameStarted && player.edit ? 'background-color:rgb(290 76 131 / 44%);' :
                (gameStarted && playerTurn === playerIndex ? 'width:100%;border:.2em solid yellow;font-size:1.2em;line-height:1.1em;' : 'border:1px solid white;'))
            }
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

                      ${player.edit && $`
                        <input
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
                    <a style=${player.edit ? 'background-color:orange;' : ''} onclick=${() => player.edit = !player.edit}>✏️</a>
                  </div>
                </div>
              </div>

              <!-- frame info-->
              ${gameStarted && $`
                <div style="display: flex;flex-wrap:wrap">
                  ${player.frames.map((frame, frameIndex) => $.for(frame)`
                    <a
                      style=${
                        'display:flex;flex-direction:column;flex-grow:1;border:1px solid white;' +
                        (currentFrame === frameIndex ? 'font-weight:bold;' : '') +
                        (playerTurn === playerIndex && currentFrame === frameIndex ? '' : 'cursor:default;')
                      }
                      onclick=${() => showFrameScoreModal(player, playerIndex, frameIndex)}
                    >
                      <div style="display:flex;padding:0 .2em;">
                        <span style="flex-grow:1;font-size:0.7em;opacity:.7">${frameIndex+1}</span>
                        <span>${frameIndex === currentFrame ? $`<span>🔵</span>` : ''}</span>
                      </div>
                      <hr style="margin: 0;" />
                      <div
                        style=${
                          'display:flex;flex-grow:1;justify-content: center;align-items: center;text-align:center;' +
                          (playerTurn === playerIndex ? 'min-width:15vw;min-height:15vw;' : '') + 
                          (playerTurn === playerIndex && currentFrame === frameIndex ? 'background:rgba(255,234,142,.8);' : '')
                        }
                      >
                        ${playerTurn === playerIndex && currentFrame === frameIndex && player.scores[frameIndex] == undefined && $`
                          <div style="opacity:.5;font-size:.8em;line-height:1em;">
                            tap<br />to<br />score
                          </div>
                        `}
                        ${player.scores[frameIndex] === 3 && (playerIndex!=playerTurn || frameIndex!=currentFrame) && '💎'}
                        ${player.scores[frameIndex] == undefined ? '' : player.scores[frameIndex]}
                      </div>
                    </a>
                  `)}
                </div>

                <div style="padding:.75em;display:flex;gap:1em;flex-wrap:wrap;justify-content: center;">
                  <!--score-->
                  <div style="text-align: center;">
                    ${!player.gameover && $`<strong>SCORE:</strong>`}
                    ${player.gameover && $`<strong>FINAL SCORE:</strong>`}
                    ${getPlayerScore(player)}
                  </div>
                </div>
              `}
              
              ${!gameStarted || (gameStarted && player.edit) && $`
                <div style="text-align: center;padding-top:1em">
                  <button
                    onclick=${() => players.splice(playerIndex,1)}
                  >🗑️ remove player ${playerIndex+1}</button>
                </div>
              `}
            </div>
          </div>
        `)}
      </div>

      <div style="padding-top:1em;">
        ${currentFrame === 0 && $`
          <button type="button"
            onclick=${addPlayer}
          >👤 Add Player</button>
        `}

        ${!gameStarted && players.length > 0 && $`
            <button type="button" onclick=${startGame}>🟢 start game</button>
        `}

        ${gameStarted && $`
          <button type="button" onclick=${restartGame}>🔄 restart game</button>
        `}
      </div>
      <br /><br />
      <div style="font-size:0.8em;opacity:.5">
        ✍️ written & created by Acker Apple
      </div>
      <br /><br />
    </div>

    <!-- enter score modal -->
    <dialog id="enterScore" style="padding:0"
      onmousedown="var r = this.getBoundingClientRect();(r.top<=event.clientY&&event.clientY<=r.top+r.height&&r.left<=event.clientX&&event.clientX<=r.left+r.width) || this.close()"
      ondragstart="const {e,dt,t} = {t:this,e:event,dt:event.dataTransfer};const d=t.drag=t.drag||{x:0,y:0};d.initX=d.x;d.startX=event.clientX-t.offsetLeft;d.startY=event.clientY-t.offsetTop;t.ondragover=e.target.ondragover=(e)=>e.preventDefault();dt.effectAllowed='move';dt.dropEffect='move'"
      ondrag="const {t,e,dt,d}={e:event,dt:event.dataTransfer,d:this.drag}; if(e.clientX===0) return;d.x = d.x + e.offsetX - d.startX; d.y = d.y + e.offsetY - d.startY; this.style.left = d.x+'px'; this.style.top = d.y+'px';"
      ondragend="const {t,e,d}={t:this,e:event,d:this.drag};if (d.initX === d.x) {d.x=d.x+e.offsetX-(d.startX-d.x);d.y=d.y+e.offsetY-(d.startY-d.y);this.style.transform=translate3d(d.x+'px', d.y+'px', 0)};this.draggable=false"
    >
      <div style="padding:.25em;background-color:#999999;color:white;" onmousedown="this.parentNode.draggable=true"
      >Select your score</div>
      
      <div style="display:flex;flex-wrap:wrap;gap:1em;padding:1em">
        ${frameScoreModalDetails.player && $`
          <button style="flex:1;min-width:200px;padding:.3em" type="button" onclick=${() => scoreByModal(3)}>💎 STRIKE</button>
          <button style="flex:1;min-width:200px;padding:.3em" type="button" onclick=${() => scoreByModal(2)}>SPARE</button>
          <button style="flex:1;min-width:200px;padding:.3em" type="button" onclick=${() => scoreByModal(1)}>1 PIN LEFT</button>
          <button style="flex:1;min-width:200px;padding:.3em" type="button" onclick=${() => scoreByModal(0)}>MORE THAN 1 PIN LEFT</button>
        `}
      </div>
      
      <div style="padding:.5em">
        <button type="button" onclick="enterScore.close()" style="min-width:200px;">🅧 cancel</button>
      </div>
    </dialog>
  `
}

export default () => {
  const app = SmallBowlApp()

  const element = document.getElementsByTagName('small-bowl-app')[0]
  
  const gem = app()
  gem.setTemplater(app)
  const {template, context} = gem.getTemplate()
  element.innerHTML = template

  interpolateElement(element, context, element)
}
