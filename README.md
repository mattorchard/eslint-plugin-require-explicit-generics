# eslint-plugin-require-explicit-generics
Allow configured functions to require explicit generics.

## Why?
Some libraries are over-permissive with their types, allowing generics to be omitted defaulting them to the `any` type.
To prevent accidentally relying on this behaviour:
this plugin allows you to specify a list of functions and constructors that **MUST** have explicit generics set.

## Example
If you list `myFunction` in your `.eslintrc.js`:
```ts
myFunction(); // ❌ ESLint: Function 'myFunction' must be called with explicit generics...
myFunction<SomeType>(); // ✅ ESLint: Pass
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
Then in the rules section set `"require-explicit-generics/require-explicit-generics"`
pass the log level  (either `"error"` or `"warning"`),
then the list of functions to check.
```js
rules: {
  "require-explicit-generics/require-explicit-generics": [
    "error",
    // List your functions here
    [ "myFunction", "myOtherFunction" ]
  ]
},
```
You can also use a map to define how many generics to expect for each function.
```js
rules: {
  "require-explicit-generics/require-explicit-generics": [
    "error",
    { "myFunction": 1, "myOtherFunction": 2 }
  ]
},
```
```ts
myOtherFunction<TypeA>(); // Function 'myOtherFunction' called with too few explicit generics...
```