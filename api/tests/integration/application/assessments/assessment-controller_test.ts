// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, HttpTestServer } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentAuthorization = require('../../../../lib/application/preHandlers/assessment-authorization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/assessments');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Assessments | assessment-controller', function () {
  let assessment: $TSFixMe;

  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon.stub(usecases, 'getAssessment');
    sinon.stub(assessmentAuthorization, 'verify');
    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
    assessment = domainBuilder.buildAssessment();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        assessmentAuthorization.verify.resolves(assessment);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should resolve a 200 HTTP response', async function () {
        // given
        usecases.getAssessment.resolves(assessment);

        // when
        const response = await httpTestServer.request('GET', '/api/assessments/1234');

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a JSON API organization', async function () {
        // given
        usecases.getAssessment.resolves(assessment);

        // when
        const response = await httpTestServer.request('GET', '/api/assessments/1234');

        // then
        expect(response.result.data.type).to.equal('assessments');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user is not allowed to access resource', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          assessmentAuthorization.verify.callsFake((request: $TSFixMe, h: $TSFixMe) => {
            return h.response({ some: 'error' }).code(401).takeover();
          });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 401 HTTP response', async function () {
          // when
          const response = await httpTestServer.request('GET', '/api/assessments/1234');

          // then
          expect(response.statusCode).to.equal(401);
        });
      });
    });
  });
});
