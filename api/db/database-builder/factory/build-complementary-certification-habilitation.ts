// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCenter = require('./build-certification-center');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCompl... Remove this comment to see the full error message
const buildComplementaryCertification = require('./build-complementary-certification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildComplementaryCertificationHabilitation({
  id = databaseBuffer.getNextId(),
  certificationCenterId,
  complementaryCertificationId,
  createdAt = new Date('2020-01-01')
}: $TSFixMe = {}) {
  certificationCenterId = _.isNull(certificationCenterId) ? buildCertificationCenter().id : certificationCenterId;
  complementaryCertificationId = _.isNull(complementaryCertificationId)
    ? buildComplementaryCertification().id
    : complementaryCertificationId;

  const values = {
    id,
    certificationCenterId,
    complementaryCertificationId,
    createdAt,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'complementary-certification-habilitations',
    values,
  });
};
