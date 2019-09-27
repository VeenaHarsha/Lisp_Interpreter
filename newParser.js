const nullParser = input => {
  if (!input.startsWith("null")) return null;
  return [null, input.slice(4)];
};
const boolParser = input => {
  if (input.startsWith(true)) return [true, input.slice(4)];
  if (input.startsWith(false)) return [false, input.slice(5)];
  return null;
};
const commaParser = input => {
  if (input.startsWith(",")) return [, input.slice(1)];
  return null;
};
const numParser = input => {
  let regX = /(^-?[0-9]*\.?[0-9]+[Ee]?[-+]?[0-9]*)/;
  if (regX.test(input)) {
    let validNum = input.match(regX);
    if (
      !(input.startsWith(0) && input.includes(".")) ||
      !input.startsWith(".") ||
      (input.startsWith(0) && input.includes(".") && validNum[0].length > 0)
    ) {
      return [Number(validNum[0]), input.slice(validNum[0].length)];
    }
  }
  return null;
};
const stringParser = input => {
  let spChars = {
      "\\n": "\n",
      "\\r": "\r",
      "\\t": "\t",
      "\\f": "\f",
      "\\b": "\b",
      "\\": "\\",
      "/": "/",
      '"': '"',
    },
    validStr = [];
  if (input.startsWith('"')) {
    input = input.slice(1);
    while (input[0] !== '"') {
      if (input[0] === "\\") {
        let spCh = input.slice(0, 2);
        if (spChars.hasOwnProperty(spCh)) {
          validStr.push(spChars[spCh]);
          input = input.slice(2);
        } else if (input[1] === "u") {
          input = input.slice(2);
          if (input.length <= 4) {
            return null;
          } else {
            let hexInput = input.slice(0, 4);
            if (hexInput.match(/[0-9]*[A-F]*[a-f]*/)) {
              validStr.push(String.fromCharCode(parseInt(hexInput, 16)));
            }
            input = input.slice(4);
          }
        }
      } else {
        validStr.push(input[0]);
        input = input.slice(1);
      }
    }
    return [validStr.join(""), input.slice(1)];
  }
  return null;
};
const arrayParser = input => {
  let validArray = [],
    parsedInput;
  input = input.trim();
  if (input.startsWith("[")) {
    input = input.slice(1);
    while (input[0] !== "]") {
      parsedInput = parseAll(input);
      if (parsedInput[0] !== undefined) validArray.push(parsedInput[0]);
      input = parsedInput[1];
    }
    return [validArray, input.slice(1)];
  }
  return null;
};

const objectParser = function(input) {
  let validInput = [];
  input = input.trim();
  if (input.startsWith("{")) {
    input = input.slice(1);
    input = input.trim();
    // while(input !== "}"){
    //we have to split keyvalue pair not array elements
    console.log(input.includes("[") + "::" + input.indexOf("]"));
    if (input.includes("[")) {
      let bIndex = input.indexOf("[");
      let lIndex = input.indexOf("]");
      console.log(input.substring(bIndex, lIndex + 1));
    }
    let items = input.split(",");
    items.forEach(ele => {
      ele = ele.trim();
      // ele = wsParser(ele);
      let keyValPair = ele.split(":");
      let key = keyValPair[0].trim();
      let value = keyValPair[1].trim();
      console.log("ele is :" + ele);
      let keyResult = stringParser(key.toString());
      let valResult = "";
      if (value.startsWith("[")) {
        valResult = arrayParser(value.toString());
        validInput.push(
          keyResult[0].toString() + ":" + valResult[0].toString()
        );
      } else {
        value = keyValPair[1].trim();
        valResult =
          stringParser(value.toString()) ||
          numParser(value.toString()) ||
          boolParser(value.toString()) ||
          nullParser(value.toString());
        validInput.push(
          keyResult[0].toString() + ":" + valResult[0].toString()
        );
      }
    });
    return validInput;
    //    input = input.slice(1);
    //  }
  }
  return null;
};

let fs = require("fs");
let inputFile = fs.readFileSync(
  "/home/veena/Documents/JSScripts/A_Projects/parser/inputFile.json",
  "UTF-8"
);
function parseAll(input) {
  let arrParsers = [
    numParser,
    nullParser,
    boolParser,
    stringParser,
    commaParser,
    arrayParser,
  ];
  for (let parse of arrParsers) {
    let result = parse(input);
    if (result !== null) return result;
  }
}
console.log(parseAll(inputFile));
