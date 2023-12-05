import { Gem } from "./Gem.class.js"

export function html(strings, ...values) {
  return new Gem(strings, values)
}
