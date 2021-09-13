let hasWarned = false;

function warnOnce() {
  if (!hasWarned) {
    console.warn(`require-explicit-generics was given no method names to check and will not produce any warnings`);
    hasWarned = true;
  }
}

function hasParams(item) {
  if (!item) return;
  return item.length || (item.params && item.params.length)
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
      const functionsRequiringExplicitGenerics = new Set(context.options);

      return {
        CallExpression(node) {
          const hasExplicitGenerics = hasParams(node.typeParameters) || hasParams(node.typeArguments);
          const functionName = node.callee.name
          if (
            !hasExplicitGenerics &&
            functionsRequiringExplicitGenerics.has(functionName)
          ) {
            context.report({
              node: node.callee,
              message:
                "Function '{{functionName}}' called without explicit generics. " +
                "Replace with '{{functionName}}<SomeType>(...)' to fix this.",
              data: {functionName}
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