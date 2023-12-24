import { providers, state, html, tag, renderAppToElement, onInit } from "./taggedjs/index.js"
import { playersLoop } from "./playersLoop.js"
import { footerButtons } from "./footerButtons.js"
import { debugApp } from "./debugApp.js"
import { Game, frameScoreDetails } from "./game.js"
import { animateDestroy } from "./animations.js"

export const SmallBowlApp = tag(() => {
  // app.js - SmallBowlApp
  const frameScoreModalDetails = state(frameScoreDetails)

  const game = providers.create(Game)
  let debug = state(false, x => [debug, debug = x])

  onInit(() => {
    // one time subscriptions
    game.tieBreaker.subscribe(() => alert('🤗 Multiple winners, get ready for an additional round!'))
    game.winner.subscribe(leader => alert(`🎉 Winner is Player ${leader.playerIndex + 1}, ${leader.player.name}`))
    game.lastFrameStrike.subscribe(() => alert('💥 Strike on the last frame! Another frame added.\n\nFor now, it\'s the next players turn.'))
    game.changePlayerTurn.subscribe(() => {
      setTimeout(() => {
        const elm = document.getElementById('player_' + game.playerTurn)
  
        if(!elm) {
          return // tests move quickly and element may no longer by on stage
        }
  
        elm.scrollIntoView({
          behavior: 'smooth'
        })
      }, 300)  
    })

    console.info('👍 game initialized')
  })

  const endGame = () => {
    restartGame()
    game.gameStarted = false
  }

  const restartGame = () => {
    if(!confirm('Are you sure you want to end current game?')){
      return
    }
    
    game.restart()
  }

  function scoreByModal(score) {
    const {player, playerIndex, frameIndex} = frameScoreModalDetails
    game.scorePlayerFrame(score, player, playerIndex, frameIndex)
    closeScoreModal()
  }

  const closeScoreModal = () => animateDestroy({target:enterScore, capturePosition: false}).then(() => {
    enterScore.close()
    delete frameScoreModalDetails.player
  })
  
  return html`
    <!-- new pinbowl game -->
    <h2>🎳 ${game.players.length ? game.players.length+' Player' : 'New'} Pinbowl game</h2>
    
    <!-- 👤 players loop -->
    <div style="display: flex;flex-wrap: wrap;">
      ${playersLoop({frameScoreModalDetails})}
    </div>

    ${footerButtons({restartGame, endGame})}
    
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
      >🎳 Select your score</div>
      
      <div style="display:flex;flex-wrap:wrap;gap:1em;padding:1em">
        ${frameScoreModalDetails.player && html`
          <button type="button" id="score_strike_button" style="flex:1;min-width:200px;padding:.3em"
            onclick=${() => scoreByModal(3)}
          >
            💎 STRIKE
            <br /><br />
            <div style="opacity:.6;font-size:.8em;">3 points</div>
          </button>

          <button type="button" id="score_spare_button" style="flex:1;min-width:200px;padding:.3em"
            onclick=${() => scoreByModal(2)}
          >
            SPARE
            <br /><br />
            <div style="opacity:.6;font-size:.8em;">2 points</div>
          </button>
          
          <button type="button" id="score_1_button" style="flex:1;min-width:200px;padding:.3em"
            onclick=${() => scoreByModal(1)}
          >
            1 PIN LEFT
            <br /><br />
            <div style="opacity:.6;font-size:.8em;">1 point</div>
          </button>
          
          <button type="button" id="score_0_button" style="flex:1;min-width:200px;padding:.3em"
            onclick=${() => scoreByModal(0)}
          >
            MORE THAN 1 PIN LEFT
            <br /><br />
            <div style="opacity:.6;font-size:.8em;">0 points</div>
          </button>
        `}
      </div>
      
      <div style="padding:.5em">
        <button type="button" onclick=${closeScoreModal} style="min-width:200px;">🅧 cancel</button>
      </div>
    </dialog>
  `
})

export default () => {
  const element = document.getElementsByTagName('small-bowl-app')[0]
  renderAppToElement(SmallBowlApp, element, {test:1})
}
