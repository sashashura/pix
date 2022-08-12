// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceEvaluation = require('../../../../lib/domain/models/CompetenceEvaluation');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildAssessment = require('./build-assessment');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildUser = require('./build-user');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCompetenceEvaluation({
  id = 1,
  assessmentId,
  assessment,
  status = 'started',
  userId = buildUser().id,
  competenceId = 'recsvLz0W2ShyfD63',
  createdAt = new Date('2020-01-01'),
  updatedAt = new Date('2020-02-01')
}: $TSFixMe = {}) {
  if (assessment && !assessmentId) {
    assessmentId = assessment.id;
  }
  if (assessmentId && !assessment) {
    assessment = buildAssessment({ id: assessmentId });
  }
  if (!assessmentId && !assessment) {
    assessment = buildAssessment();
    assessmentId = assessment.id;
  }

  return new CompetenceEvaluation({
    id,
    assessmentId,
    userId,
    competenceId,
    createdAt,
    updatedAt,
    assessment,
    status,
  });
};
