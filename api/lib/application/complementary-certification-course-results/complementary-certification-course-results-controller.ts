// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async saveJuryComplementaryCertificationCourseResult(request: $TSFixMe, h: $TSFixMe) {
    const { complementaryCertificationCourseId, juryLevel } = request.payload.data.attributes;

    await usecases.saveJuryComplementaryCertificationCourseResult({
      complementaryCertificationCourseId,
      juryLevel,
    });
    return h.response().code(200);
  },
};
