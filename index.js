const PACKAGE_URL = 'https://www.npmjs.com/package/eslint-plugin-require-explicit-generics';
let hasWarned = false;

function warnOnce() {
  if (!hasWarned) {
    console.warn('require-explicit-generics was not passed any function or constructor names to check');
    console.warn('Pass an array of function and constructor names or a map of names to expected counts in your .eslintrc.json');
    console.warn('For more details visit: ' + PACKAGE_URL)
    hasWarned = true;
  }
}

function createExpectedCountMap(countMapOrNameList) {
  const expectedCountMap = new Map();
  if (Array.isArray(countMapOrNameList)) {
    countMapOrNameList.forEach(functionName =>
      expectedCountMap.set(functionName, 1)
    );
  } else {
    Object.entries(countMapOrNameList).forEach(([key, value]) =>
      expectedCountMap.set(key, value)
    );
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

function getCalleeNames(node) {
  if (node.callee.name) {
    return [node.callee.name];
  }
  if (("object" in node.callee) && ("property" in node.callee)) {
    const objectName = node.callee.object.name || "";
    const propertyName = node.callee.property.name || "";
    return [
      objectName + "." + propertyName,
      "*." + propertyName,
      propertyName
    ];
  }
  return [];
}

function assertThatNodeHasExpectedGenerics({ context, expectedCountMap, node, nodeType }) {
  const possibleNames = getCalleeNames(node);
  const matchingRuleName = possibleNames.find(possibleName => expectedCountMap.has(possibleName));
  if (!matchingRuleName) return;
  const expectedCount = expectedCountMap.get(matchingRuleName);
  if (!expectedCount) return;

  const actualCount = getParamsLength(node.typeParameters) || getParamsLength(node.typeArguments) || 0;

  const mostSpecificName = possibleNames[0];
  const reportData = {
    nodeType,
    name: mostSpecificName,
    generics: getExampleGenerics(expectedCount),
    expectedCount,
    actualCount,
  };
  if (actualCount === 0) {
    context.report({
      node: node.callee,
      message:
        "{{nodeType}} '{{name}}' must be called with explicit generics. " +
        "Replace with '{{name}}<{{generics}}>(...)' to fix this.",
      data: reportData
    });
  } else if (actualCount < expectedCount) {
    context.report({
      node: node.callee,
      message:
        "{{nodeType}} '{{name}}' called with too few explicit generics. " +
        "Received {{actualCount}}, expected {{expectedCount}}. " +
        "Replace with '{{name}}<{{generics}}>(...)' to fix this.",
      data: reportData
    });
  }
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
        NewExpression: (node) => {
          assertThatNodeHasExpectedGenerics({
            context,
            node,
            expectedCountMap,
            nodeType: "Constructor"
          });
        },
        CallExpression(node) {
          assertThatNodeHasExpectedGenerics({
            context,
            node,
            expectedCountMap,
            nodeType: "Function"
          });
        }
      };
    },
  },
};

module.exports = {
  rules,
};
