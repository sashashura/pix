// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionSum... Remove this comment to see the full error message
const SessionSummary = require('../../../domain/read-models/SessionSummary');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findPaginatedByCertificationCenterId({
    certificationCenterId,
    page
  }: $TSFixMe) {
    const query = knex('sessions')
      .distinct('sessions.id')
      .select({
        id: 'sessions.id',
        address: 'sessions.address',
        room: 'sessions.room',
        date: 'sessions.date',
        time: 'sessions.time',
        examiner: 'sessions.examiner',
        finalizedAt: 'sessions.finalizedAt',
        publishedAt: 'sessions.publishedAt',
        createdAt: 'sessions.createdAt',
      })
      .select(
        knex.raw(
          'COUNT(*) FILTER (WHERE "certification-candidates"."id" IS NOT NULL) OVER (partition by "sessions"."id") AS "enrolledCandidatesCount"'
        ),
        knex.raw(
          'COUNT(*) FILTER (WHERE "certification-courses"."id" IS NOT NULL) OVER (partition by "sessions"."id") AS "effectiveCandidatesCount"'
        )
      )
      .leftJoin('certification-candidates', 'certification-candidates.sessionId', 'sessions.id')
      .leftJoin('certification-courses', function(this: $TSFixMe) {
        this.on('certification-courses.userId', 'certification-candidates.userId').andOn(
          'certification-courses.sessionId',
          'certification-candidates.sessionId'
        );
      })
      .where({ certificationCenterId })
      .orderBy('sessions.date', 'DESC')
      .orderBy('sessions.time', 'DESC')
      .orderBy('sessions.id', 'ASC');

    const { results, pagination } = await fetchPage(query, page);
    const atLeastOneSession = await knex('sessions').select('id').where({ certificationCenterId }).first();
    const hasSessions = Boolean(atLeastOneSession);

    const sessionSummaries = results.map((result: $TSFixMe) => SessionSummary.from(result));
    return { models: sessionSummaries, meta: { ...pagination, hasSessions } };
  },
};
