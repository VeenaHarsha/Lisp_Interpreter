let validOps = {
  "+": vList => { return vList.reduce((a, b) => a + b); },
  "-": vList => { return vList.reduce((a, b) => a - b); },
  "*": vList => { return vList.reduce((a, b) => a * b); },
  "/": vList => { return vList.reduce((a, b) => a / b); },
  "%": vList => { return vList.reduce((a, b) => a % b); },
};

const isAtom = input => {
  return isNumber(input);
};

const isNumber = input => {
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

const isArithExp = input => {
  let validNumList = [],result;
  if (input.startsWith("(")) {
    input = input.slice(1).trim();
    if (validOps.hasOwnProperty(input[0])) {
      let op = input[0],evRes;
      input = input.slice(1).trim();
      while (input[0] !== ")") {
        evRes = readEvalInput(input);
        if (evRes === null) return null;
        validNumList.push(evRes[0]);
        input = evRes[1].trim();
      }
      if(validNumList.length === 1){
        if(op === "-")  validNumList.unshift("0");
        if(op === "/" || op === "*" || op === "%")  validNumList.unshift("1");
      }
      result = validOps[op](validNumList);
    }
    return [result, input.slice(1)];
  }
  return null;
};

const readEvalInput = input => {
  let evalLispOp = [isAtom, isNumber, isArithExp];
  for (let ev of evalLispOp) {
    let result = ev(input);
    if (result !== null) return result;
  }
  return null;
};

//console.log(readEvalInput("(% 10)"))
//console.log(readEvalInput("( + 3 ( * 2 15 2) (+ 2 2 )) "));
//console.log(readEvalInput("( / 50 ( * 5 2 ) )"));
//console.log(readEvalInput("(+ 7 5 3 ) "));
//console.log(readEvalInput("9"));
console.log(readEvalInput("( / (+ 7 5 3 ) (* 2 5))"));
