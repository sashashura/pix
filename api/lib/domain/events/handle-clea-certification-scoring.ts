// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationScoringCompleted = require('./CertificationScoringCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationRescoringCompleted = require('./CertificationRescoringCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA'.
const { CLEA } = require('../models/ComplementaryCertification');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [CertificationScoringCompleted, CertificationRescoringCompleted];

async function handleCleaCertificationScoring({
  event,
  partnerCertificationScoringRepository,
  complementaryCertificationCourseRepository
}: $TSFixMe) {
  checkEventTypes(event, eventTypes);
  const { certificationCourseId, userId, reproducibilityRate } = event;
  const complementaryCertificationCourseId =
    await complementaryCertificationCourseRepository.getComplementaryCertificationCourseId({
      certificationCourseId,
      complementaryCertificationKey: CLEA,
    });
  if (!complementaryCertificationCourseId) {
    return;
  }

  const cleaCertificationScoring = await partnerCertificationScoringRepository.getCleaCertificationScoring({
    complementaryCertificationCourseId,
    certificationCourseId,
    userId,
    reproducibilityRate,
  });

  return partnerCertificationScoringRepository.save({ partnerCertificationScoring: cleaCertificationScoring });
}

// @ts-expect-error TS(2454): Variable 'handleCleaCertificationScoring' is used ... Remove this comment to see the full error message
handleCleaCertificationScoring.eventTypes = eventTypes;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handleCleaCertificationScoring;
