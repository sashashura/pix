// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEmpty'.
const isEmpty = require('lodash/isEmpty');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NoCertific... Remove this comment to see the full error message
const { NoCertificationResultForDivision } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getScoCertificationResultsByDivision({
  organizationId,
  division,
  scoCertificationCandidateRepository,
  certificationResultRepository
}: $TSFixMe) {
  const candidateIds = await scoCertificationCandidateRepository.findIdsByOrganizationIdAndDivision({
    organizationId,
    division,
  });
  if (isEmpty(candidateIds)) {
    throw new NoCertificationResultForDivision();
  }

  const certificationResults = await certificationResultRepository.findByCertificationCandidateIds({
    certificationCandidateIds: candidateIds,
  });
  if (isEmpty(certificationResults)) {
    throw new NoCertificationResultForDivision();
  }

  return certificationResults;
};
