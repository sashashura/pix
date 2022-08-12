// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class SessionData {
  accessCode: $TSFixMe;
  address: $TSFixMe;
  assignedCertificationOfficerId: $TSFixMe;
  certificationCenter: $TSFixMe;
  certificationCenterId: $TSFixMe;
  date: $TSFixMe;
  description: $TSFixMe;
  endTime: $TSFixMe;
  examiner: $TSFixMe;
  examinerGlobalComment: $TSFixMe;
  finalizedAt: $TSFixMe;
  id: $TSFixMe;
  publishedAt: $TSFixMe;
  resultsSentToPrescriberAt: $TSFixMe;
  room: $TSFixMe;
  startTime: $TSFixMe;
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
    finalizedAt,
    resultsSentToPrescriberAt,
    publishedAt,
    certificationCenterId,
    assignedCertificationOfficerId
  }: $TSFixMe) {
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
    this.finalizedAt = finalizedAt;
    this.resultsSentToPrescriberAt = resultsSentToPrescriberAt;
    this.publishedAt = publishedAt;
    this.certificationCenterId = certificationCenterId;
    this.assignedCertificationOfficerId = assignedCertificationOfficerId;
    this.startTime = moment(time, 'HH:mm').format('HH:mm');
    this.endTime = moment(time, 'HH:mm').add(moment.duration(2, 'hours')).format('HH:mm');
    this.date = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
  }

  static fromSession(session: $TSFixMe) {
    return new SessionData(session);
  }
};
