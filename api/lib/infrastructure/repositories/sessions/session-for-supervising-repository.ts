// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidateForSupervising = require('../../../domain/models/CertificationCandidateForSupervising');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
const SessionForSupervising = require('../../../domain/read-models/SessionForSupervising');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(idSession: $TSFixMe) {
    const results = await knex
      .select({
        id: 'sessions.id',
        date: 'sessions.date',
        time: 'sessions.time',
        room: 'sessions.room',
        examiner: 'sessions.examiner',
        certificationCenterName: 'certification-centers.name',
        certificationCandidates: knex.raw(`
          json_agg(json_build_object(
            'firstName', "certification-candidates"."firstName",
            'lastName', "certification-candidates"."lastName",
            'birthdate', "certification-candidates"."birthdate",
            'id', "certification-candidates"."id",
            'extraTimePercentage', "certification-candidates"."extraTimePercentage",
            'authorizedToStart', "certification-candidates"."authorizedToStart",
            'assessmentStatus', "assessments"."state"
          ) order by lower("certification-candidates"."lastName"), lower("certification-candidates"."firstName"))
      `),
      })
      .from('sessions')
      .leftJoin('certification-candidates', 'certification-candidates.sessionId', 'sessions.id')
      .leftJoin('certification-courses', function(this: $TSFixMe) {
        this.on('certification-courses.sessionId', '=', 'sessions.id');
        this.on('certification-courses.userId', '=', 'certification-candidates.userId');
      })
      .leftJoin('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
      .innerJoin('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
      .groupBy('sessions.id', 'certification-centers.id')
      .where({ 'sessions.id': idSession })
      .first();
    if (!results) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError("La session n'existe pas");
    }
    return _toDomain(results);
  },
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(results: $TSFixMe) {
  const certificationCandidates = results.certificationCandidates
    .filter((candidate: $TSFixMe) => candidate?.id !== null)
    .map((candidate: $TSFixMe) => new CertificationCandidateForSupervising({ ...candidate }));

  return new SessionForSupervising({
    ...results,
    certificationCandidates: certificationCandidates,
  });
}
