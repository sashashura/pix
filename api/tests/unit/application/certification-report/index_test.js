const {
  expect,
  HttpTestServer,
  sinon,
} = require('../../../test-helper');

const moduleUnderTest = require('../../../../lib/application/certification-reports');

const certificationReportController = require('../../../../lib/application/certification-reports/certification-report-controller');

describe('Unit | Application | Router | certification-report-router', () => {

  describe('POST api/certification-reports/{id}/certification-issue-reports', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(certificationReportController, 'saveCertificationIssueReport').callsFake((request, h) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/certification-reports/1/certification-issue-reports');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
