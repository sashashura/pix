// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../models/Assessment');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getAssessment({
  assessmentId,
  locale,
  assessmentRepository,
  competenceRepository,
  courseRepository,
  campaignRepository
}: $TSFixMe) {
  const assessment = await assessmentRepository.getWithAnswers(assessmentId);

  assessment.title = await _fetchAssessmentTitle({
    assessment,
    locale,
    competenceRepository,
    courseRepository,
    campaignRepository,
  });

  if (assessment.type === Assessment.types.CAMPAIGN) {
    assessment.campaignCode = await campaignRepository.getCampaignCodeByCampaignParticipationId(
      assessment.campaignParticipationId
    );
  }
  return assessment;
};

function _fetchAssessmentTitle({
  assessment,
  locale,
  competenceRepository,
  courseRepository,
  campaignRepository
}: $TSFixMe) {
  switch (assessment.type) {
    case Assessment.types.CERTIFICATION: {
      return assessment.certificationCourseId;
    }

    case Assessment.types.COMPETENCE_EVALUATION: {
      return competenceRepository.getCompetenceName({ id: assessment.competenceId, locale });
    }

    case Assessment.types.DEMO: {
      return courseRepository.getCourseName(assessment.courseId);
    }
    case Assessment.types.PREVIEW: {
      return 'Preview';
    }
    case Assessment.types.CAMPAIGN: {
      return campaignRepository.getCampaignTitleByCampaignParticipationId(assessment.campaignParticipationId);
    }

    default:
      return '';
  }
}
