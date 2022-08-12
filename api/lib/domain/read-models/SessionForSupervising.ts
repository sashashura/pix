// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
class SessionForSupervising {
  certificationCandidates: $TSFixMe;
  certificationCenterName: $TSFixMe;
  date: $TSFixMe;
  examiner: $TSFixMe;
  id: $TSFixMe;
  room: $TSFixMe;
  time: $TSFixMe;
  constructor({
    id,
    date,
    time,
    examiner,
    certificationCenterName,
    room,
    certificationCandidates
  }: $TSFixMe = {}) {
    this.id = id;
    this.date = date;
    this.time = time;
    this.examiner = examiner;
    this.certificationCenterName = certificationCenterName;
    this.room = room;
    this.certificationCandidates = certificationCandidates;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SessionForSupervising;
