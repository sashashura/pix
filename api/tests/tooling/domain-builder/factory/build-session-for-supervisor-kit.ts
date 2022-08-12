// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
const SessionForSupervisorKit = require('../../../../lib/domain/read-models/SessionForSupervisorKit');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildSessionForSupervisorKit({
  id = 123,
  examiner = 'Sherlock Holmes',
  address = '22b Baker Street',
  date = '2021-01-01',
  room = '28D',
  time = '14:30',
  accessCode = 'C3H6KL',
  supervisorPassword = '3LME8',
} = {}) {
  return new SessionForSupervisorKit({
    id,
    examiner,
    address,
    date,
    room,
    time,
    accessCode,
    supervisorPassword,
  });
};
