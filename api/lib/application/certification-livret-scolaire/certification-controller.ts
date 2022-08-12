// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { getCertificationsResultsForLS } = require('../../domain/usecases');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationsResultsForLsSerializer = require('../../infrastructure/serializers/jsonapi/certifications-livret-scolaire/certification-ls-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getCertificationsByOrganizationUAI(request: $TSFixMe) {
    const uai = request.params.uai;
    const certifications = await getCertificationsResultsForLS({ uai });
    return certificationsResultsForLsSerializer.serialize(certifications);
  },
};
