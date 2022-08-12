// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/campaign-management-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | campaign-management-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Campaign-Management model object into JSON API data', function () {
      // given
      const campaignManagement = domainBuilder.buildCampaignManagement({
        id: 'campaign_management_id',
        archivedAt: new Date('2020-10-10'),
      });

      // when
      const json = serializer.serialize(campaignManagement);

      // then
      expect(json).to.deep.equal({
        data: {
          type: 'campaigns',
          id: campaignManagement.id.toString(),
          attributes: {
            code: campaignManagement.code,
            name: campaignManagement.name,
            type: campaignManagement.type,
            'archived-at': campaignManagement.archivedAt,
            'created-at': campaignManagement.createdAt,
            'creator-id': campaignManagement.creatorId,
            'creator-first-name': campaignManagement.creatorFirstName,
            'creator-last-name': campaignManagement.creatorLastName,
            'owner-id': campaignManagement.ownerId,
            'owner-first-name': campaignManagement.ownerFirstName,
            'owner-last-name': campaignManagement.ownerLastName,
          },
        },
      });
    });
  });
});
