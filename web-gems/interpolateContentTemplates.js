import { interpolateTemplate } from "./interpolateTemplate.js"

/** Returns subscriptions[] that will need to be unsubscribed from when element is destroyed */
export function interpolateContentTemplates(
  element,
  variable,
  subs
) {
  subs = subs || [] // recursion

  if ( !element.children || element.tagName === 'TEMPLATE' ) {
    return subs // done
  }

  const children = new Array(...element.children)

  children.forEach((child, index) => {
    const isSkip = child.getAttribute('*for') || child.getAttribute('*if')
    
    if(isSkip) {
      return // let the *for do its own rendering
    }

    interpolateChild(child, index, children)
    
    if ( child.children ) {  
      const nextKids = new Array(...child.children)
      nextKids.forEach((subChild, index) => {
        if ( subChild.getAttribute('*for') || subChild.getAttribute('*if') ) {
          return // prevent interpolating things I do not own
        }

        if ( isRenderEndTemplate(subChild) ) {
          interpolateChild(subChild, index, nextKids)
        }

        interpolateContentTemplates(subChild, variable, subs)
      })
    }
  })

  function interpolateChild(child, index, children) {
    children.forEach((child, subIndex) => {
      if ( subIndex < index ) {
        return // too low
      }

      if ( child.tagName!=='TEMPLATE' ) {
        return // not a template
      }
    
      if ( child.getAttribute('interpolate')==undefined || child.getAttribute('end') == undefined ) {
        return // not a rendering template
      }

      return child
    })
    
    interpolateTemplate(
      child,
      variable,
      subs
    )
  }

  return subs
}

function isRenderEndTemplate(child) {
  const isTemplate = child.tagName==='TEMPLATE'
  return isTemplate &&
  child.getAttribute('interpolate') != undefined && 
  child.getAttribute('end') != undefined
}
