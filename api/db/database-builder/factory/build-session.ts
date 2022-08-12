// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCenter = require('./build-certification-center');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildSession({
  id = databaseBuffer.getNextId(),
  accessCode = 'FMKP39',
  address = '3 rue des églantines',
  certificationCenter = 'Centre de certif Pix',
  certificationCenterId,
  date = '2020-01-15',
  description = 'La session se déroule dans le jardin',
  examiner = 'Ginette',
  room = 'B315',
  time = '15:30:00',
  examinerGlobalComment = '',
  hasIncident = false,
  hasJoiningIssue = false,
  createdAt = new Date('2020-01-01'),
  finalizedAt = null,
  resultsSentToPrescriberAt = null,
  publishedAt = null,
  assignedCertificationOfficerId,
  juryComment = null,
  juryCommentAuthorId = null,
  juryCommentedAt = null,
  supervisorPassword = 'PIX12'
}: $TSFixMe = {}) {
  if (_.isUndefined(certificationCenterId)) {
    const builtCertificationCenter = buildCertificationCenter();
    certificationCenter = builtCertificationCenter.name;
    certificationCenterId = builtCertificationCenter.id;
  }
  const values = {
    id,
    accessCode,
    address,
    certificationCenter,
    certificationCenterId,
    date,
    description,
    examiner,
    room,
    time,
    examinerGlobalComment,
    hasIncident,
    hasJoiningIssue,
    createdAt,
    finalizedAt,
    resultsSentToPrescriberAt,
    publishedAt,
    assignedCertificationOfficerId,
    juryComment,
    juryCommentAuthorId,
    juryCommentedAt,
    supervisorPassword,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'sessions',
    values,
  });
};
