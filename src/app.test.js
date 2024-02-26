import { expect } from "./expect.js"
import { Subject } from "./taggedjs/index.js"
import { wait } from "./wait.function.js"

export default async function runTest() {
  runTest.testing = true
  await wait(1000) // let display update runTest.testing before actually testing
  console.info('⏳ testing started...')
  
  await wait(0) // let display update runTest.testing before actually testing
  
  try {
    const startCount = Subject.globalSubCount
    let playerAddButton = document.getElementById('player_add_button')
    
    expect(document.querySelectorAll('#player_0_input').length).toBe(0)
    expect(document.querySelectorAll('#player_1_input').length).toBe(0)
    
    playerAddButton.click()
    
    let player0inputs = document.querySelectorAll('#player_0_input')
    expect(player0inputs.length).toBe(1)
    const player0Input = player0inputs[0]
    player0Input.value = 'Acker'
    player0Input.onkeyup({target:player0Input})
    expect(document.querySelectorAll('#player_1_input').length).toBe(0)
    
    playerAddButton = document.getElementById('player_add_button')
    playerAddButton.click()

    // player 1 input should now be gone
    player0inputs = document.querySelectorAll('#player_0_input')
    expect(player0inputs.length).toBe(0, `expected 1 player input but got ${player0inputs.length}`)
    expect(document.querySelectorAll('#player_1_input').length).toBe(1, 'expected 2 player input')

    const player1Input = document.getElementById('player_1_input')
    player1Input.value = 'Mark'
    player1Input.onkeyup({target:player1Input})
    player0inputs = document.querySelectorAll('#player_0_input')
    expect(document.querySelectorAll('#player_0_input').length).toBe(0)
    expect(document.querySelectorAll('#player_1_input').length).toBe(1)

    document.getElementById('start_game_button').onclick()

    expect(document.getElementById('score_strike_button')).toBe(null)

    
    // frame 1 - strike
    const firstScore = document.getElementById('player_0_frame_0').onclick()
    
    expect(document.getElementById('score_strike_button')).toBeDefined()
    await document.getElementById('score_strike_button').onclick()    
    expect(document.getElementById('score_strike_button')).toBe(null)
    
    document.getElementById('player_1_frame_0').onclick()
    document.getElementById('score_strike_button').onclick()

    // frame 2 - spare
    document.getElementById('player_0_frame_1').onclick()
    document.getElementById('score_spare_button').onclick()
    document.getElementById('player_1_frame_1').onclick()
    document.getElementById('score_spare_button').onclick()

    // frame 3 - 1
    document.getElementById('player_0_frame_2').onclick()
    document.getElementById('score_1_button').onclick()
    document.getElementById('player_1_frame_2').onclick()
    document.getElementById('score_1_button').onclick()

    // frame 4 - 0
    document.getElementById('player_0_frame_3').onclick()
    document.getElementById('score_0_button').onclick()
    document.getElementById('player_1_frame_3').onclick()
    document.getElementById('score_0_button').onclick()

    // frame 5 - 0
    document.getElementById('player_0_frame_4').onclick()
    document.getElementById('score_0_button').onclick()
    document.getElementById('player_1_frame_4').onclick()
    
    const winner = document.getElementById('score_1_button').onclick() // winner
    expect(winner instanceof Promise).toBeDefined()
    expect(await winner).toBe('no-data-ever')
    
    await document.getElementById('closeAlert').onclick()
        
    let addPlayerButtons = document.querySelectorAll('#player_add_button')
    expect(addPlayerButtons.length).toBe(0, `Expected player add button count to be 0 but its ${addPlayerButtons.length}`)

    const endPromise = document.getElementById('end_game_button').onclick()

    addPlayerButtons = document.querySelectorAll('#player_add_button')
    expect(addPlayerButtons.length).toBe(0)

    const endConfirmPromise = document.getElementById('confirmAlert').onclick()
    await endConfirmPromise
    await endPromise

    addPlayerButtons = document.querySelectorAll('#player_add_button')
    expect(addPlayerButtons.length).toBe(1)

    let p1remove = document.getElementById('player_1_remove')
    expect(p1remove).toBeDefined()

    let p0remove = document.getElementById('player_0_remove')
    expect(p0remove).toBeDefined()

    p0remove = document.getElementById('player_0_remove')
    p0remove.click()

    // await wait(1000)

    p1remove = document.getElementById('player_1_remove')
    expect(p1remove).toBe(null)

    document.getElementById('player_0_remove').click() // removes player 2 who is now 1

    await wait(1000)
    p0remove = document.getElementById('player_0_remove')
    expect(p0remove).toBe(null, 'Expected no player 1 remove button')
    
    let removeAllPlayers = p0remove = document.getElementById('remove_all_players')
    expect(removeAllPlayers).toBe(null)
    
    if(Subject.globalSubCount != startCount ) {
      throw new Error(`Expected ${startCount} subscriptions at the end but counted ${Subject.globalSubCount}`)
    }
    
    alert('✅ all tests passed')
    console.info('✅ all tests passed')
  } catch (error) {
    console.error('error', error)
    alert('❌ tests failed: ' + error.message)
  }
  
  runTest.testing = false
}
