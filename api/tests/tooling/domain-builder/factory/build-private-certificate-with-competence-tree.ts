// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PrivateCer... Remove this comment to see the full error message
const PrivateCertificate = require('../../../../lib/domain/models/PrivateCertificate');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildAssessmentResult = require('./build-assessment-result');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildResultCompetenceTree = require('./build-result-competence-tree');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildPrivateCertificate({
  id = 1,
  assessmentResults = [buildAssessmentResult()],
  assessmentState = 'completed',
  birthdate = '1992-06-12',
  birthplace = 'Paris',
  certificationCenter = 'L’université du Pix',
  date = new Date('2018-12-01T01:02:03Z'),
  firstName = 'Jean',
  deliveredAt = new Date('2018-10-03T01:02:03Z'),
  isPublished = true,
  lastName = 'Bon',
  userId = 1,

  // set to overried computed properties
  commentForCandidate,

  pixScore,
  status,
  cleaCertificationStatus = 'acquired',
  verificationCode = 'P-BBBCCCDD',
  maxReachableLevelOnCertificationDate = 5,

  // the id of the ResultCompetenceTree should be with the most recent assessment result.
  resultCompetenceTree = buildResultCompetenceTree({ id: `${id}-${assessmentResults[0].id}` })
}: $TSFixMe = {}) {
  const certificate = new PrivateCertificate({
    id,
    assessmentState,
    assessmentResults,
    birthdate,
    birthplace,
    certificationCenter,
    date,
    firstName,
    deliveredAt,
    isPublished,
    lastName,
    userId,
    resultCompetenceTree,
    cleaCertificationStatus,
    verificationCode,
    maxReachableLevelOnCertificationDate,
  });

  if (pixScore !== undefined) {
    certificate.pixScore = pixScore;
  }
  if (status !== undefined) {
    // @ts-expect-error TS(2576): Property 'status' does not exist on type 'PrivateC... Remove this comment to see the full error message
    certificate.status = status;
  }
  if (commentForCandidate !== undefined) {
    certificate.commentForCandidate = commentForCandidate;
  }
  if (commentForCandidate !== undefined) {
    certificate.commentForCandidate = commentForCandidate;
  }

  return certificate;
};
