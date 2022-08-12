// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async addNonEnrolledCandidatesToSession({
    sessionId,
    scoCertificationCandidates
  }: $TSFixMe) {
    const organizationLearnerIds = scoCertificationCandidates.map((candidate: $TSFixMe) => candidate.organizationLearnerId);

    const alreadyEnrolledCandidate = await knex
      .select(['organizationLearnerId'])
      .from('certification-candidates')
      .whereIn('organizationLearnerId', organizationLearnerIds)
      .where({ sessionId });

    const alreadyEnrolledCandidateOrganizationLearnerIds = alreadyEnrolledCandidate.map(
      (candidate: $TSFixMe) => candidate.organizationLearnerId
    );

    const scoCandidateToDTO = _scoCandidateToDTOForSession(sessionId);
    const candidatesToBeEnrolledDTOs = scoCertificationCandidates
      .filter((candidate: $TSFixMe) => !alreadyEnrolledCandidateOrganizationLearnerIds.includes(candidate.organizationLearnerId))
      .map(scoCandidateToDTO);

    await knex.batchInsert('certification-candidates', candidatesToBeEnrolledDTOs);
  },

  async findIdsByOrganizationIdAndDivision({
    organizationId,
    division
  }: $TSFixMe) {
    const rows = await knex
      .select(['certification-candidates.id'])
      .from('certification-candidates')
      .join('organization-learners', 'organization-learners.id', 'certification-candidates.organizationLearnerId')
      .where({
        'organization-learners.organizationId': organizationId,
        'organization-learners.isDisabled': false,
      })
      .whereRaw('LOWER("organization-learners"."division") = ?', division.toLowerCase())
      .orderBy('certification-candidates.lastName', 'ASC')
      .orderBy('certification-candidates.firstName', 'ASC');

    return rows.map((row: $TSFixMe) => row.id);
  },
};

function _scoCandidateToDTOForSession(sessionId: $TSFixMe) {
  return (scoCandidate: $TSFixMe) => {
    return {
      firstName: scoCandidate.firstName,
      lastName: scoCandidate.lastName,
      birthdate: scoCandidate.birthdate,
      organizationLearnerId: scoCandidate.organizationLearnerId,
      sex: scoCandidate.sex,
      birthINSEECode: scoCandidate.birthINSEECode,
      birthCity: scoCandidate.birthCity,
      birthCountry: scoCandidate.birthCountry,
      sessionId,
    };
  };
}
