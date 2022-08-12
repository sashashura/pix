// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/campaign-participation-for-user-management-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | campaign-participation-for-user-management-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a participation model object into JSON API data', function () {
      // given
      const participationForUserManagement = domainBuilder.buildCampaignParticipationForUserManagement({
        id: 123,
        status: 'SHARED',
        campaignId: 456,
        campaignCode: 'AZERTY123',
        createdAt: new Date('2020-10-10'),
        sharedAt: new Date('2020-10-11'),
        deletedAt: new Date('2020-10-12'),
        deletedBy: 666,
        deletedByFirstName: 'King',
        deletedByLastName: 'Cong',
        organizationLearnerFirstName: 'Some',
        organizationLearnerLastName: 'Learner',
      });

      // when
      const json = serializer.serialize([participationForUserManagement]);

      // then
      expect(json).to.deep.equal({
        data: [
          {
            type: 'user-participations',
            id: participationForUserManagement.id.toString(),
            attributes: {
              'participant-external-id': participationForUserManagement.participantExternalId,
              status: participationForUserManagement.status,
              'campaign-id': participationForUserManagement.campaignId,
              'campaign-code': participationForUserManagement.campaignCode,
              'created-at': participationForUserManagement.createdAt,
              'shared-at': participationForUserManagement.sharedAt,
              'deleted-at': participationForUserManagement.deletedAt,
              'deleted-by': participationForUserManagement.deletedBy,
              'deleted-by-full-name': participationForUserManagement.deletedByFullName,
              'organization-learner-full-name': participationForUserManagement.organizationLearnerFullName,
            },
          },
        ],
      });
    });
  });
});
