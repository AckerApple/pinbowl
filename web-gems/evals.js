import { extractAndReplaceFunctions } from "./extractAndReplaceFunctions.js"

export function evalWith(
  string,
  context,
  bindTo,
  captureResult = true,
) {
  // create a string that has a `const ${key} = context['${key}']
  const varString = objectToConsts(context, 'context');

  // now anything changed needs to be set back (just reset all)
  const setBackToObject = constsToObject(context, 'context')
  let resultCapture = 'const evalWithResult=' + string + ';'

  if ( !captureResult ) {
    resultCapture = '(() => {' + string + '}).bind(this)();'
  }
  
  let finalString = varString + resultCapture + setBackToObject
  
  if ( captureResult ) {
    finalString += ';evalWithResult'
  }
  
  return (function() {    
    // THIS IS USED by the evaluated so that the true "this" is not used (ignore "unused variable")
    const this$ = context
    
    try {
      return eval(finalString)
    } catch (err) {
      console.warn('Error occurred evaluating the statement: ' + string, {
        context,
        // finalString,
      })
      throw err // rethrow
    }
  }).bind(bindTo || context)()
}

/** Used to slow go over evaluations */
export function evalOver(
  variable,
  expression,
  each = (result, context, expression) => result // must return value given
) {
  const parsed = parseExpression(expression)
  let endVariables = [] // {expression, isNum, isString, value, requiresDot}[]
  
  // expression could be "Object.keys(something)"
  let context = variable
  let lastContext = context
  let bracketContexts = [context]
  // let context = { Object }
  // Object.assign(context, variable)

  parsed.forEach(part => {
    if ( part.expression === '[' ) {
      bracketContexts.push(lastContext)
      return
    }
    
    // END BRACKET PARSING
    if ( part.expression === ']' ) {
      const goodEndVars = []
      const expressions = []
      let removeFrom = endVariables.length
      let brackets = 0

      endVariables.reverse().find((x, index) => {
        // go back as far as just before last starting bracket
        if ( !x.isVar  ) {
          if ( brackets > 0 ) {
            return true
          }

          if ( x.expression === '[' ) {
            --removeFrom
            expressions.unshift(x)
            ++brackets
            return false // its the first bracket
          }

          return true
        }

        expressions.unshift(x)
        goodEndVars.unshift(x.value)
        --removeFrom

        return false
      })

      // put back because reverse truly reverses the array
      endVariables.reverse()
 
      const howMany = endVariables.length - removeFrom
      const removed = endVariables.splice(removeFrom, howMany+1)
      
      const first = goodEndVars.shift()
      const sumVar = goodEndVars.reduce((all, value) => {
        return all[value]
      }, first)

      endVariables.push({
        expression: expressions.map((x,index) => {
          return index === expressions.length - 1 ? '[' + x.expression : x.expression
        }).join('') + ']', // debug purposes only
        expression2: removed,
        isVar: true,
        value: sumVar,
        isEndBracket: true
      })

      part.isEndBracket = true

      bracketContexts.pop()
      context = sumVar // CONTEXT SWITCHED

      return
    }

    // is it an operator?
    if ( !part.isVar ) {

      // if the last thing we did was work with a bracket but now we will be working with an operator, go back a context
      const last = endVariables[endVariables.length-1]
      if ( endVariables.length && last.isEndBracket ) {
        context = bracketContexts[ bracketContexts.length - 1 ]
      }

      endVariables.push(part)

      return // skip me, start again
    }
    
    let dynamicExpression = ''
    try {
      if ( part.isNum || part.isString ) {
        dynamicExpression = part.expression
        const result = each(
          evalWith(dynamicExpression, {all: context}, context, true),
          context,
          part.expression,
        )

        endVariables.push({
          ...part,
          value: result,
        })
        return // exit forEach loop
      }
      
      const notations = part.expression.split('.')
      const result = notations.reduce((all, shortPart, index) => {
        // Check to see if we are evaluating off a bracket aka "persons[personIndex].name"
        if ( index === 0 && !shortPart.length ) {
          /*endVariables.push({
            isVar: false,
            expression: '.',
          })*/
          lastContext = all
          return all
        }

        if ( shortPart === 'undefined' ) {
          return undefined
        }
        
        dynamicExpression = 'all.' + shortPart

        const newAll = each(
          evalWith(dynamicExpression, {all}, all, true),
          all,
          shortPart,
        )

        lastContext = all

        return newAll
      }, context)

      if ( endVariables.length && endVariables[endVariables.length-1].isEndBracket ) {
        // endVariables.push({isVar: false, expression: '.', value:'.'})
        endVariables.splice(endVariables.length - 1, 1)
      }

      if ( result instanceof Function ) {
        const newValue = result.bind(lastContext)
        endVariables.push({
          expression: part.expression,
          value: newValue,
          isVar: true,
        })
      } else {
        endVariables.push({
          expression: part.expression,
          value: result,
          isVar: true,
        })
      }

      lastContext = result
    } catch (err) {
      console.warn(
        `Error walking expression: ${expression}`,
        err,
        {
          part,
          context,
          variable,
          dynamicExpression,
          endVariables,
        }
      )
      
      throw err
    }
  })

  if ( parsed.length === 1 ) {
    return endVariables[0].value
  }

  const shortContext = {}
  const newString = endVariables.map((parse, index) => {    
    if ( parse.isVar ) {
      const varName = `variable${index}`
      shortContext[varName] = parse.value
      return varName
    }

    return parse.expression
  }).join('')


  try {
    const result = evalWith(newString, shortContext)

    return result
  } catch (err) {
    console.warn(
      `Error evaluating ${expression} with ${newString}`,
      err,
      {shortContext, variable, endVariables}
    )
    throw err
  }
}

