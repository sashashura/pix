// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const { statuses } = require('./Session');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JurySessio... Remove this comment to see the full error message
class JurySession {
  accessCode: $TSFixMe;
  address: $TSFixMe;
  assignedCertificationOfficer: $TSFixMe;
  certificationCenterExternalId: $TSFixMe;
  certificationCenterId: $TSFixMe;
  certificationCenterName: $TSFixMe;
  certificationCenterType: $TSFixMe;
  date: $TSFixMe;
  description: $TSFixMe;
  examiner: $TSFixMe;
  examinerGlobalComment: $TSFixMe;
  finalizedAt: $TSFixMe;
  hasIncident: $TSFixMe;
  hasJoiningIssue: $TSFixMe;
  id: $TSFixMe;
  juryComment: $TSFixMe;
  juryCommentAuthor: $TSFixMe;
  juryCommentedAt: $TSFixMe;
  publishedAt: $TSFixMe;
  resultsSentToPrescriberAt: $TSFixMe;
  room: $TSFixMe;
  time: $TSFixMe;
  constructor({
    id,
    certificationCenterName,
    certificationCenterType,
    certificationCenterId,
    certificationCenterExternalId,
    address,
    room,
    examiner,
    date,
    time,
    accessCode,
    description,
    examinerGlobalComment,
    finalizedAt,
    resultsSentToPrescriberAt,
    publishedAt,
    assignedCertificationOfficer,
    juryComment,
    juryCommentedAt,
    juryCommentAuthor,
    hasIncident,
    hasJoiningIssue
  }: $TSFixMe = {}) {
    this.id = id;
    this.certificationCenterName = certificationCenterName;
    this.certificationCenterType = certificationCenterType;
    this.certificationCenterId = certificationCenterId;
    this.certificationCenterExternalId = certificationCenterExternalId;
    this.address = address;
    this.room = room;
    this.examiner = examiner;
    this.date = date;
    this.time = time;
    this.accessCode = accessCode;
    this.description = description;
    this.examinerGlobalComment = examinerGlobalComment;
    this.finalizedAt = finalizedAt;
    this.resultsSentToPrescriberAt = resultsSentToPrescriberAt;
    this.publishedAt = publishedAt;
    this.assignedCertificationOfficer = assignedCertificationOfficer;
    this.juryComment = juryComment;
    this.juryCommentedAt = juryCommentedAt;
    this.juryCommentAuthor = juryCommentAuthor;
    this.hasIncident = hasIncident;
    this.hasJoiningIssue = hasJoiningIssue;
  }

  get status() {
    if (this.publishedAt) {
      return (statuses as $TSFixMe).PROCESSED;
    }
    if (this.assignedCertificationOfficer) {
      return (statuses as $TSFixMe).IN_PROCESS;
    }
    if (this.finalizedAt) {
      return (statuses as $TSFixMe).FINALIZED;
    }
    return (statuses as $TSFixMe).CREATED;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = JurySession;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.statuses = statuses;
