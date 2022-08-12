// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../../domain/models/ComplementaryCertificationCourseResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getFromComplementaryCertificationCourseId({
    complementaryCertificationCourseId
  }: $TSFixMe) {
    const complementaryCertificationCourseResults = await knex
      .select('complementary-certification-course-results.*')
      .from('complementary-certification-course-results')
      .where({ complementaryCertificationCourseId });

    return complementaryCertificationCourseResults.map((complementaryCertificationCourseResult: $TSFixMe) => ComplementaryCertificationCourseResult.from({
      complementaryCertificationCourseId: complementaryCertificationCourseResult.complementaryCertificationCourseId,
      partnerKey: complementaryCertificationCourseResult.partnerKey,
      acquired: complementaryCertificationCourseResult.acquired,
      source: complementaryCertificationCourseResult.source,
    })
    );
  },

  async save({
    complementaryCertificationCourseId,
    partnerKey,
    acquired,
    source
  }: $TSFixMe) {
    return knex('complementary-certification-course-results')
      .insert({ partnerKey, acquired, complementaryCertificationCourseId, source })
      .onConflict(['complementaryCertificationCourseId', 'source'])
      .merge();
  },
};
