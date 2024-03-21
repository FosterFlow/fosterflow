// config-overrides.js

module.exports = function override(config, env) {
    // Do stuff with the Webpack config...
    if (env.PRODUCTION === "True") {
      // Disable minification in production by modifying the config:
      config.optimization.minimize = false;
    }
    return config;
  };