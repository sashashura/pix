// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, HttpTestServer } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/complementary-certification-course-results');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | complementary-certification-course-results | complementary-certification-course-results-controller', function () {
  let sandbox: $TSFixMe;
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sandbox = sinon.createSandbox();
    sandbox.stub(usecases, 'saveJuryComplementaryCertificationCourseResult');
    sandbox.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin');
    sandbox.stub(securityPreHandlers, 'checkAdminMemberHasRoleCertif');
    sandbox.stub(securityPreHandlers, 'checkAdminMemberHasRoleSupport');
    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    sandbox.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#saveJuryComplementaryCertificationCourseResult', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // eslint-disable-next-line mocha/no-setup-in-describe
      [
        'PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE',
        'PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME',
        'PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME',
        'PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE',
        'PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT',
        'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE',
        'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME',
        'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME',
        'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE',
        'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT',
        'REJECTED',
      ].forEach((juryLevel) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should resolve a 200 HTTP response for ${juryLevel} juryLevel`, async function () {
          // given
          const payload = {
            data: {
              attributes: {
                juryLevel,
                complementaryCertificationCourseId: 123456,
              },
            },
          };
          usecases.saveJuryComplementaryCertificationCourseResult.resolves();
          securityPreHandlers.checkAdminMemberHasRoleSuperAdmin.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/admin/complementary-certification-course-results',
            payload
          );

          // then
          expect(response.statusCode).to.equal(200);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when juryLevel is not valid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 400 HTTP response', async function () {
          // given
          const payload = {
            data: {
              attributes: {
                juryLevel: 'INVALID_JURY_LEVEL',
                complementaryCertificationCourseId: 123456,
              },
            },
          };
          usecases.saveJuryComplementaryCertificationCourseResult.resolves();
          securityPreHandlers.checkAdminMemberHasRoleSuperAdmin.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/admin/complementary-certification-course-results',
            payload
          );

          // then
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user is not allowed to access resource', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 403 HTTP response', async function () {
          // given
          const payload = {
            data: {
              attributes: {
                juryLevel: 'REJECTED',
                complementaryCertificationCourseId: 123456,
              },
            },
          };
          securityPreHandlers.checkAdminMemberHasRoleSuperAdmin.callsFake((request: $TSFixMe, h: $TSFixMe) =>
            h.response({ errors: new Error('forbidden') }).code(403)
          );
          securityPreHandlers.checkAdminMemberHasRoleSupport.callsFake((request: $TSFixMe, h: $TSFixMe) =>
            h.response({ errors: new Error('forbidden') }).code(403)
          );
          securityPreHandlers.checkAdminMemberHasRoleCertif.callsFake((request: $TSFixMe, h: $TSFixMe) =>
            h.response({ errors: new Error('forbidden') }).code(403)
          );

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/admin/complementary-certification-course-results',
            payload
          );

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });
});
