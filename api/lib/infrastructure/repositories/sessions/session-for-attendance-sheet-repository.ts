// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
const SessionForAttendanceSheet = require('../../../domain/read-models/SessionForAttendanceSheet');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidateForAttendanceSheet = require('../../../domain/read-models/CertificationCandidateForAttendanceSheet');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getWithCertificationCandidates(idSession: $TSFixMe) {
    const results = await knex
      .select(
        'sessions.id',
        'sessions.date',
        'sessions.time',
        'sessions.address',
        'sessions.room',
        'sessions.examiner',
        'certification-centers.name as certificationCenterName',
        'certification-centers.type as certificationCenterType',
        'organizations.isManagingStudents'
      )
      .select({
        certificationCandidates: knex.raw(`
        json_agg(json_build_object(
        'firstName', "certification-candidates"."firstName",
        'lastName', "certification-candidates"."lastName",
        'birthdate', "certification-candidates"."birthdate",
        'externalId', "certification-candidates"."externalId",
        'extraTimePercentage', "certification-candidates"."extraTimePercentage",
        'division', "organization-learners".division)
        order by lower("certification-candidates"."lastName"), lower("certification-candidates"."firstName"))
        `),
      })
      .from('sessions')
      .join('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
      .leftJoin('organizations', function(this: $TSFixMe) {
        this.on('organizations.externalId', 'certification-centers.externalId').andOn(
          'organizations.type',
          'certification-centers.type'
        );
      })
      .leftJoin('certification-candidates', 'certification-candidates.sessionId', 'sessions.id')
      .leftJoin('organization-learners', 'organization-learners.id', 'certification-candidates.organizationLearnerId')
      .groupBy('sessions.id', 'certification-centers.id', 'organizations.id')
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
  const toDomainCertificationCandidates = results.certificationCandidates.map((candidate: $TSFixMe) => {
    return new CertificationCandidateForAttendanceSheet({ ...candidate });
  });

  return new SessionForAttendanceSheet({
    ...results,
    isOrganizationManagingStudents: results.isManagingStudents,
    certificationCandidates: toDomainCertificationCandidates,
  });
}
