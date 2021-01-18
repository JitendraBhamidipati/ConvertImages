module.exports = {
  parser: 'babel-eslint',
  plugins: ['react', 'prettier'],
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
    'prettier/react',
    'plugin:import/errors'
  ],
  globals: {
    React: true,
    document: true,
    window: true,
    jQuery: true,
    $: true,
    localStorage: true,
    fetch: true
  },
  root: true,
  rules: {
    indent: ['error', 2],
    'react/prefer-stateless-function': 'warn',
    'react/self-closing-comp': [
      'warn',
      {
        component: true,
        html: false
      }
    ],
    'react/sort-comp': [
      1,
      {
        order: ['static-methods', 'lifecycle', 'everything-else', 'rendering'],
        groups: {
          rendering: ['/^render.+$/', 'render']
        }
      }
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id']
        }
      }
    ],
    'react/require-default-props': 0,
    'react/forbid-prop-types': [
      1,
      {
        forbid: ['any']
      }
    ],
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/anchor-is-valid': [
      'warn',
      {
        aspects: ['invalidHref']
      }
    ],
    'react/jsx-boolean-value': ['warn', 'never'],
    'react/jsx-closing-bracket-location': ['warn'],
    'react/jsx-curly-spacing': ['warn', 'never'],
    'react/jsx-props-no-spreading': 0,
    'react/jsx-fragments': [1, 'element'],
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.jsx', '.js']
      }
    ],
    'react/jsx-first-prop-new-line': ['warn', 'multiline'],
    'react/jsx-indent': ['warn', 2],
    'comma-dangle': ['error', 'never'],
    'react/jsx-key': 'error',
    'react/jsx-indent-props': 0,
    'no-trailing-spaces': [
      2,
      {
        skipBlankLines: true
      }
    ],
    'prefer-template': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'babel/object-curly-spacing': 0,
    'import/no-named-as-default': 0
  },
  env: {
    es6: true,
    browser: true,
    node: true
  }
};
