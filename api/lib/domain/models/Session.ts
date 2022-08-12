// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
const config = require('../../config');

const CREATED = 'created';
const FINALIZED = 'finalized';
const IN_PROCESS = 'in_process';
const PROCESSED = 'processed';

const availableCharactersForPasswordGeneration =
  `${config.availableCharacterForCode.numbers}${config.availableCharacterForCode.letters}`.split('');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NB_CHAR'.
const NB_CHAR = 5;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  CREATED,
  FINALIZED,
  IN_PROCESS,
  PROCESSED,
};

const NO_EXAMINER_GLOBAL_COMMENT = null;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Session'.
class Session {
  accessCode: $TSFixMe;
  address: $TSFixMe;
  assignedCertificationOfficerId: $TSFixMe;
  certificationCandidates: $TSFixMe;
  certificationCenter: $TSFixMe;
  certificationCenterId: $TSFixMe;
  date: $TSFixMe;
  description: $TSFixMe;
  examiner: $TSFixMe;
  examinerGlobalComment: $TSFixMe;
  finalizedAt: $TSFixMe;
  hasIncident: $TSFixMe;
  hasJoiningIssue: $TSFixMe;
  id: $TSFixMe;
  publishedAt: $TSFixMe;
  resultsSentToPrescriberAt: $TSFixMe;
  room: $TSFixMe;
  supervisorPassword: $TSFixMe;
  time: $TSFixMe;
  constructor({
    id,
    accessCode,
    address,
    certificationCenter,
    date,
    description,
    examiner,
    room,
    time,
    examinerGlobalComment,
    hasIncident,
    hasJoiningIssue,
    finalizedAt,
    resultsSentToPrescriberAt,
    publishedAt,
    certificationCandidates,
    certificationCenterId,
    assignedCertificationOfficerId,
    supervisorPassword
  }: $TSFixMe = {}) {
    this.id = id;
    this.accessCode = accessCode;
    this.address = address;
    this.certificationCenter = certificationCenter;
    this.date = date;
    this.description = description;
    this.examiner = examiner;
    this.room = room;
    this.time = time;
    this.examinerGlobalComment = examinerGlobalComment;
    this.hasIncident = hasIncident;
    this.hasJoiningIssue = hasJoiningIssue;
    this.finalizedAt = finalizedAt;
    this.resultsSentToPrescriberAt = resultsSentToPrescriberAt;
    this.publishedAt = publishedAt;
    this.certificationCandidates = certificationCandidates;
    this.certificationCenterId = certificationCenterId;
    this.assignedCertificationOfficerId = assignedCertificationOfficerId;
    this.supervisorPassword = supervisorPassword;
  }

  areResultsFlaggedAsSent() {
    return !_.isNil(this.resultsSentToPrescriberAt);
  }

  get status() {
    if (this.publishedAt) {
      return (statuses as $TSFixMe).PROCESSED;
    }
    if (this.assignedCertificationOfficerId) {
      return (statuses as $TSFixMe).IN_PROCESS;
    }
    if (this.finalizedAt) {
      return (statuses as $TSFixMe).FINALIZED;
    }
    return (statuses as $TSFixMe).CREATED;
  }

  isPublished() {
    return this.publishedAt !== null;
  }

  isAccessible() {
    return this.status === (statuses as $TSFixMe).CREATED;
  }

  generateSupervisorPassword() {
    this.supervisorPassword = _.times(NB_CHAR, _randomCharacter).join('');
  }

  isSupervisable(supervisorPassword: $TSFixMe) {
    return this.supervisorPassword === supervisorPassword;
  }

  canEnrollCandidate() {
    return _.isNull(this.finalizedAt);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Session;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.statuses = statuses;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.NO_EXAMINER_GLOBAL_COMMENT = NO_EXAMINER_GLOBAL_COMMENT;

// @ts-expect-error TS(2393): Duplicate function implementation.
function _randomCharacter() {
  return _.sample(availableCharactersForPasswordGeneration);
}
