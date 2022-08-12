// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildBadge = require('./build-badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCompl... Remove this comment to see the full error message
const buildComplementaryCertification = require('./build-complementary-certification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildComplementaryCertificationBadge({
  id = databaseBuffer.getNextId(),
  level = 1,
  complementaryCertificationId,
  badgeId,
  createdAt = new Date('2020-01-01'),
  imageUrl = 'http://badge-image-url.fr'
}: $TSFixMe = {}) {
  complementaryCertificationId = _.isNull(complementaryCertificationId)
    ? buildComplementaryCertification().id
    : complementaryCertificationId;
  badgeId = _.isNull(badgeId) ? buildBadge().id : badgeId;

  const values = {
    id,
    level,
    complementaryCertificationId,
    badgeId,
    createdAt,
    imageUrl,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'complementary-certification-badges',
    values,
  });
};
