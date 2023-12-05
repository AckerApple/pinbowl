import { html, gem } from "./web-gems/index.js"
import { renderAppToElement } from "./web-gems/renderAppToElement.js"
import { getPlayerScore, playersLoop } from "./playersLoop.js"
import { footerButtons } from "./footerButtons.js"
import { debugApp } from "./debugApp.js"
import { Game } from "./game.js"
import { animateDestroy } from "./animations.js"

export let SmallBowlApp = () => ({state}) => {
  let game = new Game()

  let frameScoreModalDetails = {
    player: undefined,
    playerIndex: undefined,
    frameIndex: undefined,
  }

  let debug = false

  state(() => [
    game, x => game = x,
    debug, x => debug = x,
    frameScoreModalDetails, x => frameScoreModalDetails = x,
  ])

  const endGame = () => {
    restartGame()
    game.gameStarted = false
  }

  const restartGame = () => {
    if(!confirm('Are you sure you want to end current game?')){
      return
    }
    
    game.playerTurn = 0
    game.currentFrame = 0

    game.players.forEach(player => {
      player.won = false
      player.frames.length = 5
      player.scores = []
      player.gameover = false
    })
  }

  function increasePlayerTurn() {
    ++game.playerTurn
                        
    if(game.playerTurn >= game.players.length){
      console.info('⤴️ Back up to first player')
      ++game.currentFrame
      game.playerTurn=0

      if(game.players.every(player => player.gameover)) {
        runGameOver()
      }
    } else {
      console.info('⤵️ Next players turn')
    }

    if(game.players[game.playerTurn].gameover) {
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

    if(game.players.every(player => player.gameover)) {
      runGameOver()
      return
    }

    increasePlayerTurn()

    setTimeout(() => {
      const elm = document.getElementById('player_' + game.playerTurn)

      if(!elm) {
        return // tests move quickly and element may no longer by on stage
      }

      elm.scrollIntoView({
        behavior: 'smooth'
      })
    }, 300)
  }

  function runGameOver() {
    const leadersMeta = game.players.reduce((all,player, playerIndex) => {
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
      game.playerTurn = leaders[0].playerIndex
      ++game.currentFrame
      return
    }

    leaders[0].player.won = true
    game.playerTurn = -1
    game.currentFrame = -1

    // let screen render
    setTimeout(() => {
      alert(`🎉 Winner is Player ${leaders[0].playerIndex + 1}, ${leaders[0].player.name}`)
    }, 1)
  }

  function scoreByModal(score) {
    const {player, playerIndex, frameIndex} = frameScoreModalDetails
    scorePlayerFrame(score, player, playerIndex, frameIndex)
    closeScoreModal()
  }

  const closeScoreModal = () => animateDestroy({target:enterScore, capturePosition: false}).then(() => {
    enterScore.close()
    delete frameScoreModalDetails.player
  })

  function scorePlayerFrame(score, player, playerIndex, frameIndex) {
    if(!player.edit) {
      if(game.playerTurn !== playerIndex) {
        return // wrong player scoring
      }
    
      if(frameIndex !== game.currentFrame) {
        return // ignore
      }
    }
  
    player.scores[frameIndex] = score
    submitPlayerScore(player)
  }

  function removeAllPlayers() {
    game.players.length = 0
  }
  
  return html`
    <!-- new pinbowl game -->
    <h2>🎳 ${game.players.length ? game.players.length+' Player' : 'New'} Pinbowl game</h2>
    
    <!-- 👤 players loop -->
    <div style="display: flex;flex-wrap: wrap;gap:.5em">
      ${playersLoop({...game, frameScoreModalDetails})}
    </div>

    ${footerButtons({
      game,
      currentFrame: game.currentFrame,
      gameStarted: game.gameStarted,
      playersLength: game.players.length,
      removeAllPlayers, restartGame, endGame,
    })}
    
    <div style="font-size:0.8em;opacity:.5" onclick=${() => debug = !debug}>
      ✍️ written & created by Acker Apple
    </div>

    <br />

    <!--🐞-->
    ${debug && debugApp(game)}

    <br />

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
        <button type="button" onclick=${closeScoreModal} style="min-width:200px;">🅧 cancel</button>
      </div>
    </dialog>
  `
}

SmallBowlApp = gem(SmallBowlApp)

export default () => {
  const element = document.getElementsByTagName('small-bowl-app')[0]
  renderAppToElement(SmallBowlApp, element, {test:1})
}
