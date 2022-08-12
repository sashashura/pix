// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CleaCertif... Remove this comment to see the full error message
const CleaCertificationResult = require('../../../lib/domain/models/CleaCertificationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
const { PIX_EMPLOI_CLEA_V1, PIX_EMPLOI_CLEA_V2, PIX_EMPLOI_CLEA_V3 } = require('../../domain/models/Badge').keys;

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
      .where({ certificationCourseId })
      .whereIn('partnerKey', [PIX_EMPLOI_CLEA_V1, PIX_EMPLOI_CLEA_V2, PIX_EMPLOI_CLEA_V3])
      .first();

    if (!result) {
      return CleaCertificationResult.buildNotTaken();
    }
    return CleaCertificationResult.buildFrom(result);
  },
};
