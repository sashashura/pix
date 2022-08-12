// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCourse = require('./build-certification-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAsses... Remove this comment to see the full error message
const buildAssessment = require('./build-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildCertificationChallenge = require('./build-certification-challenge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAnswe... Remove this comment to see the full error message
const buildAnswer = require('./build-answer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildAnsweredNotCompletedCertificationAssessment({
  certifiableUserId,
  competenceIdSkillIdPairs,
  limitDate
}: $TSFixMe) {
  const certificationCourseId = buildCertificationCourse({
    userId: certifiableUserId,
    createdAt: limitDate,
    isV2Certification: true,
  }).id;
  const certificationAssessment = buildAssessment({
    certificationCourseId,
    userId: certifiableUserId,
    state: Assessment.states.STARTED,
    type: Assessment.types.CERTIFICATION,
    createdAt: limitDate,
  });
  competenceIdSkillIdPairs.forEach((element: $TSFixMe) => {
    const { challengeId, competenceId } = element;
    buildCertificationChallenge({ courseId: certificationCourseId, challengeId, competenceId });
    buildAnswer({ assessmentId: certificationAssessment.id, challengeId, result: 'ok' });
  });

  return certificationAssessment;
};
