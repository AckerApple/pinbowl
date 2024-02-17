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
    
    expect(document.querySelectorAll('#player_0_input').length).toBe(1)
    expect(document.querySelectorAll('#player_1_input').length).toBe(0)
    
    playerAddButton = document.getElementById('player_add_button')
    playerAddButton.click()

    expect(document.querySelectorAll('#player_0_input').length).toBe(1)
    expect(document.querySelectorAll('#player_1_input').length).toBe(1)

    const player0Input = document.getElementById('player_0_input')
    const player1Input = document.getElementById('player_1_input')
    
    player0Input.value = 'Acker'
    player1Input.value = 'Mark'

    player0Input.onkeyup({target:player0Input})
    player1Input.onkeyup({target:player1Input})
    
    expect(document.querySelectorAll('#player_0_input').length).toBe(1)
    expect(document.querySelectorAll('#player_1_input').length).toBe(1)

    document.getElementById('start_game_button').click()

    expect(document.getElementById('score_strike_button')).toBe(null)

    
    // frame 1 - strike
    document.getElementById('player_0_frame_0').onclick()
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
    
    document.getElementById('closeAlert').onclick()
    
    console.info('test game completed. ending...')

    const promise = document.getElementById('end_game_button').onclick()
    await document.getElementById('confirmAlert').onclick()
    await promise

    let addPlayerButtons = document.querySelectorAll('#player_add_button')
    expect(addPlayerButtons.length).toBe(1)

    console.info('removing player 2...')

    let p1remove = document.getElementById('player_1_remove')
    expect(p1remove).toBeDefined()

    console.info('removing player 1...')
    let p0remove = document.getElementById('player_0_remove')
    p0remove.click()

    await wait(1000)

    p1remove = document.getElementById('player_1_remove')
    expect(p1remove).toBe(null)

    document.getElementById('player_0_remove').click() // removes player 2 who is now 1

    await wait(1000)

    p0remove = document.getElementById('player_0_remove')
    expect(p0remove).toBe(null)
    
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

function expect(received) {
  return {
    toBeDefined: () => {
      if(received !== undefined) {
        return
      }

      const message = `Expected ${JSON.stringify(received)} to be defined`
      console.error(message, {received, expected})
      throw new Error(message)
    },
    toBe: (expected) => {
      if(received === expected) {
        return
      }

      const message = `Expected ${JSON.stringify(received)} to be ${JSON.stringify(expected)}`
      console.error(message, {received, expected})
      throw new Error(message)
    }
  }
}