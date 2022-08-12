// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourseBookshelf = require('../orm-models/CertificationCourse');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCourseNotPublishableError } = require('../../../lib/domain/errors');

async function getAssessmentResultsStatusesBySessionId(id: $TSFixMe) {
  const collection = await CertificationCourseBookshelf.query((qb: $TSFixMe) => {
    qb.innerJoin('assessments', 'assessments.certificationCourseId', 'certification-courses.id');
    qb.innerJoin(
      Bookshelf.knex.raw(
        `"assessment-results" ar ON ar."assessmentId" = "assessments".id
                    and ar."createdAt" = (select max(sar."createdAt") from "assessment-results" sar where sar."assessmentId" = "assessments".id)`
      )
    );
    qb.where({ 'certification-courses.sessionId': id });
  }).fetchAll({ columns: ['status'] });

  return collection.map((obj: $TSFixMe) => obj.attributes.status);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async publishCertificationCoursesBySessionId(sessionId: $TSFixMe) {
    const statuses = await getAssessmentResultsStatusesBySessionId(sessionId);
    if (statuses.includes('error') || statuses.includes('started')) {
      throw new CertificationCourseNotPublishableError();
    }
    await CertificationCourseBookshelf.where({ sessionId }).save(
      { isPublished: true },
      { method: 'update', require: false }
    );
  },

  async unpublishCertificationCoursesBySessionId(sessionId: $TSFixMe) {
    await CertificationCourseBookshelf.where({ sessionId }).save({ isPublished: false }, { method: 'update' });
  },
};
