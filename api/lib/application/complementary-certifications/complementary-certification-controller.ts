// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const complementaryCertificationSerializer = require('../../infrastructure/serializers/jsonapi/complementary-certification-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findComplementaryCertifications() {
    const complementaryCertifications = await usecases.findComplementaryCertifications();
    return complementaryCertificationSerializer.serialize(complementaryCertifications);
  },
};
