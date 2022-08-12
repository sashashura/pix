// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterCreationValidator = require('../validators/certification-center-creation-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationHabilitation = require('../../domain/models/ComplementaryCertificationHabilitation');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateCertificationCenter({
  certificationCenter,
  complementaryCertificationIds,
  certificationCenterRepository,
  complementaryCertificationHabilitationRepository
}: $TSFixMe) {
  certificationCenterCreationValidator.validate(certificationCenter);
  if (certificationCenter.id) {
    await complementaryCertificationHabilitationRepository.deleteByCertificationCenterId(certificationCenter.id);
  }
  if (complementaryCertificationIds) {
    await bluebird.mapSeries(complementaryCertificationIds, (complementaryCertificationId: $TSFixMe) => {
      const complementaryCertificationHabilitation = new ComplementaryCertificationHabilitation({
        complementaryCertificationId: parseInt(complementaryCertificationId),
        certificationCenterId: certificationCenter.id,
      });
      return complementaryCertificationHabilitationRepository.save(complementaryCertificationHabilitation);
    });
  }

  return certificationCenterRepository.save(certificationCenter);
};
