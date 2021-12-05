/* istanbul ignore file */
// lint is not included in coverage
module.exports = {
  extends: '../.eslintrc.yaml',
  rules: {
    'no-restricted-modules': [
      'error',
      {
        paths: [
          {
            name: 'axios',
            message: 'Please use http-agent instead (ADR 23)',
          },
        ],
      },
    ],
  },
};
