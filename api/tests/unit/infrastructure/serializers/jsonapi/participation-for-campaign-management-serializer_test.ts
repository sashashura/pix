// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/participation-for-campaign-management-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | participation-for-campaign-management-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a participation model object into JSON API data', function () {
      // given
      const participationForCampaignManagement = domainBuilder.buildParticipationForCampaignManagement({
        id: 123,
        createdAt: new Date('2020-10-10'),
        sharedAt: new Date('2020-10-11'),
        deletedAt: new Date('2020-10-12'),
        deletedBy: 666,
        deletedByFirstName: 'King',
        deletedByLastName: 'Cong',
      });

      // when
      const json = serializer.serialize([participationForCampaignManagement]);

      // then
      expect(json).to.deep.equal({
        data: [
          {
            type: 'campaign-participations',
            id: participationForCampaignManagement.id.toString(),
            attributes: {
              'last-name': participationForCampaignManagement.lastName,
              'first-name': participationForCampaignManagement.firstName,
              'user-id': participationForCampaignManagement.userId,
              'user-full-name': participationForCampaignManagement.userFullName,
              'participant-external-id': participationForCampaignManagement.participantExternalId,
              status: participationForCampaignManagement.status,
              'created-at': participationForCampaignManagement.createdAt,
              'shared-at': participationForCampaignManagement.sharedAt,
              'deleted-at': participationForCampaignManagement.deletedAt,
              'deleted-by': participationForCampaignManagement.deletedBy,
              'deleted-by-full-name': participationForCampaignManagement.deletedByFullName,
            },
          },
        ],
      });
    });
  });
});
