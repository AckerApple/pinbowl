export class Game {
  playerTurn = 0
  gameStarted = false
  currentFrame = 0
  players = []
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
}
