const {
  expect,
  HttpTestServer,
  sinon,
} = require('../../../test-helper');

const moduleUnderTest = require('../../../../lib/application/certification-issue-reports');

const certificationIssueReportController = require('../../../../lib/application/certification-issue-reports/certification-issue-report-controller');

describe('Unit | Application | Router | certification-issue-report-router', () => {

  describe('DELETE /api/certification-issue-reports/{id}', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(certificationIssueReportController, 'deleteCertificationIssueReport').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('DELETE', '/api/certification-issue-reports/1');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
