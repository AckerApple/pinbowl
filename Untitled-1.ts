
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

const run = () => {
    const playerAddButton = document.getElementById('player_add_button')

    expect(document.querySelectorAll('#player_0_input').length).toBe(0)
    expect(document.querySelectorAll('#player_1_input').length).toBe(0)

    console.log('adding player 1...')
    playerAddButton.click()

    // document.getElementById('player_0_input').blur()
    
    expect(document.querySelectorAll('#player_0_input').length).toBe(1)
    expect(document.querySelectorAll('#player_1_input').length).toBe(0)
    
    console.log('adding player 2...')
    playerAddButton.click()

    expect(document.querySelectorAll('#player_0_input').length).toBe(1)
    expect(document.querySelectorAll('#player_1_input').length).toBe(1)

    // expect(4).toBe(5)
}

setTimeout(run, 3000)