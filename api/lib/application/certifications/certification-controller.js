const usecases = require('../../domain/usecases');
const certificationSerializer = require('../../infrastructure/serializers/jsonapi/certification-serializer');
const challengeRepository = require('../../infrastructure/repositories/challenge-repository');
const competenceRepository = require('../../infrastructure/repositories/competence-repository');

module.exports = {
  async findUserCertifications(request) {
    const userId = request.auth.credentials.userId;

    await competenceRepository.listPixCompetencesOnly();
    await challengeRepository.findFrenchFranceOperative();

    return usecases.findCompletedUserCertifications({ userId })
      .then((certifications) => certificationSerializer.serialize(certifications));
  },

  getCertification(request) {
    const userId = request.auth.credentials.userId;
    const certificationId = parseInt(request.params.id);

    return usecases.getPrivateCertificate({
      userId,
      certificationId,
    })
      .then((certification) => certificationSerializer.serialize(certification));
  },

  getCertificationByVerificationCode(request) {
    const verificationCode = request.payload.verificationCode;

    return usecases.getShareableCertificate({ verificationCode })
      .then((certificate) => certificationSerializer.serializeForSharing(certificate));
  }
};
