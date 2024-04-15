
export function elementCount(selector) {
  return document.querySelectorAll(selector).length
}

export function queryOneInnerHTML(
  query,
  pos = 0
) {
  return document.querySelectorAll(query)[pos].innerHTML
}

export function byId(id) {
  return document.getElementById(id)
}

export function lastById(id) {
  const elms = document.querySelectorAll('#' + id)
  return elms[elms.length - 1]
}
