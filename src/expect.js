export function expect(expected) {
  return {
    toBeDefined: () => {
      if(expected !== undefined && expected !== null) {
        return
      }

      const message = `Expected ${JSON.stringify(expected)} to be defined`
      console.error(message, {expected})
      throw new Error(message)
    },
    toBe: (received, customMessage) => {
      if(expected === received) {
        return
      }

      const message = customMessage || `Expected ${JSON.stringify(received)} to be ${JSON.stringify(received)}`
      console.error(message, {received, expected})
      throw new Error(message)
    }
  }
}