// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationHabilitation = require('../models/ComplementaryCertificationHabilitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterCreationValidator = require('../validators/certification-center-creation-validator');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createCertificationCenter({
  certificationCenter,
  complementaryCertificationIds,
  complementaryCertificationHabilitationRepository,
  certificationCenterRepository
}: $TSFixMe) {
  certificationCenterCreationValidator.validate(certificationCenter);
  const createdCertificationCenter = await certificationCenterRepository.save(certificationCenter);

  for (const complementaryCertificationId of complementaryCertificationIds) {
    const complementaryCertificationHabilitation = new ComplementaryCertificationHabilitation({
      complementaryCertificationId: parseInt(complementaryCertificationId),
      certificationCenterId: createdCertificationCenter.id,
    });

    await complementaryCertificationHabilitationRepository.save(complementaryCertificationHabilitation);
  }

  return createdCertificationCenter;
};
