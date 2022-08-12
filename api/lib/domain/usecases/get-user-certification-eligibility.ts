// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationEligibility = require('../read-models/CertificationEligibility');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getLabelBy... Remove this comment to see the full error message
const { getLabelByBadgeKey } = require('../read-models/CertifiableBadgeLabels');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getUserCertificationEligibility({
  userId,
  placementProfileService,
  certificationBadgesService
}: $TSFixMe) {
  const now = new Date();
  const placementProfile = await placementProfileService.getPlacementProfile({ userId, limitDate: now });
  const pixCertificationEligible = placementProfile.isCertifiable();

  if (!pixCertificationEligible) {
    return CertificationEligibility.notCertifiable({ userId });
  }

  const stillValidBadgeAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
    userId,
  });

  const eligibleComplementaryCertifications = stillValidBadgeAcquisitions.map(({
    badgeKey
  }: $TSFixMe) =>
    getLabelByBadgeKey(badgeKey)
  );

  return new CertificationEligibility({
    id: userId,
    pixCertificationEligible,
    eligibleComplementaryCertifications,
  });
};
