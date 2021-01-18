const { merge } = require('webpack-merge');
const common = require('./webpack/webpack.common');

const envs = {
  development: 'dev',
  production: 'prod'
};

module.exports = env => {
  const currentEnv = envs[env.NODE_ENV || 'development'];
  /* eslint-disable global-require,import/no-dynamic-require */
  const envConfig = require(`./webpack/webpack.${currentEnv}.js`);
  return merge(common(env), envConfig);
};
