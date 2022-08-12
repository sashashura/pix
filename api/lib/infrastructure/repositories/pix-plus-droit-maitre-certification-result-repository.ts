// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixPlusDro... Remove this comment to see the full error message
const PixPlusDroitMaitreCertificationResult = require('../../../lib/domain/models/PixPlusDroitMaitreCertificationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
const { PIX_DROIT_MAITRE_CERTIF } = require('../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get({
    certificationCourseId
  }: $TSFixMe) {
    const result = await knex
      .select('acquired')
      .from('complementary-certification-course-results')
      .innerJoin(
        'complementary-certification-courses',
        'complementary-certification-courses.id',
        'complementary-certification-course-results.complementaryCertificationCourseId'
      )
      .where({ certificationCourseId, partnerKey: PIX_DROIT_MAITRE_CERTIF })
      .first();

    if (!result) {
      return PixPlusDroitMaitreCertificationResult.buildNotTaken();
    }
    return PixPlusDroitMaitreCertificationResult.buildFrom(result);
  },
};
