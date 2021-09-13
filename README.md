# eslint-plugin-require-explicit-generics
Allow configured functions to require explicit generics.

## Why?
Some libraries are over-permissive with their types, allowing generics to be omitted defaulting them to the `any` type.
To prevent accidentally relying on this behaviour:
this plugin allows you to specify a list of functions that **MUST** have explicit generics set.

## Example
If you list `myFunction` in your `.eslintrc.js`:
```ts
myFunction(); // ❌ ESLint: Function 'myFunction' called without explicit generics...
myFunction<SomeType>(); // ✔ ESLint: Pass
```

## Installation
First install [ESLint](http://eslint.org/):
```shell
# npm 
npm install eslint --save-dev
# yarn 
yarn add eslint --dev
```
Next, install `eslint-plugin-require-explicit-generics`
```shell
# npm
npm install eslint-plugin-require-explicit-generics --save-dev
# yarn
yarn add eslint-plugin-require-explicit-generics --dev
```

## Configuration (REQUIRED)
In your `.estlintrc.js` add `"require-explicit-generics"` to the plugin list.
```js
plugins: [
  "require-explicit-generics",
],
```
Then in the rules section set `"require-explicit-generics/require-explicit-generics"` to an array,
with the first value being a log-level (either `"error"` or `"warning"`)
and all other values being functions that should be checked.
```js
rules: {
  "require-explicit-generics/require-explicit-generics": [
    // Log level
    "error",
    // List your functions here
    "myFunction",
    "myOtherFunction"
  ]
},
```

If you omit this configuration running eslint will warn:
```shell
require-explicit-generics was given no method names to check and will not produce any warnings
```