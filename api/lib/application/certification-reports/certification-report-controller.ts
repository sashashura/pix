// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationIssueReportSerializer = require('../../infrastructure/serializers/jsonapi/certification-issue-report-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async saveCertificationIssueReport(request: $TSFixMe, h: $TSFixMe) {
    const certificationIssueReportDTO = certificationIssueReportSerializer.deserialize(request);
    const certificationIssueReportSaved = await usecases.saveCertificationIssueReport({ certificationIssueReportDTO });

    return h.response(certificationIssueReportSerializer.serialize(certificationIssueReportSaved)).created();
  },

  async abort(request: $TSFixMe, h: $TSFixMe) {
    const certificationCourseId = request.params.id;
    const abortReason = request.payload.data.reason;
    await usecases.abortCertificationCourse({ certificationCourseId, abortReason });
    return h.response().code(200);
  },
};
