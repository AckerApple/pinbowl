
export function extractAndReplaceFunctions(inputString, variables) {
  variables = variables || []
  // Regular expression to match arrow functions and functions
  const functionRegex = /((\bfunction\s*[A-Za-z0-9_$]*\s*\([^\)]*\)\s*\{[^}]*\})|(\([^\)\()]*\)\s*=>\s*\{[^}]*\}))/g;

  // Replace functions and arrow functions with placeholders
  const replacedString = inputString.replace(functionRegex, (match, contents) => {
      variables.push(contents);
      return `__${(variables.length - 1)}__`;
  });

  return {
    newString: replacedString,
    variables,
  };
}

/*
const x = `player.scores.reduce((all,score) => {
  console.log(all);
  return all + score
})`

const y = extractAndReplaceFunctions(x)

console.log(y)
*/