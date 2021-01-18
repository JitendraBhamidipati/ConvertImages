module.exports = api => {
  const babelEnv = api.env();
  api.cache(true);
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            'ie >= 11',
            'last 2 Chrome versions',
            'last 2 Firefox versions',
            'last 2 Safari versions',
            'last 2 ChromeAndroid versions',
            'last 2 Edge versions',
            'last 2 iOS versions'
          ]
        },
        useBuiltIns: 'entry',
        corejs: '3.0.0'
      }
    ],
    '@babel/preset-react'
  ];
  const plugins = [
    '@babel/transform-react-constant-elements',
    'transform-react-remove-prop-types',
    '@babel/plugin-transform-runtime',

    // Stage 2 https://github.com/babel/babel/tree/master/packages/babel-preset-stage-2
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',

    // Stage 3
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-json-strings'
  ];

  if (babelEnv === 'production') {
    plugins.push(['@babel/plugin-transform-react-inline-elements']);
  }

  return {
    presets,
    plugins
  };
};
