module.exports = {
  rollup: (config, options) => ({
    ...config,
    ...{
      // Preserve property read side effects during tree shaking
      treeshake: {propertyReadSideEffects: true},
    },
  }),
};
