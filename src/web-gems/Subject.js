export let globalSubCount = 0 // for ease of debugging
export let globalSubs = [] // 🔬 testing

export class Subject {
  constructor() {
    this.subscribers = []
  }

  // unsubcount = 0 // 🔬 testing

  subscribe(callback) {
    this.subscribers.push(callback)
    globalSubs.push(callback) // 🔬 testing

    ++globalSubCount

    const unsubscribe = () => {
      removeSubFromArray(this.subscribers, callback)
      removeSubFromArray(globalSubs, callback) // 🔬 testing
      --globalSubCount
    }

    // Return a function to unsubscribe from the BehaviorSubject
    unsubscribe.unsubscribe = unsubscribe

    return unsubscribe
  }

  set(value) {
    this.value = value
    // Notify all subscribers with the new value
    this.subscribers.forEach(callback => {
      callback.value = value
      callback(value)
    })
  }
  next = this.set
}

function removeSubFromArray(subscribers, callback) {
  const index = subscribers.indexOf(callback)
  if (index !== -1) {
    subscribers.splice(index, 1)
  }
}
