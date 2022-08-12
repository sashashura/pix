// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userOrgaSe... Remove this comment to see the full error message
const userOrgaSettingsController = require('../../../../lib/application/user-orga-settings/user-orga-settings-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/user-orga-settings');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Router | user-orga-settings-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PUT /api/user-orga-settings/{id}', function () {
    const userId = 2;
    const auth = { credentials: { userId: userId }, strategy: {} };

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      sinon.stub(userOrgaSettingsController, 'createOrUpdate').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const method = 'PUT';
      const url = `/api/user-orga-settings/${userId}`;
      const payload = {
        data: {
          relationships: {
            organization: {
              data: {
                id: 1,
                type: 'organizations',
              },
            },
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload, auth);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Payload schema validation', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should be mandatory', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'PUT';
        const url = `/api/user-orga-settings/${userId}`;
        const payload = undefined;

        // when
        const result = await httpTestServer.request(method, url, payload);

        // then
        expect(result.statusCode).to.equal(400);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should contain relationships.organization.data.id', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'PUT';
        const url = `/api/user-orga-settings/${userId}`;
        const payload = {
          data: {
            relationships: {
              organization: {
                data: {
                  id: undefined,
                  type: 'organizations',
                },
              },
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should contain relationships.organization.data.id as number', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'PUT';
        const url = `/api/user-orga-settings/${userId}`;
        const payload = {
          data: {
            relationships: {
              organization: {
                data: {
                  id: 'test',
                  type: 'organizations',
                },
              },
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });
});
