const path = require('path');
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
  overrides: [
    {
      files: 'domain/usecases/**',
      rules: {
        'node/no-restricted-require': [
          'error',
          [
            {
              name: path.resolve(__dirname, 'infrastructure/**'),
              message:
                'Do no refer directly to infrastructure in use-cases, refer do it indirectly by passing reference in arguments from the controller',
            },
          ],
        ],
      },
    },
  ],
};
