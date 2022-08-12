// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfCompetenceMark = require('../orm-models/CompetenceMark');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../../domain/models/CompetenceMark');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(competenceMark: $TSFixMe) {
  return new CompetenceMark(competenceMark);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(competenceMark: $TSFixMe, domainTransaction = DomainTransaction.emptyTransaction()) {
    await competenceMark.validate();
    const savedCompetenceMark = await new BookshelfCompetenceMark(competenceMark).save(null, {
      transacting: domainTransaction.knexTransaction,
    });
    return savedCompetenceMark.toDomainEntity();
  },

  async findByAssessmentResultId(assessmentResultId: $TSFixMe) {
    const competenceMarks = await BookshelfCompetenceMark.where({ assessmentResultId }).fetchAll();
    return competenceMarks.models.map((model: $TSFixMe) => _toDomain(model.attributes));
  },

  async findByCertificationCourseId(certificationCourseId: $TSFixMe) {
    const competenceMarks = await knex
      .select(
        'competence-marks.id',
        'competence-marks.area_code',
        'competence-marks.competence_code',
        'competence-marks.competenceId',
        'competence-marks.level',
        'competence-marks.score',
        'competence-marks.assessmentResultId'
      )
      .from('assessments')
      .join('assessment-results', 'assessments.id', 'assessment-results.assessmentId')
      .leftJoin({ 'latest-assessment-results': 'assessment-results' }, function(this: $TSFixMe) {
        this.on('assessments.id', 'latest-assessment-results.assessmentId').andOn(
          'assessment-results.createdAt',
          '<',
          'latest-assessment-results.createdAt'
        );
      })
      .join('competence-marks', 'assessment-results.id', 'competence-marks.assessmentResultId')
      .whereNull('latest-assessment-results.id')
      .where('assessments.certificationCourseId', certificationCourseId)
      .orderBy('competence-marks.id');

    return competenceMarks.map(_toDomain);
  },
};
