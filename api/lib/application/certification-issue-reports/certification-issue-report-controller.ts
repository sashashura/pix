// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async deleteCertificationIssueReport(request: $TSFixMe) {
    const certificationIssueReportId = request.params.id;
    await usecases.deleteCertificationIssueReport({ certificationIssueReportId });

    return null;
  },

  async manuallyResolve(request: $TSFixMe, h: $TSFixMe) {
    const certificationIssueReportId = request.params.id;
    const resolution = request.payload.data.resolution;
    await usecases.manuallyResolveCertificationIssueReport({
      certificationIssueReportId,
      resolution,
    });

    return h.response().code(204);
  },
};
