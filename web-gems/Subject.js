export let globalSubs = 0

export class Subject {
  constructor() {
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback)

    ++globalSubs

    const unsubscribe = () => {
      const index = this.subscribers.indexOf(callback);
      if (index !== -1) {
        this.subscribers.splice(index, 1);
      }
      --globalSubs
    }

    // Return a function to unsubscribe from the BehaviorSubject
    unsubscribe.unsubscribe = unsubscribe

    return unsubscribe
  }

  set(value) {
    this.value = value;
    // Notify all subscribers with the new value
    this.subscribers.forEach(callback => callback(value));
  }
  next = this.set
}
