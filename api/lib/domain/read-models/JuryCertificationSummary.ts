// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const { status: assessmentResultStatuses } = require('../models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getLabelBy... Remove this comment to see the full error message
const { getLabelByBadgeKey } = require('./CertifiableBadgeLabels');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STARTED'.
const STARTED = 'started';
const CANCELLED = 'cancelled';
const ENDED_BY_SUPERVISOR = 'endedBySupervisor';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JuryCertif... Remove this comment to see the full error message
class JuryCertificationSummary {
  certificationIssueReports: $TSFixMe;
  complementaryCertificationTakenLabels: $TSFixMe;
  completedAt: $TSFixMe;
  createdAt: $TSFixMe;
  firstName: $TSFixMe;
  hasSeenEndTestScreen: $TSFixMe;
  id: $TSFixMe;
  isFlaggedAborted: $TSFixMe;
  isPublished: $TSFixMe;
  lastName: $TSFixMe;
  pixScore: $TSFixMe;
  status: $TSFixMe;
  constructor({
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
    certificationIssueReports
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.status = _getStatus(status, isCourseCancelled, isEndedBySupervisor);
    this.pixScore = pixScore;
    this.isFlaggedAborted = Boolean(abortReason) && !completedAt;
    this.complementaryCertificationTakenLabels = this._buildLabels(complementaryCertificationCourseResults);
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.isPublished = isPublished;
    this.hasSeenEndTestScreen = hasSeenEndTestScreen;
    this.certificationIssueReports = certificationIssueReports;
  }

  isActionRequired() {
    return this.certificationIssueReports.some((issueReport: $TSFixMe) => issueReport.isImpactful && !issueReport.isResolved());
  }

  hasScoringError() {
    return this.status === (JuryCertificationSummary as $TSFixMe).statuses.ERROR;
  }

  hasCompletedAssessment() {
    return this.status !== (JuryCertificationSummary as $TSFixMe).statuses.STARTED;
  }

  _buildLabels(complementaryCertificationCourseResults: $TSFixMe) {
    return complementaryCertificationCourseResults
      ?.filter((complementaryCertificationCourseResult: $TSFixMe) => complementaryCertificationCourseResult.isFromPixSource())
      .map(({
      partnerKey
    }: $TSFixMe) => getLabelByBadgeKey(partnerKey));
  }
}

function _getStatus(status: $TSFixMe, isCourseCancelled: $TSFixMe, isEndedBySupervisor: $TSFixMe) {
  if (isCourseCancelled) {
    return CANCELLED;
  }

  if (isEndedBySupervisor) {
    return ENDED_BY_SUPERVISOR;
  }

  if (!Object.values(assessmentResultStatuses).includes(status)) {
    return STARTED;
  }

  return status;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = JuryCertificationSummary;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.statuses = { ...assessmentResultStatuses, STARTED, ENDED_BY_SUPERVISOR };
