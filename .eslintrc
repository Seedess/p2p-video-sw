{
  "parser": "babel-eslint",
  "extends": "airbnb",
  "env": {
    "es6": true,
    "node": true
  },
  "globals": {
    "document": false
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    // Disallow or Enforce Dangling Commas
    // No trailing commas
    // http://eslint.org/docs/rules/comma-dangle
    "comma-dangle": ["error", "never"],
    // Require Function Expressions to have a Name
    // Disable rule. We’re not using function expressions anyway.
    // http://eslint.org/docs/rules/func-names
    "func-names": "off",
    // Enforce consistent linebreak style
    // Disable rule since Git for Windows converts CRLF to LF automatically
    // http://eslint.org/docs/rules/linebreak-style
    "linebreak-style": "off",
    // Require constructor names to begin with a capital letter
    // Disable it since we are using higher order components and these libraries
    // are using capital function names
    // http://eslint.org/docs/rules/new-cap
    "new-cap": "off",
    // Identifies mathematical signs as operators, disable it
    // http://eslint.org/docs/rules/no-mixed-operators
    "no-mixed-operators": "off",
    // Unnecessary to have all object properties in separate lines
    // http://eslint.org/docs/rules/object-property-newline
    "object-property-newline": "off",
    // Require Variable Declarations to be at the top of their scope
    // http://eslint.org/docs/rules/vars-on-top
    // Disable rule. “var” should not be used. This rule does not
    // apply to “let” and “const” anyway.
    "vars-on-top": "off",
    // Disallow the unary operators ++ and --
    // Disable rule since there is no strong reason against them
    // http://eslint.org/docs/rules/no-plusplus
    "no-plusplus": "off",

    // Enforce require() on the top-level module scope (global-require)
    // https://eslint.org/docs/rules/global-require#enforce-require-on-the-top-level-module-scope-global-require
    "global-require": "off",

    // Variables
    "prefer-const": 2,

    // Stylistic rules
    // ---------------

    // Limit Maximum Length of Line
    // http://eslint.org/docs/rules/max-len.html
    "max-len": [2, 120, {
      "ignoreStrings": true,
      "ignoreTemplateLiterals": true,
      "ignoreComments": true,
      "ignoreUrls": true
    }],
    // Disallow or enforce spaces inside of brackets
    // [ 1 ], not [1]
    // http://eslint.org/docs/rules/array-bracket-spacing
    "array-bracket-spacing": ["error", "always"],
    // Disallow or enforce spaces inside of curly braces in objects
    // { a: 1 }, not {a: 1}
    // http://eslint.org/docs/rules/object-curly-spacing
    "object-curly-spacing": ["error", "always"],
    // Disallow or enforce spaces inside of parenthesesx
    // f(1), not f( 1 )
    // http://eslint.org/docs/rules/space-in-parens
    "space-in-parens": ["error", "never"],
    // Require Object Literal Shorthand Syntax
    // { a, b() {} }
    // http://eslint.org/docs/rules/object-shorthand
    "object-shorthand": ["error", "always"],
    // Require parens in arrow function arguments
    // (a) => {}, not a => {}
    // http://eslint.org/docs/rules/arrow-parens
    "arrow-parens": ["error", "always"],
    // Enforce Function Style
    // Function expressions, not declarations
    // f = () => {} or f = function() {}, not function f() {}
    // http://eslint.org/docs/rules/func-style
    "func-style": ["error", "expression", { "allowArrowFunctions": true }],
    // Enforce padding within blocks
    // Disable rule to allow empty lines in blocks
    // http://eslint.org/docs/rules/padded-blocks.html
    "padded-blocks": "off",
    // Require braces in arrow function body
    // Disable rule to allow for () => {} and () => { return () => {} }
    // http://eslint.org/docs/rules/arrow-body-style.html
    "arrow-body-style": "off",

    // React / JSX
    // -----------

    // The following rules overwrite the AirBnB rules for React:
    // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb/rules/react.js

    // Enforce label tags have htmlFor attribute.
    // Disable rule to allow a surrounding label: <label><input /></label>
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for.md
    "jsx-a11y/label-has-for": "off",

    // Enforce quote style for JSX attributes
    // <p title="foo">, not <p title="foo">
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-quotes.md
    "jsx-quotes": ["error", "prefer-single"],

    "react/jsx-one-expression-per-line": "off",

    // Validate closing bracket location in JSX
    // On the same line of the the last prop:
    // <Foo prop1="value"
    //   prop2="value"/>
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
    "react/jsx-closing-bracket-location": ["error", "after-props"],
    // Restrict file extensions that may contain JSX
    // Disable rule since we’re using JSX in .js files
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    "react/jsx-filename-extension": "off",
    // Configure the position of the first property
    // Disable rule
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
    "react/jsx-first-prop-new-line": "off",
    // Prevent missing parentheses around multilines JSX
    // Disable rule to allow for `return <div>\n…\n</div>;`
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md
    "react/jsx-wrap-multilines": "off",
    // Prevent duplicate props in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
    "react/jsx-no-duplicate-props": "error",
    // Prevent usage of findDOMNode
    // Disable rule since using findDOMNode is fine for now and a ref solution isn’t better
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
    "react/no-find-dom-node": "off",
    // Prevent using string references
    // Disable rule since refs are fine for now and the alternative is horrible indirection
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
    "react/no-string-refs": "off",
    // Enforce stateless React Components to be written as a pure function
    // Disable rule because React TestUtils only work well with normal components
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    "react/prefer-stateless-function": "off",
    // Forbid certain propTypes
    // Disable rule to allow PropTypes.array and PropTypes.object
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
    "react/forbid-prop-types": "off",
    // Enforce a defaultProps definition for every optional prop
    // Disable rule
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
    "react/require-default-props": "off",

    // eslint-plugin-import
    // --------------------
    //
    // ESLint plugin with rules that help validate proper imports.

    // Forbid the use of extraneous packages
    // Disable rule. We’re using devDependencies exclusively for the client app.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    "import/no-extraneous-dependencies": "off",

    // Reports use of an exported name as the locally imported name of a
    // default export.
    // Disable rule. Smart components export a default and a name, and the
    // are both imported with the name.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md
    "import/no-named-as-default": "off",

    // Reports use of an exported name as a property on the default export.
    // Disable rule
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default-member.md
    "import/no-named-as-default-member": "off",

    // Ensure imports point to a file/module that can be resolved.
    // Ignore special Webpack loaders
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
    "import/no-unresolved":  ["error", { "ignore": [ "^!!" ] } ],

    // Forbid Webpack loader syntax in imports.
    // Disable rule since we need to use the syntax in some rare cases
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md
    "import/no-webpack-loader-syntax": "off"
  }
}
