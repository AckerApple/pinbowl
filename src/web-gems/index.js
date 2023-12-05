export { html } from "./html.js"
export { gem } from "./gem.js"

export function wait(ms) {
  return new Promise(res => {
    setTimeout(() => {
      res()
    }, ms)
  })
}
