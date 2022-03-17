module.exports = {
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      rules: {
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
  ],
};
