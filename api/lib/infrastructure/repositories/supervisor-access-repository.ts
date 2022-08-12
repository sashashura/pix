// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async create({
    sessionId,
    userId
  }: $TSFixMe) {
    await knex('supervisor-accesses').insert({ sessionId, userId });
  },

  async isUserSupervisorForSession({
    sessionId,
    userId
  }: $TSFixMe) {
    const result = await knex.select(1).from('supervisor-accesses').where({ sessionId, userId }).first();
    return Boolean(result);
  },

  async sessionHasSupervisorAccess({
    sessionId
  }: $TSFixMe) {
    const result = await knex.select(1).from('supervisor-accesses').where({ sessionId }).first();
    return Boolean(result);
  },

  async isUserSupervisorForSessionCandidate({
    supervisorId,
    certificationCandidateId
  }: $TSFixMe) {
    const result = await knex
      .select(1)
      .from('supervisor-accesses')
      .innerJoin('certification-candidates', 'supervisor-accesses.sessionId', 'certification-candidates.sessionId')
      .where({ 'certification-candidates.id': certificationCandidateId, 'supervisor-accesses.userId': supervisorId })
      .first();
    return Boolean(result);
  },
};
