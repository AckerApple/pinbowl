import { Subject } from "./taggedjs/index.js"

export class Game {
  playerTurn = 0
  gameStarted = false
  currentFrame = 0
  players = []

  tieBreaker = new Subject()
  winner = new Subject()
  lastFrameStrike = new Subject()
  changePlayerTurn = new Subject()

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

    // let screen render
    setTimeout(() => {
      this.winner.set(leaders[0])
    }, 1)
  }
  
  increasePlayerTurn() {
    ++this.playerTurn
                        
    if(this.playerTurn >= this.players.length){
      console.info('⤴️ Back up to first player')
      ++this.currentFrame
      this.playerTurn=0

      if(this.players.every(player => player.gameover)) {
        this.runGameOver()
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
      this.runGameOver()
      return
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

    this.submitPlayerScore(player)
  }

  removeAllPlayers() {
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
}

export function getPlayerScore (player) {
  return player.scores.reduce((all,score) => {
    return all + score
  },0)
}

/**
 * Creates an instance of a class.
 * @template T
 * @param {new (...args: any[]) => T} classType - The class constructor function.
 * @param {any} args - The arguments to pass to the class constructor.
 * @returns {T} - The created instance of the class.
 */
function provide(classType) {
  const object = new classType()
}

export const frameScoreDetails = {
  player: undefined,
  
  /** @type {number | undefined} */
  playerIndex: undefined,
  
  /** @type {number | undefined} */
  frameIndex: undefined,
}
