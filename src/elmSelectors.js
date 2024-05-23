
export function elmCount(selector) {
  return document.querySelectorAll(selector).length
}

export function queryOneInnerHTML(
  query,
  pos = 0
) {
  return document.querySelectorAll(query)[pos].innerHTML
}

export function click(
  query
) {
  return document.querySelectorAll(query).forEach(elm => (elm).click())
}

export function html(
  query
) {
  let html = ''
  document.querySelectorAll(query).forEach(elm => html = html + elm.innerHTML)
  return html
}

export function byId(id) {
  return document.getElementById(id)
}

export function htmlById(id) {
  return (document.getElementById(id)).innerHTML
}

export function lastById(id) {
  const elms = document.querySelectorAll('#' + id)
  return elms[elms.length - 1]
}
