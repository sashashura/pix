const { expect } = require('../../../../../test-helper');
const SupOrganizationParticipant = require('../../../../../../lib/domain/read-models/SupOrganizationParticipant');
const serializer = require('../../../../../../lib/infrastructure/serializers/jsonapi/organization/sup-organization-participants-serializer');
const campaignParticipationsStatuses = require('../../../../../../lib/domain/models/CampaignParticipationStatuses');

describe('Unit | Serializer | JSONAPI | sup-organization-participants-serializer', function () {
  describe('#serialize', function () {
    it('should convert a sco organization participant model object into JSON API data', function () {
      // given
      const supOrganizationParticipants = [
        new SupOrganizationParticipant({
          id: 777,
          firstName: 'Alex',
          lastName: 'Vasquez',
          birthdate: '2010-10-23',
          studentNumber: '1234567',
          group: 'L1',
          participationCount: 4,
          lastParticipationDate: '2021-03-05',
          campaignName: 'King Karam',
          campaignType: 'ASSESSMENT',
          participationStatus: campaignParticipationsStatuses.TO_SHARE,
        }),
        new SupOrganizationParticipant({
          id: 778,
          firstName: 'Sam',
          lastName: 'Simpson',
          birthdate: '2010-10-13',
          studentNumber: '9876543',
          group: 'L2',
          participationCount: 3,
          lastParticipationDate: '2021-03-05',
          campaignName: 'King Xavier',
          campaignType: 'PROFILES_COLLECTION',
          participationStatus: campaignParticipationsStatuses.SHARED,
        }),
      ];
      const pagination = { page: { number: 1, pageSize: 2 } };
      const participantCount = 10;
      const meta = { ...pagination, participantCount };

      const expectedJSON = {
        data: [
          {
            type: 'sup-organization-participants',
            id: supOrganizationParticipants[0].id.toString(),
            attributes: {
              'first-name': supOrganizationParticipants[0].firstName,
              'last-name': supOrganizationParticipants[0].lastName,
              birthdate: supOrganizationParticipants[0].birthdate,
              group: supOrganizationParticipants[0].group,
              'student-number': supOrganizationParticipants[0].studentNumber,
              'participation-count': supOrganizationParticipants[0].participationCount,
              'last-participation-date': supOrganizationParticipants[0].lastParticipationDate,
              'campaign-name': supOrganizationParticipants[0].campaignName,
              'campaign-type': supOrganizationParticipants[0].campaignType,
              'participation-status': supOrganizationParticipants[0].participationStatus,
            },
          },
          {
            type: 'sup-organization-participants',
            id: supOrganizationParticipants[1].id.toString(),
            attributes: {
              'first-name': supOrganizationParticipants[1].firstName,
              'last-name': supOrganizationParticipants[1].lastName,
              birthdate: supOrganizationParticipants[1].birthdate,
              group: supOrganizationParticipants[1].group,
              'student-number': supOrganizationParticipants[1].studentNumber,
              'participation-count': supOrganizationParticipants[1].participationCount,
              'last-participation-date': supOrganizationParticipants[1].lastParticipationDate,
              'campaign-name': supOrganizationParticipants[1].campaignName,
              'campaign-type': supOrganizationParticipants[1].campaignType,
              'participation-status': supOrganizationParticipants[1].participationStatus,
            },
          },
        ],
        meta,
      };

      // when
      const json = serializer.serialize({ supOrganizationParticipants, meta });

      // then
      expect(json).to.deep.equal(expectedJSON);
    });
  });
});
