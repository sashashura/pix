// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEndTestS... Remove this comment to see the full error message
async function isEndTestScreenRemovalEnabledByCertificationCenterId(certificationCenterId: $TSFixMe) {
  const result = await knex
    .select(1)
    .from('certification-centers')
    .where({ id: certificationCenterId, isSupervisorAccessEnabled: true })
    .first();

  return Boolean(result);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEndTestS... Remove this comment to see the full error message
async function isEndTestScreenRemovalEnabledBySessionId(sessionId: $TSFixMe) {
  const result = await knex
    .select(1)
    .from('sessions')
    .where({ 'sessions.id': sessionId, isSupervisorAccessEnabled: true })
    .innerJoin('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
    .first();

  return Boolean(result);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEndTestS... Remove this comment to see the full error message
async function isEndTestScreenRemovalEnabledByCandidateId(certificationCandidateId: $TSFixMe) {
  const result = await knex
    .select(1)
    .from('certification-candidates')
    .where({ 'certification-candidates.id': certificationCandidateId, isSupervisorAccessEnabled: true })
    .innerJoin('sessions', 'sessions.id', 'certification-candidates.sessionId')
    .innerJoin('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
    .first();

  return Boolean(result);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEndTestS... Remove this comment to see the full error message
async function isEndTestScreenRemovalEnabledForSomeCertificationCenter() {
  const result = await knex.select(1).from('certification-centers').where({ isSupervisorAccessEnabled: true }).first();

  return Boolean(result);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  isEndTestScreenRemovalEnabledBySessionId,
  isEndTestScreenRemovalEnabledByCandidateId,
  isEndTestScreenRemovalEnabledByCertificationCenterId,
  isEndTestScreenRemovalEnabledForSomeCertificationCenter,
};
