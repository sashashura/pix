// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationParticipant = require('../../../../../../lib/domain/read-models/OrganizationParticipant');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../../lib/infrastructure/serializers/jsonapi/organization/organization-participants-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignPartcipationsStatuses = require('../../../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | organization-participants-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert an organization participant model object into JSON API data', function () {
      // given
      const organizationParticipants = [
        new OrganizationParticipant({
          id: 777,
          firstName: 'Alex',
          lastName: 'Vasquez',
          participationCount: 4,
          lastParticipationDate: '2021-03-05',
          campaignName: 'King Karam',
          campaignType: 'ASSESSMENT',
          participationStatus: campaignPartcipationsStatuses.TO_SHARE,
        }),
        new OrganizationParticipant({
          id: 778,
          firstName: 'Sam',
          lastName: 'Simpson',
          participationCount: 3,
          lastParticipationDate: '2021-03-05',
          campaignName: 'King Xavier',
          campaignType: 'PROFILES_COLLECTION',
          participationStatus: campaignPartcipationsStatuses.SHARED,
        }),
      ];
      const pagination = { page: { number: 1, pageSize: 2 } };

      const expectedJSON = {
        data: [
          {
            type: 'organization-participants',
            id: organizationParticipants[0].id.toString(),
            attributes: {
              'first-name': organizationParticipants[0].firstName,
              'last-name': organizationParticipants[0].lastName,
              'participation-count': organizationParticipants[0].participationCount,
              'last-participation-date': organizationParticipants[0].lastParticipationDate,
              'campaign-name': organizationParticipants[0].campaignName,
              'campaign-type': organizationParticipants[0].campaignType,
              'participation-status': organizationParticipants[0].participationStatus,
            },
          },
          {
            type: 'organization-participants',
            id: organizationParticipants[1].id.toString(),
            attributes: {
              'first-name': organizationParticipants[1].firstName,
              'last-name': organizationParticipants[1].lastName,
              'participation-count': organizationParticipants[1].participationCount,
              'last-participation-date': organizationParticipants[1].lastParticipationDate,
              'campaign-name': organizationParticipants[1].campaignName,
              'campaign-type': organizationParticipants[1].campaignType,
              'participation-status': organizationParticipants[1].participationStatus,
            },
          },
        ],
        meta: pagination,
      };

      // when
      const json = serializer.serialize({ organizationParticipants, pagination });

      // then
      expect(json).to.deep.equal(expectedJSON);
    });
  });
});
