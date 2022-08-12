// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
const SessionForSupervisorKit = require('../../../domain/read-models/SessionForSupervisorKit');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(idSession: $TSFixMe) {
    const results = await knex
      .select(
        'sessions.id',
        'sessions.date',
        'sessions.time',
        'sessions.address',
        'sessions.room',
        'sessions.examiner',
        'sessions.accessCode',
        'sessions.supervisorPassword'
      )
      .from('sessions')
      .where({ 'sessions.id': idSession })
      .first();

    return _toDomain(results);
  },
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(results: $TSFixMe) {
  return new SessionForSupervisorKit({
    ...results,
  });
}
