// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionSum... Remove this comment to see the full error message
const SessionSummary = require('../../../../lib/domain/read-models/SessionSummary');

const buildSessionSummary = function ({
  id = 123,
  address = '4 avenue du général perlimpimpim',
  room = '28D',
  date = '2021-01-01',
  time = '14:30',
  examiner = 'Flute',
  enrolledCandidatesCount = 5,
  effectiveCandidatesCount = 4,
  status = SessionSummary.statuses.CREATED,
} = {}) {
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
};

buildSessionSummary.created = function ({
  id,
  address,
  room,
  date,
  time,
  examiner,
  enrolledCandidatesCount,
  effectiveCandidatesCount
}: $TSFixMe) {
  return buildSessionSummary({
    id,
    address,
    room,
    date,
    time,
    examiner,
    enrolledCandidatesCount,
    effectiveCandidatesCount,
    status: SessionSummary.statuses.CREATED,
  });
};

buildSessionSummary.finalized = function ({
  id,
  address,
  room,
  date,
  time,
  examiner,
  enrolledCandidatesCount,
  effectiveCandidatesCount
}: $TSFixMe) {
  return buildSessionSummary({
    id,
    address,
    room,
    date,
    time,
    examiner,
    enrolledCandidatesCount,
    effectiveCandidatesCount,
    status: SessionSummary.statuses.FINALIZED,
  });
};

buildSessionSummary.processed = function ({
  id,
  address,
  room,
  date,
  time,
  examiner,
  enrolledCandidatesCount,
  effectiveCandidatesCount
}: $TSFixMe) {
  return buildSessionSummary({
    id,
    address,
    room,
    date,
    time,
    examiner,
    enrolledCandidatesCount,
    effectiveCandidatesCount,
    status: SessionSummary.statuses.PROCESSED,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildSessionSummary;
