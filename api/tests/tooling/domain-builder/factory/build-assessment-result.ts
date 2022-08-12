// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const { status: assessmentResultStatuses } = require('../../../../lib/domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');

const buildAssessmentResult = function ({
  id = 123,
  pixScore = 31,
  reproducibilityRate = 75.5,
  status = assessmentResultStatuses.VALIDATED,
  emitter = 'PIX-ALGO',
  commentForJury = 'Comment for Jury',
  commentForCandidate = 'Comment for Candidate',
  commentForOrganization = 'Comment for Organization',
  createdAt = new Date('2018-01-12T01:02:03Z'),
  juryId = 1,
  assessmentId = 456,
  competenceMarks = [],
} = {}) {
  return new AssessmentResult({
    pixScore,
    reproducibilityRate,
    status,
    emitter,
    commentForJury,
    commentForCandidate,
    commentForOrganization,
    id,
    createdAt,
    juryId,
    assessmentId,
    competenceMarks,
  });
};

buildAssessmentResult.validated = function ({
  id,
  pixScore,
  reproducibilityRate,
  emitter,
  commentForJury,
  commentForCandidate,
  commentForOrganization,
  createdAt,
  juryId,
  assessmentId,
  competenceMarks
}: $TSFixMe = {}) {
  return buildAssessmentResult({
    id,
    pixScore,
    reproducibilityRate,
    status: assessmentResultStatuses.VALIDATED,
    emitter,
    commentForJury,
    commentForCandidate,
    commentForOrganization,
    createdAt,
    juryId,
    assessmentId,
    competenceMarks,
  });
};

buildAssessmentResult.rejected = function ({
  id,
  pixScore,
  reproducibilityRate,
  emitter,
  commentForJury,
  commentForCandidate,
  commentForOrganization,
  createdAt,
  juryId,
  assessmentId,
  competenceMarks
}: $TSFixMe = {}) {
  return buildAssessmentResult({
    id,
    pixScore,
    reproducibilityRate,
    status: assessmentResultStatuses.REJECTED,
    emitter,
    commentForJury,
    commentForCandidate,
    commentForOrganization,
    createdAt,
    juryId,
    assessmentId,
    competenceMarks,
  });
};

buildAssessmentResult.error = function ({
  id,
  pixScore,
  emitter,
  commentForJury,
  commentForCandidate,
  commentForOrganization,
  createdAt,
  juryId,
  assessmentId,
  competenceMarks
}: $TSFixMe = {}) {
  return buildAssessmentResult({
    id,
    pixScore,
    reproducibilityRate: 0,
    status: assessmentResultStatuses.ERROR,
    emitter,
    commentForJury,
    commentForCandidate,
    commentForOrganization,
    createdAt,
    juryId,
    assessmentId,
    competenceMarks,
  });
};

buildAssessmentResult.started = function ({
  id,
  pixScore,
  emitter,
  commentForJury,
  commentForCandidate,
  commentForOrganization,
  createdAt,
  juryId,
  assessmentId,
  competenceMarks
}: $TSFixMe = {}) {
  return buildAssessmentResult({
    id,
    pixScore,
    reproducibilityRate: 0,
    status: Assessment.states.STARTED,
    emitter,
    commentForJury,
    commentForCandidate,
    commentForOrganization,
    createdAt,
    juryId,
    assessmentId,
    competenceMarks,
  });
};

buildAssessmentResult.notTrustable = function ({
  pixScore,
  reproducibilityRate,
  status,
  assessmentId,
  juryId,
  emitter
}: $TSFixMe = {}) {
  return AssessmentResult.buildNotTrustableAssessmentResult({
    pixScore,
    reproducibilityRate,
    status,
    assessmentId,
    juryId,
    emitter,
  });
};

buildAssessmentResult.standard = function ({
  pixScore,
  reproducibilityRate,
  status,
  assessmentId,
  juryId,
  emitter
}: $TSFixMe = {}) {
  return AssessmentResult.buildStandardAssessmentResult({
    pixScore,
    reproducibilityRate,
    status,
    assessmentId,
    juryId,
    emitter,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildAssessmentResult;
