import { animateInit } from "./animations.js"

export class Game {
  playerTurn = 0
  gameStarted = false
  currentFrame = 0
  players = []


  start() {
    console.info('🟢 Starting new game...')
    this.gameStarted = true
    this.players.forEach(player => player.edit = false)
  }

  addPlayer() {
    this.players.push({
      name: `Player ${this.players.length + 1}`,
      frames: [0,1,2,3,4],
      scores: [],
      edit: true,
      gameover: false,
      won: false,
    })

    console.info('✅ player added', this.players.length)
  }
}

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
  animateInit({target: enterScore})
}
