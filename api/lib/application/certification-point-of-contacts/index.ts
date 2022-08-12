// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationPointOfContactController = require('./certification-point-of-contact-controller');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  server.route([
    {
      method: 'GET',
      path: '/api/certification-point-of-contacts/me',
      config: {
        handler: certificationPointOfContactController.get,
        notes: [
          // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
          '- **Cette route est restreinte aux utilisateurs authentifiés*' * '\n' +
            '- Récupération d’un référent de certification.',
        ],
        tags: ['api', 'user', 'certification', 'certification-point-of-contact'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'certification-point-of-contacts-api';
