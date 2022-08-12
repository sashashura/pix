// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Session'.
const Session = require('../../../../lib/domain/models/Session');

const buildSession = function ({
  id = 123,
  accessCode = 'BCDF234',
  address = '4 avenue du général perlimpimpim',
  certificationCenter = 'Centre de certif pix',
  certificationCenterId,
  date = '2021-01-01',
  description = 'Bonne année',
  examiner = 'Flute',
  room = '28D',
  time = '14:30',
  examinerGlobalComment = '',
  hasIncident = false,
  hasJoiningIssue = false,
  finalizedAt = null,
  resultsSentToPrescriberAt = null,
  publishedAt = null,
  assignedCertificationOfficerId = null,
  supervisorPassword = 'PIX12',
  certificationCandidates = []
}: $TSFixMe = {}) {
  return new Session({
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
    finalizedAt,
    resultsSentToPrescriberAt,
    publishedAt,
    assignedCertificationOfficerId,
    supervisorPassword,
    certificationCandidates,
  });
};

buildSession.created = function ({
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
  certificationCandidates
}: $TSFixMe = {}) {
  return buildSession({
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
    certificationCandidates,
    examinerGlobalComment: null,
    hasIncident: false,
    hasJoiningIssue: false,
    finalizedAt: null,
    resultsSentToPrescriberAt: null,
    publishedAt: null,
    assignedCertificationOfficerId: null,
  });
};

buildSession.finalized = function ({
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
  certificationCandidates
}: $TSFixMe = {}) {
  return buildSession({
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
    certificationCandidates,
    examinerGlobalComment: null,
    hasIncident: false,
    hasJoiningIssue: false,
    finalizedAt: new Date('2020-01-01'),
    resultsSentToPrescriberAt: null,
    publishedAt: null,
    assignedCertificationOfficerId: null,
  });
};

buildSession.inProcess = function ({
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
  certificationCandidates
}: $TSFixMe = {}) {
  return buildSession({
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
    certificationCandidates,
    examinerGlobalComment: null,
    hasIncident: false,
    hasJoiningIssue: false,
    finalizedAt: new Date('2020-01-01'),
    resultsSentToPrescriberAt: null,
    publishedAt: null,
    assignedCertificationOfficerId: 123,
  });
};

buildSession.processed = function ({
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
  certificationCandidates
}: $TSFixMe = {}) {
  return buildSession({
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
    certificationCandidates,
    examinerGlobalComment: null,
    hasIncident: false,
    hasJoiningIssue: false,
    finalizedAt: new Date('2020-01-01'),
    resultsSentToPrescriberAt: new Date('2020-01-02'),
    publishedAt: new Date('2020-01-02'),
    assignedCertificationOfficerId: 123,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildSession;
