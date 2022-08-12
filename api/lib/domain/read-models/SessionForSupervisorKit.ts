// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
class SessionForSupervisorKit {
  accessCode: $TSFixMe;
  address: $TSFixMe;
  date: $TSFixMe;
  examiner: $TSFixMe;
  id: $TSFixMe;
  room: $TSFixMe;
  supervisorPassword: $TSFixMe;
  time: $TSFixMe;
  constructor({
    id,
    date,
    time,
    address,
    room,
    examiner,
    accessCode,
    supervisorPassword
  }: $TSFixMe) {
    this.id = id;
    this.date = date;
    this.time = time;
    this.address = address;
    this.room = room;
    this.examiner = examiner;
    this.accessCode = accessCode;
    this.supervisorPassword = supervisorPassword;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SessionForSupervisorKit;
