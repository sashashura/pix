// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const CacheController = require('./cache-controller');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  server.route([
    {
      method: 'PATCH',
      path: '/api/cache/{model}/{id}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            assign: 'hasRoleSuperAdmin',
          },
        ],
        handler: CacheController.refreshCacheEntry,
        tags: ['api', 'cache'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés avec le rôle Super Admin',
          'Elle permet de mettre à jour une entrée du cache de l’application\n' +
            'Attention : pour un état cohérent des objets stockés en cache, utiliser PATCH /api/cache',
        ],
      },
    },
    {
      method: 'PATCH',
      path: '/api/cache',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            assign: 'hasRoleSuperAdmin',
          },
        ],
        handler: CacheController.refreshCacheEntries,
        tags: ['api', 'cache'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés avec le rôle Super Admin',
          'Elle permet de précharger les entrées du cache de l’application (les requêtes les plus longues)',
        ],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'cache-api';
