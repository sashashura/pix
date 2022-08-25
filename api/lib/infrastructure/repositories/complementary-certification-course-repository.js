const { knex } = require('../../../db/knex-database-connection');
const ComplementaryCertificationCourse = require('../../domain/models/ComplementaryCertificationCourse');

module.exports = {
  async getComplementaryCertificationCourseId({ certificationCourseId, complementaryCertificationKey }) {
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

  async findComplementaryCertificationCourses({ certificationCourseId }) {
    const results = await knex
      .select('complementary-certification-courses.*')
      .from('complementary-certification-courses')
      .innerJoin(
        'complementary-certifications',
        'complementary-certifications.id',
        'complementary-certification-courses.complementaryCertificationId'
      )
      .where({ certificationCourseId })
      .orderBy('complementary-certification-courses.id');

    return results.map(_toDomain);
  },
};

function _toDomain(result) {
  return new ComplementaryCertificationCourse(result);
}
