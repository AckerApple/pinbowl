/** Primary function for removing gems from the DOM and managing unsubscribing */
export function removeChild(parentNode, clone) {
  if ( clone.gemSubs ) {
    clone.gemSubs.forEach(sub => sub.unsubscribe())
  }

  if ( clone.children ) {
    new Array(...clone.children).forEach(child => removeChild(clone, child))
  }

  parentNode.removeChild(clone)
}