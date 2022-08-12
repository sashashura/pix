// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildCertificationCandidate = require('./build-certification-candidate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCompl... Remove this comment to see the full error message
const buildComplementaryCertification = require('./build-complementary-certification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildComplementaryCertificationSubscription({
  certificationCandidateId,
  complementaryCertificationId,
  createdAt = new Date('2020-01-01')
}: $TSFixMe = {}) {
  certificationCandidateId = _.isNull(certificationCandidateId)
    ? buildCertificationCandidate().id
    : certificationCandidateId;
  complementaryCertificationId = _.isNull(complementaryCertificationId)
    ? buildComplementaryCertification().id
    : complementaryCertificationId;

  const values = {
    certificationCandidateId,
    complementaryCertificationId,
    createdAt,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'complementary-certification-subscriptions',
    values,
  });
};
