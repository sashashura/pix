// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionFor... Remove this comment to see the full error message
const sessionForSupervisingController = require('../../../../lib/application/sessions/session-for-supervising-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionFor... Remove this comment to see the full error message
const sessionForSupervisingSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/session-for-supervising-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | session-for-supervising', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a session for supervising', async function () {
      // given
      const request = {
        params: {
          id: 123,
        },
        auth: {
          credentials: {
            userId: 274939274,
          },
        },
      };
      const foundSession = domainBuilder.buildSessionForSupervising({ id: 123 });
      const serializedSession = sessionForSupervisingSerializer.serialize(foundSession);
      sinon.stub(usecases, 'getSessionForSupervising');
      usecases.getSessionForSupervising.withArgs({ sessionId: 123 }).resolves(foundSession);

      // when
      const response = await sessionForSupervisingController.get(request, hFake);

      // then
      expect(response).to.deep.equal(serializedSession);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#supervise', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a HTTP 204 No Content', async function () {
      // given
      const request = {
        auth: {
          credentials: {
            userId: 274939274,
          },
        },
        payload: {
          data: {
            attributes: {
              'session-id': '123',
              'supervisor-password': '567',
            },
          },
        },
      };
      sinon.stub(usecases, 'superviseSession');
      usecases.superviseSession.withArgs({ sessionId: '123', userId: 274939274, supervisorPassword: '567' }).resolves();

      // when
      const response = await sessionForSupervisingController.supervise(request, hFake);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });
});
