const usecases = require('../../domain/usecases');

module.exports = {
  async deleteCertificationIssueReport(request) {
    const userId = request.auth.credentials?.accessToken?.content?.pixUserId;
    const certificationIssueReportId = request.params.id;
    await usecases.deleteCertificationIssueReport({
      certificationIssueReportId,
      userId,
    });

    return null;
  },
};
