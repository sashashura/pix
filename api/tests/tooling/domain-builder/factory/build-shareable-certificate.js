const ShareableCertificate = require('../../../../lib/domain/models/ShareableCertificate');
const buildCleaCertificationResult = require('./build-clea-certification-result');

module.exports = function buildShareableCertificate({
  id = 1,
  firstName = 'Jean',
  lastName = 'Bon',
  birthdate = '1992-06-12',
  birthplace = 'Paris',
  isPublished = true,
  userId = 1,
  certificationCenter = 'L’université du Pix',
  date = new Date('2018-12-01T01:02:03Z'),
  deliveredAt = new Date('2018-10-03T01:02:03Z'),
  pixScore = 123,
  maxReachableLevelOnCertificationDate = 5,
  cleaCertificationResult = buildCleaCertificationResult.notTaken(),
  certifiedBadgeImages = [],
  resultCompetenceTree = null,
} = {}) {
  return new ShareableCertificate({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    certificationCenter,
    date,
    deliveredAt,
    pixScore,
    maxReachableLevelOnCertificationDate,
    resultCompetenceTree,
    cleaCertificationResult,
    certifiedBadgeImages,
  });
};
