import { globalSubCount } from "./web-gems/Subject.js"
import { wait } from "./web-gems/index.js"

export default async function runTest() {
  try {
    const startCount = globalSubCount
    const playerAddButton = document.getElementById('player_add_button')
     
    playerAddButton.click()
    playerAddButton.click()
  
    const player0Input = document.getElementById('player_0_input')
    const player1Input = document.getElementById('player_1_input')
    
    player0Input.value = 'Acker'
    player1Input.value = 'Mark'

    player0Input.onkeyup({target:player0Input})
    player1Input.onkeyup({target:player1Input})
    
    document.getElementById('start_game_button').click()
    
    // frame 1 - strike
    document.getElementById('player_0_frame_0').click()
    document.getElementById('score_strike_button').click()
    document.getElementById('player_1_frame_0').click()
    document.getElementById('score_strike_button').click()

    // frame 2 - spare
    document.getElementById('player_0_frame_1').click()
    document.getElementById('score_spare_button').click()
    document.getElementById('player_1_frame_1').click()
    document.getElementById('score_spare_button').click()

    // frame 3 - 1
    document.getElementById('player_0_frame_2').click()
    document.getElementById('score_1_button').click()
    document.getElementById('player_1_frame_2').click()
    document.getElementById('score_1_button').click()

    // frame 4 - 0
    document.getElementById('player_0_frame_3').click()
    document.getElementById('score_0_button').click()
    document.getElementById('player_1_frame_3').click()
    document.getElementById('score_0_button').click()

    // frame 5 - 0
    document.getElementById('player_0_frame_4').click()
    document.getElementById('score_0_button').click()
    document.getElementById('player_1_frame_4').click()
    document.getElementById('score_1_button').click() // winner

    await wait(2)

    document.getElementById('end_game_button').click()

    await wait(2)
    
    document.getElementById('player_0_remove').click()
    document.getElementById('player_0_remove').click() // removes player 2 who is now 1
   
    if(globalSubCount != startCount ) {
      throw new Error(`Expected ${startCount} subscriptions at the end but counted ${globalSubCount}`)
    }
    
    alert('✅ all tests passed')
  } catch (error) {
    console.error('error', error)
    alert('❌ tests failed: ' + error.message)
  }
}
