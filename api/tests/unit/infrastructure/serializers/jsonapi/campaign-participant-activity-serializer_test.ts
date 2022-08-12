// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/campaign-participant-activity-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipantActivity = require('../../../../../lib/domain/read-models/CampaignParticipantActivity');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, STARTED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | campaign-participant-activity-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call serialize method by destructuring passed parameter', function () {
      // given
      const campaignParticipantsActivities = [
        new CampaignParticipantActivity({
          userId: 1,
          campaignParticipationId: '1',
          firstName: 'Karam',
          lastName: 'Habibi',
          participantExternalId: 'Dev',
          status: SHARED,
        }),
        new CampaignParticipantActivity({
          userId: 2,
          campaignParticipationId: '2',
          firstName: 'Dimitri',
          lastName: 'Payet',
          participantExternalId: 'Footballer',
          status: STARTED,
          sharedAt: null,
        }),
      ];
      const pagination = {
        page: {
          number: 1,
          pageSize: 2,
        },
      };

      const resultsSerialized = serializer.serialize({ campaignParticipantsActivities, pagination });

      expect(resultsSerialized).to.deep.equal({
        data: [
          {
            type: 'campaign-participant-activities',
            id: '1',
            attributes: {
              'first-name': 'Karam',
              'last-name': 'Habibi',
              'participant-external-id': 'Dev',
              status: SHARED,
            },
          },
          {
            type: 'campaign-participant-activities',
            id: '2',
            attributes: {
              'first-name': 'Dimitri',
              'last-name': 'Payet',
              'participant-external-id': 'Footballer',
              status: STARTED,
            },
          },
        ],
        meta: {
          page: {
            number: 1,
            pageSize: 2,
          },
        },
      });
    });
  });
});
