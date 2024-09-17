import { query, keyupOn, byId, lastById } from "./elmSelectors.js"
import { expect } from "./expect.js"
import { Subject } from "./taggedjs/bundle.js"
import { wait } from "./wait.function.js"

export default async function runTest() {
  runTest.testing = true
  await wait(1000) // let display update runTest.testing before actually testing
  console.info('⏳ testing started...')
  
  await wait(0) // let display update runTest.testing before actually testing
  
  try {
    const startCount = Subject.globalSubCount
    let playerAddButton = byId('player_add_button')
    
    expect(document.querySelectorAll('#player_0_input').length).toBe(0)
    expect(document.querySelectorAll('#player_1_input').length).toBe(0)
    
    playerAddButton.click()
    
    let player0inputs = document.querySelectorAll('#player_0_input')
    expect(player0inputs.length).toBe(1, 'Expected player 1 input to be present')
    const player0Input = player0inputs[0]
    player0Input.value = 'Acker'
    keyupOn(player0Input)
    expect(document.querySelectorAll('#player_1_input').length).toBe(0)
    
    playerAddButton = byId('player_add_button')
    playerAddButton.click()

    // player 1 input should now present
    player0inputs = document.querySelectorAll('#player_0_input')
    expect(player0inputs.length).toBe(1, `expected 1 players but got ${player0inputs.length}`)
    expect(document.querySelectorAll('#player_1_input').length).toBe(1, 'expected 2 player input')

    const player1Input = byId('player_1_input')
    player1Input.value = 'Mark'
    keyupOn(player1Input)
    player0inputs = document.querySelectorAll('#player_0_input')
    expect(document.querySelectorAll('#player_0_input').length).toBe(1)
    expect(document.querySelectorAll('#player_1_input').length).toBe(1)

    console.info('🔵 clicking start...')
    byId('start_game_button').click()

    expect(byId('score_strike_button')).toBe(null)

    
    console.info('🔵 making first score...')
    // frame 1 - strike
    byId('player_0_frame_0').click()
    
    expect(byId('score_strike_button')).toBeDefined('modal did not show the strike score button')
    const promiseStrike = byId('score_strike_button').click()
    expect(promiseStrike instanceof Promise).toBe(true, 'expected strike promise')
    await promiseStrike
    expect(query('#score_strike_button').length).toBe(0)
    expect(byId('score_strike_button')).toBe(null)
    
    byId('player_1_frame_0').click()
    byId('score_strike_button').click()

    // frame 2 - spare
    byId('player_0_frame_1').click()
    byId('score_spare_button').click()
    byId('player_1_frame_1').click()
    byId('score_spare_button').click()

    // frame 3 - 1
    byId('player_0_frame_2').click()
    byId('score_1_button').click()
    byId('player_1_frame_2').click()
    byId('score_1_button').click()

    // frame 4 - 0
    byId('player_0_frame_3').click()
    byId('score_0_button').click()
    byId('player_1_frame_3').click()
    byId('score_0_button').click()

    // frame 5 - 0
    byId('player_0_frame_4').click()
    byId('score_0_button').click()
    byId('player_1_frame_4').click()
    
    const winner = byId('score_1_button').click() // winner
    expect(winner instanceof Promise).toBeDefined()
    expect(await winner).toBe('promise-no-data-ever')
    
    await byId('closeAlert').click()
        
    let addPlayerButtons = document.querySelectorAll('#player_add_button')
    expect(addPlayerButtons.length).toBe(0, `Expected player add button count to be 0 but its ${addPlayerButtons.length}`)

    const endPromise = byId('end_game_button').click()

    addPlayerButtons = document.querySelectorAll('#player_add_button')
    expect(addPlayerButtons.length).toBe(0)

    byId('confirmAlert').click()
    expect(endPromise instanceof Promise).toBe(true, 'expected promise')
    await endPromise

    addPlayerButtons = document.querySelectorAll('#player_add_button')
    expect(addPlayerButtons.length).toBe(1)

    let p1remove = byId('player_1_remove')
    expect(p1remove).toBeDefined()

    let p0remove = byId('player_0_remove')
    expect(p0remove).toBeDefined()

    p0remove = byId('player_0_remove')
    p0remove.click() // remove player 1 index 0
    
    p1remove = byId('player_1_remove')
    expect(p1remove).toBe(null, 'Expected player two remove button not to be present')

    lastById('player_0_remove').click() // removes player 2 who is now 1
    
    await wait(1000)
    
    p0remove = byId('player_0_remove')
    expect(p0remove).toBe(null, 'Expected no player 1 remove button')
    
    let removeAllPlayers = p0remove = byId('remove_all_players')
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
