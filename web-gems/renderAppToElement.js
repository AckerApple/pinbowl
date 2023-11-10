import { interpolateElement } from "./interpolateElement.js"

export function renderAppToElement(app, element, params) {
  let update = () => {
    const error = new Error('Update function was called synchronously. Only call update() from within an asynchronous event')
    error.code = 'update-in-sync'
    throw error
  }
  let fooUpdate = () => update()

  // Create the app which returns a function
  const gemFunction = app(params, { update: fooUpdate })

  // Call the apps function for our gem templater
  const gem = gemFunction(params)
  
  // The app may need to call for asynchronous renders
  update = () => gem.update()
  
  gem.setTemplater(gemFunction)
  const {template, context} = gem.getTemplate()
  
  element.innerHTML = template
  interpolateElement(element, context, gem)
}