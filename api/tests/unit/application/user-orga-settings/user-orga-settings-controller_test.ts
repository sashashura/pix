// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userOrgaSe... Remove this comment to see the full error message
const userOrgaSettingsController = require('../../../../lib/application/user-orga-settings/user-orga-settings-controller');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userOrgaSe... Remove this comment to see the full error message
const userOrgaSettingsSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/user-orga-settings-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | user-orga-settings-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createOrUpdate', function () {
    const userId = 7;
    const organizationId = 2;
    const request = {
      auth: { credentials: { userId } },
      params: {
        id: userId,
      },
      payload: {
        data: {
          relationships: {
            organization: {
              data: {
                id: organizationId,
                type: 'organizations',
              },
            },
          },
        },
      },
    };

    const serializedUseOrgaSettings = {
      data: {
        type: 'user-orga-settings',
        id: 1,
        attributes: {},
        relationships: {
          organization: {
            data: {
              type: 'organizations',
              id: organizationId,
            },
          },
          user: {
            data: {
              type: 'users',
              id: userId,
            },
          },
        },
      },
    };

    let expectedUserOrgaSettings: $TSFixMe;
    let response: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      sinon.stub(usecases, 'createOrUpdateUserOrgaSettings');
      sinon.stub(userOrgaSettingsSerializer, 'serialize');

      expectedUserOrgaSettings = { id: 1, user: { id: userId }, organization: { id: organizationId } };
      usecases.createOrUpdateUserOrgaSettings.resolves(expectedUserOrgaSettings);
      userOrgaSettingsSerializer.serialize.resolves(serializedUseOrgaSettings);

      response = await userOrgaSettingsController.createOrUpdate(request);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the usecase to update the userOrgaSetting', async function () {
      // then
      expect(usecases.createOrUpdateUserOrgaSettings).to.have.been.calledWith({ userId, organizationId });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should serialize the userOrgaSettings', function () {
      // then
      expect(userOrgaSettingsSerializer.serialize).to.have.been.calledWith(expectedUserOrgaSettings);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the serialized userOrgaSettings', function () {
      // then
      expect(response).to.deep.equal(serializedUseOrgaSettings);
    });
  });
});
