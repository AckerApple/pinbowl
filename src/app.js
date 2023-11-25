import { html } from "./web-gems/render.js"
import { renderAppToElement } from "./web-gems/renderAppToElement.js"
import { globalSubCount, globalSubs } from "./web-gems/Subject.js"
import { getPlayerScore, playersLoop } from "./playersLoop.js"
import { footerButtons } from "./footerButtons.js"
import runTest from "./app.test.js"
import { animateIn, animateOut } from "./animations.js"
import { component } from "./component.js"

export let SmallBowlApp = () => ({state, init, async}) => {
  let debug = false
  let renderCounter = 0
  let playerTurn = 0
  let currentFrame = 0
  let gameStarted = false
  let players = []
  let frameScoreModalDetails = {
    player: undefined,
    playerIndex: undefined,
    frameIndex: undefined,
  }

  state(() => [
    debug, x => debug = x,
    playerTurn, x => playerTurn = x,
    currentFrame, x => currentFrame = x,
    gameStarted, x => gameStarted = x,
    players, x => players = x,
    frameScoreModalDetails, x => frameScoreModalDetails = x,
    renderCounter, x => renderCounter = x,
  ])

  function startGame() {
    console.info('🟢 Starting new game...')
    gameStarted = true
    players.forEach(player => player.edit = false)
  }

  function addPlayer() {
    players.push({
      name: `Player ${players.length + 1}`,
      frames: [0,1,2,3,4],
      scores: [],
      edit: true,
      gameover: false,
      won: false,
    })

    console.info('✅ player added', players.length)
  }

  const endGame = () => {
    restartGame()
    gameStarted = false
  }

  const restartGame = () => {
    if(!confirm('Are you sure you want to end current game?')){
      return
    }
    
    playerTurn = 0
    currentFrame = 0

    players.forEach(player => {
      player.won = false
      player.frames.length = 5
      player.scores = []
      player.gameover = false
    })
  }

  function increasePlayerTurn() {
    ++playerTurn
                        
    if(playerTurn >= players.length){
      console.info('⤴️ Back up to first player')
      ++currentFrame
      playerTurn=0

      if(players.every(player => player.gameover)) {
        runGameOver()
      }
    } else {
      console.info('⤵️ Next players turn')
    }

    if(players[playerTurn].gameover) {
      increasePlayerTurn()
    }
  }

  function submitPlayerScore(player) {    
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

  function runGameOver() {
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
    }, 1)
  }

  function scoreByModal(score) {
    const {player, playerIndex, frameIndex} = frameScoreModalDetails
    scorePlayerFrame(score, player, playerIndex, frameIndex)
    enterScore.close()
    delete frameScoreModalDetails.player
  }

  function scorePlayerFrame(score, player, playerIndex, frameIndex) {
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

  function removeAllPlayers() {
    players.length = 0
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

  ++renderCounter // for debugging

  // Test subscriptions
  /*
  init(() => {
    console.log('init run once')
    setInterval(async(() => {
      console.log('globalSubCount',{globalSubCount})
    }), 4000)
  })
  */
  
  return html`
    <div>
      <h2>🎳 ${players.length ? players.length+' Player' : 'New'} Pinbowl game</h2>
      <div style="display: flex;flex-wrap: wrap;gap:.5em">
        <!-- 👤 players loop -->
        ${playersLoop({players, gameStarted, currentFrame, playerTurn, frameScoreModalDetails})}
      </div>

      players.length:${players.length}
      ${footerButtons({
        currentFrame, gameStarted, playersLength: players.length,
        removeAllPlayers, addPlayer, startGame, restartGame, endGame,
      })}
      
      <div style="font-size:0.8em;opacity:.5" onclick=${() => debug = !debug}>
        ✍️ written & created by Acker Apple
      </div>

      <br />

      <!--🐞-->
      ${debug && html`
        <div class:insert=${animateIn} class:remove=${animateOut}>
          <h2>🐞</h2>
          <div>gameStarted: ${gameStarted ? 'true' : 'false'}</div>
          <div>players: ${players.length}</div>
          <div>playerTurn: ${playerTurn}</div>
          <div>Subscriptions:${globalSubCount}:${globalSubs.length}</div>
          <div>renderCounter:${renderCounter}</div>
          
          <hr />
          
          <h3>Extras</h3>
          <button onclick=${runTest}>run test</button>
          <button onclick=${() => console.log('subs', globalSubs)}>log subs</button>
          
          <br />
          
          <div>
            <div style="font-size:0.8em">You should see "0" here => "${0}"</div>
            <!--proof you cannot see false values -->
            <div style="font-size:0.8em">You should see "" here => "${false}"</div>
            <div style="font-size:0.8em">You should see "" here => "${null}"</div>
            <div style="font-size:0.8em">You should see "" here => "${undefined}"</div>
            <!--proof you can see true booleans -->
            <div style="font-size:0.8em">You should see "true" here => "${true}"</div>
            <!--proof you can try to use the gemVar syntax -->
            <div style="font-size:0.8em">You should see "${'{'}22${'}'}" here => "{22}"</div>
            <div style="font-size:0.8em">You should see "${'{'}__gemvar0${'}'}" here => "{__gemVar0}"</div>
          </div>
        </div>
      `}

      <br />
    </div>

    <!-- enter score modal -->
    <dialog id="enterScore" style="padding:0"
      onmousedown="var r = this.getBoundingClientRect();(r.top<=event.clientY&&event.clientY<=r.top+r.height&&r.left<=event.clientX&&event.clientX<=r.left+r.width) || this.close()"
      ondragstart="const {e,dt,t} = {t:this,e:event,dt:event.dataTransfer};const d=t.drag=t.drag||{x:0,y:0};d.initX=d.x;d.startX=event.clientX-t.offsetLeft;d.startY=event.clientY-t.offsetTop;t.ondragover=e.target.ondragover=(e)=>e.preventDefault();dt.effectAllowed='move';dt.dropEffect='move'"
      ondrag="const {t,e,dt,d}={e:event,dt:event.dataTransfer,d:this.drag}; if(e.clientX===0) return;d.x = d.x + e.offsetX - d.startX; d.y = d.y + e.offsetY - d.startY; this.style.left = d.x+'px'; this.style.top = d.y+'px';"
      ondragend="const {t,e,d}={t:this,e:event,d:this.drag};if (d.initX === d.x) {d.x=d.x+e.offsetX-(d.startX-d.x);d.y=d.y+e.offsetY-(d.startY-d.y);this.style.transform=translate3d(d.x+'px', d.y+'px', 0)};this.draggable=false"
    >
      <div style="padding:.25em;background-color:#999999;color:white;" onmousedown="this.parentNode.draggable=true"
      >Select your score - ${frameScoreModalDetails.player ? 'true' : 'false'}</div>
      
      <div style="display:flex;flex-wrap:wrap;gap:1em;padding:1em">
        ${frameScoreModalDetails.player && html`
          <button type="button" id="score_strike_button" style="flex:1;min-width:200px;padding:.3em"
            onclick=${() => scoreByModal(3)}
          >💎 STRIKE</button>

          <button type="button" id="score_spare_button" style="flex:1;min-width:200px;padding:.3em"
            onclick=${() => scoreByModal(2)}
          >SPARE</button>
          
          <button type="button" id="score_1_button" style="flex:1;min-width:200px;padding:.3em"
            onclick=${() => scoreByModal(1)}
          >1 PIN LEFT</button>
          
          <button type="button" id="score_0_button" style="flex:1;min-width:200px;padding:.3em"
            onclick=${() => scoreByModal(0)}
          >MORE THAN 1 PIN LEFT</button>
        `}
      </div>
      
      <div style="padding:.5em">
        <button type="button" onclick="enterScore.close()" style="min-width:200px;">🅧 cancel</button>
      </div>
    </dialog>
  `
}

SmallBowlApp = component(SmallBowlApp)

export function showFrameScoreModal(
  player,
  playerIndex,
  frameIndex,
  frameScoreModalDetails,
) {
  frameScoreModalDetails.player = player
  frameScoreModalDetails.playerIndex = playerIndex
  frameScoreModalDetails.frameIndex = frameIndex
  console.info('⠷ Showing frame scoring modal', frameScoreModalDetails)
  enterScore.showModal()
}

export default () => {
  const element = document.getElementsByTagName('small-bowl-app')[0]
  renderAppToElement(SmallBowlApp, element, {test:1})
}
