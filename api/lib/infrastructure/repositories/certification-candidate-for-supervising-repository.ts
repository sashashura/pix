// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidateForSupervising = require('../../domain/models/CertificationCandidateForSupervising');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(certificationCandidateId: $TSFixMe) {
    const result = await knex('certification-candidates')
      .select('certification-candidates.*', 'assessments.state AS assessmentStatus')
      .leftJoin('certification-courses', function(this: $TSFixMe) {
        this.on('certification-courses.sessionId', '=', 'certification-candidates.sessionId');
        this.on('certification-courses.userId', '=', 'certification-candidates.userId');
      })
      .leftJoin('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
      .where({ 'certification-candidates.id': certificationCandidateId })
      .first();
    return new CertificationCandidateForSupervising({ ...result });
  },

  async update(certificationCandidateForSupervising: $TSFixMe) {
    const result = await knex('certification-candidates')
      .where({
        id: certificationCandidateForSupervising.id,
      })
      .update({ authorizedToStart: certificationCandidateForSupervising.authorizedToStart });

    if (result === 0) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError('Aucun candidat trouvé');
    }
  },
};
