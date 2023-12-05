- Component Children?!??
- Rename web-gems to gems?
  - consider everware?
- Consider what if an issue if some content contains {__gemVar0} as actual content?
  - Maybe first replace all "fake" {gemVar0} with something we can drop them back in with
- Test switching an components return string
- You should see "{__gemvar0}" here => "false"
- Consider adding onremove={} where a promise causes delay

## Attributes

- We need to properly process [style.background-color]=${isSomething ? 'red' : null}


## Documentations

### React differences
- Use html`` instead of ()
- The boolean -true- will render to screen
- No import hooks
- Render template syntax is ${} instead of {}
- Provided hooks ({state, init, async, render}) => html``
  - state hook
  - init hook
  - async hook
  - render hook

### Angular similarities
- Support for bracket element definitions
  - [style.background-color]="red"
  - NOT [style.background-color]="'red'"
  - NOT [style.backgroundColor]="'red'" NOR [style.backgroundColor]="red"