// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getComplementaryCertificationCourseId({
    certificationCourseId,
    complementaryCertificationKey
  }: $TSFixMe) {
    const result = await knex
      .from('complementary-certification-courses')
      .select('complementary-certification-courses.id')
      .innerJoin(
        'complementary-certifications',
        'complementary-certifications.id',
        'complementary-certification-courses.complementaryCertificationId'
      )
      .where({ certificationCourseId, key: complementaryCertificationKey })
      .first();

    return result?.id;
  },
};
