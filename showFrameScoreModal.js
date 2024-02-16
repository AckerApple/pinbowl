import { animateInit } from "./animations.js"

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
  return animateInit({target: enterScore})
}
