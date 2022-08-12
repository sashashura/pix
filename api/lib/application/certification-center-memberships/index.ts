// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCenterMembershipController = require('./certification-center-membership-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  server.route([
    {
      method: 'POST',
      path: '/api/certification-center-memberships',
      config: {
        handler: certificationCenterMembershipController.create,
        pre: [
          {
            method: (request: $TSFixMe, h: $TSFixMe) =>
              securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleCertif,
                securityPreHandlers.checkAdminMemberHasRoleSupport,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            '- Création d‘un lien entre un utilisateur et un centre de certification\n',
        ],
        tags: ['api', 'certification-center-membership'],
      },
    },
    {
      method: 'DELETE',
      path: '/api/certification-center-memberships/{id}',
      config: {
        handler: certificationCenterMembershipController.disable,
        pre: [
          {
            method: (request: $TSFixMe, h: $TSFixMe) =>
              securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleCertif,
                securityPreHandlers.checkAdminMemberHasRoleSupport,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        notes: [
          "- **Cette route est restreinte aux utilisateurs ayant les droits d'accès**\n" +
            '- Désactivation d‘un lien entre un utilisateur et un centre de certification\n',
        ],
        tags: ['api', 'certification-center-membership'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'certification-center-memberships-api';
