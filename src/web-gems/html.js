import { Gem } from "./Gem.class.js"

export function html(strings, ...values) {
  return new Gem(strings, values)
}

export function key (
  arrayValue
) {
  return {
    html: (strings, ...values) => {
      const gem = html(strings, ...values)
      gem.arrayValue = arrayValue
      return gem
    }  
  }
}
