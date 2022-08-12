// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JuryCertif... Remove this comment to see the full error message
const JuryCertificationSummary = require('../../../../lib/domain/read-models/JuryCertificationSummary');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');

const buildJuryCertificationSummary = function ({
  id = 123,
  firstName = 'Jean',
  lastName = 'Bon',
  status = AssessmentResult.status.VALIDATED,
  pixScore = 100,
  createdAt = new Date('2020-01-01'),
  completedAt = new Date('2020-01-02'),
  abortReason = null,
  isPublished = true,
  isCourseCancelled = false,
  isEndedBySupervisor = false,
  hasSeenEndTestScreen = true,
  complementaryCertificationCourseResults = [],
  certificationIssueReports = [],
} = {}) {
  return new JuryCertificationSummary({
    id,
    firstName,
    lastName,
    status,
    pixScore,
    createdAt,
    completedAt,
    abortReason,
    isPublished,
    isCourseCancelled,
    isEndedBySupervisor,
    hasSeenEndTestScreen,
    complementaryCertificationCourseResults,
    certificationIssueReports,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildJuryCertificationSummary;
