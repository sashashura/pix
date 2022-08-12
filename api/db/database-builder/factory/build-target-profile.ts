// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildTargetProfile({
  id = databaseBuffer.getNextId(),
  name = 'Remplir un tableur',
  imageUrl = 'https://images.pix.fr/profil-cible/Illu_GEN.svg',
  isPublic = true,
  isSimplifiedAccess = false,
  ownerOrganizationId,
  createdAt = new Date('2020-01-01'),
  outdated = false,
  description = null,
  comment = null,
  category = 'OTHER'
}: $TSFixMe = {}) {
  ownerOrganizationId = _.isUndefined(ownerOrganizationId) ? buildOrganization().id : ownerOrganizationId;

  const values = {
    id,
    name,
    imageUrl,
    isPublic,
    isSimplifiedAccess,
    ownerOrganizationId,
    createdAt,
    outdated,
    description,
    comment,
    category,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'target-profiles',
    values,
  });
};
