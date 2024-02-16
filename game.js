import { Subject } from "./taggedjs/index.js"

/**
 * @typedef {Object} Player
 * @property {string} name - The name of the player.
 * @property {number[]} frames - Array of frame numbers.
 * @property {number[]} scores - Array of scores.
 * @property {boolean} edit - Indicates if the player's information is editable.
 * @property {boolean} gameover - Indicates if the game for the player is over.
 * @property {boolean} won - Indicates if the player has won the game.
 */

export class Game {
  playerTurn = -1
  gameStarted = false
  currentFrame = 0

  /** @type {Player[]}  */
  players = []

  tieBreaker = new Subject()
  winner = new Subject()
  lastFrameStrike = new Subject()
  changePlayerTurn = new Subject()

  start() {
    console.info('🟢 Starting new game...')
    this.gameStarted = true
    this.playerTurn = 0
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

  /**
   * 
   * @returns {Player | undefined}
   */
  runGameOver() {
    const leadersMeta = this.players.reduce((all,player, playerIndex) => {
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
      this.tieBreaker.next()
      leaders.forEach(({player}) => {
        player.frames.push(player.frames.length)
        player.gameover = false
      })
      this.playerTurn = leaders[0].playerIndex
      ++this.currentFrame
      return
    }

    leaders[0].player.won = true
    this.playerTurn = -1
    this.currentFrame = -1

    this.winner.set(leaders[0])

    return leaders[0]
  }
  
  increasePlayerTurn() {
    ++this.playerTurn
                        
    if(this.playerTurn >= this.players.length){
      console.info('⤴️ Back up to first player')
      ++this.currentFrame
      this.playerTurn=0

      if(this.players.every(player => player.gameover)) {
        return this.runGameOver()
      }
    } else {
      console.info('⤵️ Next players turn')
    }

    if(this.players[this.playerTurn].gameover) {
      this.increasePlayerTurn()
    }
  }

  submitPlayerScore(player) {    
    // maybe player game over
    if(player.scores.length === player.frames.length) {
      // its not a 3, game over
      if(player.scores[player.scores.length - 1] !== 3) {
        player.gameover = true
      }

      // its a 3, make a new frame
      if(player.scores[player.frames.length-1] === 3){
        player.frames.push(player.frames.length)
        this.lastFrameStrike.next()
      }  
    }

    if(this.players.every(player => player.gameover)) {
      return this.runGameOver()
    }

    this.increasePlayerTurn()
    this.changePlayerTurn.next()
  }
  
  editPlayerScore(score, player, playerIndex, frameIndex) {
    if(!player.edit) {
      if(this.playerTurn !== playerIndex) {
        return // wrong player scoring
      }
    
      if(frameIndex !== this.currentFrame) {
        return // ignore
      }
    }
  
    player.scores[frameIndex] = score
  }

  scorePlayerFrame(score, player, playerIndex, frameIndex) {
    this.editPlayerScore(score, player, playerIndex, frameIndex)

    if(this.playerTurn !== playerIndex) {
      return // its not current players turn, most likely just a score edit
    }

    return this.submitPlayerScore(player)
  }

  removePlayer(playerIndex) {
    this.players.splice(playerIndex,1)
    console.info(`⬇️ removed player ${playerIndex+1} now ${this.players.length} players`)
  }

  removeAllPlayers() {
    console.info(`⬇️⬇️ removing all ${this.players.length} players`)
    this.players.length = 0
  }

  restart() {
    this.playerTurn = 0
    this.currentFrame = 0

    this.players.forEach(player => {
      player.won = false
      player.frames.length = 5
      player.scores = []
      player.gameover = false
    })
  }

  alertData = {message:'', resolve: () => undefined}
  alert(message) {
    this.alertData.message = message
    this.alertData.confirm = false
    return new Promise(resolve => {
      this.alertData.resolve = resolve
      document.getElementById('alertDialog').showModal()
    })
  }

  confirm(message) {
    this.alertData.message = message
    this.alertData.confirm = true
    return new Promise(resolve => {
      this.alertData.resolve = resolve
      document.getElementById('alertDialog').showModal()
    })
  }

}

export function getPlayerScore (player) {
  return player.scores.reduce((all,score) => {
    return all + score
  },0)
}

export const frameScoreDetails = {
  player: undefined,
  
  /** @type {number | undefined} */
  playerIndex: undefined,
  
  /** @type {number | undefined} */
  frameIndex: undefined,
}