function extractAndReplaceStrings(inputString, variables) {
  variables = variables || []
  const newString = inputString.trim().replace(/(['"])(.*?)\1/g, function(match, quoteMark, contents) {
    variables.push(quoteMark + contents + quoteMark);
    return `__${(variables.length - 1)}__`;
  });

  return {
    newString: newString,
    variables,
  };
}

function objectToConsts(obj, objName) {
  return Object.getOwnPropertyNames(obj).map(key => {
    /*if ( obj[key] instanceof Function ) {
      return `let ${key} = ${objName}['${key}'].bind(${objName});\n`
    }*/

    return `let ${key} = ${objName}['${key}'];\n`
  }).join('')
}

function constsToObject(obj, objName) {
  return Object.getOwnPropertyNames(obj).map(key => {    
    return `
      if ( ${objName}['${key}'] != ${key} ) {
        ${objName}['${key}'] = ${key}
      }
    `
  }).join('')
}

function parseExpression(expression) {
  const variables = []
  const noFunctions = extractAndReplaceFunctions(expression, variables)
  const cleansedString = extractAndReplaceStrings(noFunctions.newString, variables)

  const flatOps = [
    '+', '-', '*', '/','?',':','=',
    ',','!',
    //'>',
    //';',
    //'{','}',
    '(',')',
    '[',']',
  ]
  const operators = [
    '\\+', '-', '\\*', '/','\\?',':','=',
    ',','!',
    //'>',
    //';',
    //'\\{','\\}',
    '\\(','\\)',
    '\\[','\\]',
  ];
  const joined = operators.join('|')
  const parts = cleansedString.newString.split(new RegExp(`(${joined})`)).map(x => x.trim()).filter(x => x)

  const result = parts.map(part => {
      const trimmedPart = part.trim();
      const number = Number(trimmedPart)
      const isNum = isNaN(number) ? false : true

      const meta = {
        expression: trimmedPart,
        isVar: !flatOps.includes(trimmedPart) && trimmedPart !== '',
        isNum,
      }

      if ( trimmedPart.search(/__[^_]+__/)>=0 ) {
        meta.value = cleansedString.variables.shift()
        meta.isString = noFunctions.variables.includes(meta.value)
        meta.isVar = meta.isString
        meta.expression = meta.value

        if ( !meta.expression.length ) {
          return
        }
      }

      return meta
  }).filter(x => x)

  return result.filter(part => part.expression !== '');
}
