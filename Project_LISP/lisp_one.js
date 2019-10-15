const isValidNumber = input => {
  let regX = /^-?[0-9]*\.?[0-9]+([Ee]?[+-]?[0-9]+)?/;
  if (regX.test(input)) {
    let validNum = input.match(regX);
    if (
      !validNum[0].startsWith(0) ||
      (validNum[0].startsWith(0) &&
        (validNum[0].includes(".") || validNum[0].length == 1))
    )
      return [Number(validNum[0]), input.slice(validNum[0].length)];
  }
  return null;
};
let validOps = {
  "+": vList => { return vList.reduce((a, b) => a + b); },
  "-": vList => { return vList.reduce((a, b) => a - b); },
  "*": vList => { return vList.reduce((a, b) => a * b); },
  "/": vList => { return vList.reduce((a, b) => a / b); },
  "%": vList => { return vList.reduce((a, b) => a % b); },
};
const calcArithOps = input => {
   let validNumList = [],
    result;
  if (input.startsWith("(")) {
    input = input.slice(1).trim();
    if (!validOps.hasOwnProperty(input[0])) return null;
    let op = input[0];
    input = input.slice(1).trim();
    while (input[0] !== ")") {
      let validNum = isValidNumber(input);
      validNumList.push(validNum[0]);
      input = validNum[1];
      input = input.trim()
    }
    console.log(validNumList);
    result = validOps[op](validNumList);
  }
  return result;
};

console.log(calcArithOps("( * 3 3 )"));
