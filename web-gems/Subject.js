export let globalSubCount = 0
export let globalSubs = []

export class Subject {
  constructor() {
    this.subscribers = [];
  }

  unsubcount = 0

  subscribe(callback) {
    this.subscribers.push(callback)
    globalSubs.push(callback)

    ++globalSubCount

    const unsubscribe = () => {
      removeSubFromArray(this.subscribers, callback)
      removeSubFromArray(globalSubs, callback)
      --globalSubCount
      ++this.unsubcount
      if(this.unsubcount > 1) {
        console.error('double unsub', {callback, value:this.value})
      }  
    }

    // Return a function to unsubscribe from the BehaviorSubject
    unsubscribe.unsubscribe = unsubscribe

    return unsubscribe
  }

  set(value) {
    this.value = value;
    // Notify all subscribers with the new value
    this.subscribers.forEach(callback => {
      callback.value = value
      callback(value)
    })
  }
  next = this.set
}

function removeSubFromArray(subscribers, callback) {
  const index = subscribers.indexOf(callback);
  if (index !== -1) {
    subscribers.splice(index, 1);
  }
}