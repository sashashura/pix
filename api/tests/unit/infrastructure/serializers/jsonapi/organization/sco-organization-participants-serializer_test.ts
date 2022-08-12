// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ScoOrganiz... Remove this comment to see the full error message
const ScoOrganizationParticipant = require('../../../../../../lib/domain/read-models/ScoOrganizationParticipant');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../../lib/infrastructure/serializers/jsonapi/organization/sco-organization-participants-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationsStatuses = require('../../../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | sco-organization-participants-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a sco organization participant model object into JSON API data', function () {
      // given
      const scoOrganizationParticipants = [
        new ScoOrganizationParticipant({
          id: 777,
          firstName: 'Alex',
          lastName: 'Vasquez',
          birthdate: '2010-10-23',
          division: '4E',
          userId: 456,
          email: null,
          username: 'alexvasquez2310',
          isAuthenticatedFromGAR: true,
          participationCount: 4,
          lastParticipationDate: '2021-03-05',
          campaignName: 'King Karam',
          campaignType: 'ASSESSMENT',
          participationStatus: campaignParticipationsStatuses.TO_SHARE,
        }),
        new ScoOrganizationParticipant({
          id: 778,
          firstName: 'Sam',
          lastName: 'Simpson',
          birthdate: '2010-10-13',
          division: '4L',
          userId: null,
          email: 'toto@example.net',
          username: null,
          isAuthenticatedFromGAR: false,
          participationCount: 3,
          lastParticipationDate: '2021-03-05',
          campaignName: 'King Xavier',
          campaignType: 'PROFILES_COLLECTION',
          participationStatus: campaignParticipationsStatuses.SHARED,
        }),
      ];
      const pagination = { page: { number: 1, pageSize: 2 } };

      const expectedJSON = {
        data: [
          {
            type: 'sco-organization-participants',
            id: scoOrganizationParticipants[0].id.toString(),
            attributes: {
              'first-name': scoOrganizationParticipants[0].firstName,
              'last-name': scoOrganizationParticipants[0].lastName,
              birthdate: scoOrganizationParticipants[0].birthdate,
              'user-id': scoOrganizationParticipants[0].userId,
              division: scoOrganizationParticipants[0].division,
              email: scoOrganizationParticipants[0].email,
              username: scoOrganizationParticipants[0].username,
              'is-authenticated-from-gar': scoOrganizationParticipants[0].isAuthenticatedFromGAR,
              'participation-count': scoOrganizationParticipants[0].participationCount,
              'last-participation-date': scoOrganizationParticipants[0].lastParticipationDate,
              'campaign-name': scoOrganizationParticipants[0].campaignName,
              'campaign-type': scoOrganizationParticipants[0].campaignType,
              'participation-status': scoOrganizationParticipants[0].participationStatus,
            },
          },
          {
            type: 'sco-organization-participants',
            id: scoOrganizationParticipants[1].id.toString(),
            attributes: {
              'first-name': scoOrganizationParticipants[1].firstName,
              'last-name': scoOrganizationParticipants[1].lastName,
              birthdate: scoOrganizationParticipants[1].birthdate,
              division: scoOrganizationParticipants[1].division,
              'user-id': scoOrganizationParticipants[1].userId,
              email: scoOrganizationParticipants[1].email,
              username: scoOrganizationParticipants[1].username,
              'is-authenticated-from-gar': scoOrganizationParticipants[1].isAuthenticatedFromGAR,
              'participation-count': scoOrganizationParticipants[1].participationCount,
              'last-participation-date': scoOrganizationParticipants[1].lastParticipationDate,
              'campaign-name': scoOrganizationParticipants[1].campaignName,
              'campaign-type': scoOrganizationParticipants[1].campaignType,
              'participation-status': scoOrganizationParticipants[1].participationStatus,
            },
          },
        ],
        meta: pagination,
      };

      // when
      const json = serializer.serialize({ scoOrganizationParticipants, pagination });

      // then
      expect(json).to.deep.equal(expectedJSON);
    });
  });
});
