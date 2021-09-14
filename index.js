const PACKAGE_URL = 'https://www.npmjs.com/package/eslint-plugin-require-explicit-generics';
let hasWarned = false;

function warnOnce() {
  if (!hasWarned) {
    console.warn('require-explicit-generics was not passed any function names to check');
    console.warn('Pass an array of function names or a map of names to expected counts in your .eslintrc.json');
    console.warn('For more details visit: ' + PACKAGE_URL)
    hasWarned = true;
  }
}

function createExpectedCountMap(countMapOrNameList) {
  if (!Array.isArray(countMapOrNameList)) {
    return countMapOrNameList;
  }
  const expectedCountMap = {};
  for (const functionName of countMapOrNameList) {
    expectedCountMap[functionName] = 1;
  }
  return expectedCountMap;
}

function getParamsLength(item) {
  if (!item) return;
  return item.length || (item.params && item.params.length);
}

const ASCII_A_OFFSET = 65;

function getLetterOfAlphabet(index) {
  return String.fromCharCode(ASCII_A_OFFSET + index % 26);
}

function getExampleGenerics(count) {
  if (count === 1) {
    return "SomeType";
  }
  const values = [];
  for (let index = 0; index < count; index += 1) {
    values.push("Type" + getLetterOfAlphabet(index));
  }
  return values.join(", ");
}

const rules = {
  "require-explicit-generics": {
    meta: {
      type: "problem"
    },
    create: function (context) {
      if (context.options.length === 0) {
        warnOnce();
        return {};
      }

      const expectedCountMap = createExpectedCountMap(context.options[0]);

      return {
        CallExpression(node) {
          const functionName = node.callee.name;
          const expectedCount = expectedCountMap[functionName];
          if (!expectedCount) return;

          const actualCount = getParamsLength(node.typeParameters) || getParamsLength(node.typeArguments) || 0;
          const generics = getExampleGenerics(expectedCount);
          if (actualCount === 0) {
            context.report({
              node: node.callee,
              message:
                "Function '{{functionName}}' must be called with explicit generics. " +
                "Replace with '{{functionName}}<{{generics}}>(...)' to fix this.",
              data: {functionName, generics}
            });
          } else if (
            actualCount < expectedCount
          ) {
            context.report({
              node: node.callee,
              message:
                "Function '{{functionName}}' called with too few explicit generics. " +
                "Received {{actualCount}}, expected {{expectedCount}}. " +
                "Replace with '{{functionName}}<{{generics}}>(...)' to fix this.",
              data: {functionName, generics, expectedCount, actualCount}
            });
          }
        }
      };
    },
  },
};

module.exports = {
  rules,
};