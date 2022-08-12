// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const { statuses } = require('../models/Session');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionSum... Remove this comment to see the full error message
class SessionSummary {
  static statuses = {
    CREATED: (statuses as $TSFixMe).CREATED,
    FINALIZED: (statuses as $TSFixMe).FINALIZED,
    PROCESSED: (statuses as $TSFixMe).PROCESSED,
};

  address: $TSFixMe;
  date: $TSFixMe;
  effectiveCandidatesCount: $TSFixMe;
  enrolledCandidatesCount: $TSFixMe;
  examiner: $TSFixMe;
  id: $TSFixMe;
  room: $TSFixMe;
  status: $TSFixMe;
  time: $TSFixMe;

  constructor({
    id,
    address,
    room,
    date,
    time,
    examiner,
    enrolledCandidatesCount,
    effectiveCandidatesCount,
    status
  }: $TSFixMe = {}) {
    this.id = id;
    this.address = address;
    this.room = room;
    this.date = date;
    this.time = time;
    this.examiner = examiner;
    this.enrolledCandidatesCount = enrolledCandidatesCount;
    this.effectiveCandidatesCount = effectiveCandidatesCount;
    this.status = status;
  }

  static from({
    id,
    address,
    room,
    date,
    time,
    examiner,
    enrolledCandidatesCount,
    effectiveCandidatesCount,
    finalizedAt,
    publishedAt
  }: $TSFixMe) {
    const status = _computeStatus({
      finalizedAt,
      publishedAt,
    });

    return new SessionSummary({
      id,
      address,
      room,
      date,
      time,
      examiner,
      enrolledCandidatesCount,
      effectiveCandidatesCount,
      status,
    });
  }
}

function _computeStatus({
  finalizedAt,
  publishedAt
}: $TSFixMe) {
  if (publishedAt) {
    return (statuses as $TSFixMe).PROCESSED;
  }
  if (finalizedAt) {
    return (statuses as $TSFixMe).FINALIZED;
  }
  return (statuses as $TSFixMe).CREATED;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SessionSummary;
