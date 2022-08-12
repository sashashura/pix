// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipation = require('../../../../../lib/domain/read-models/CampaignAssessmentParticipation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/campaign-assessment-participation-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | campaign-assessment-participation-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    let modelCampaignAssessmentParticipation: $TSFixMe;
    let expectedJsonApi: $TSFixMe;

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('with badges', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const createdAt = new Date('2020-01-01');
        const sharedAt = new Date('2020-01-02');
        expectedJsonApi = {
          data: {
            type: 'campaign-assessment-participations',
            id: '1',
            attributes: {
              'first-name': 'someFirstName',
              'last-name': 'someLastName',
              'participant-external-id': 'someParticipantExternalId',
              'campaign-id': 2,
              'created-at': createdAt,
              'is-shared': true,
              'shared-at': sharedAt,
              'mastery-rate': 0.35,
              progression: 1,
            },
            relationships: {
              badges: {
                data: [
                  {
                    id: '1',
                    type: 'badges',
                  },
                ],
              },
              'campaign-analysis': {
                links: {
                  related: '/api/campaign-participations/1/analyses',
                },
              },
              'campaign-assessment-participation-result': {
                links: {
                  related: '/api/campaigns/2/assessment-participations/1/results',
                },
              },
            },
          },
          included: [
            {
              id: '1',
              type: 'badges',
              attributes: {
                'alt-message': 'someAltMessage',
                'image-url': 'someImageUrl',
                title: 'someTitle',
              },
            },
          ],
        };

        modelCampaignAssessmentParticipation = new CampaignAssessmentParticipation({
          campaignParticipationId: 1,
          campaignId: 2,
          firstName: 'someFirstName',
          lastName: 'someLastName',
          participantExternalId: 'someParticipantExternalId',
          assessmentState: Assessment.states.COMPLETED,
          createdAt,
          status: CampaignParticipationStatuses.SHARED,
          sharedAt,
          targetedSkillsCount: 20,
          testedSkillsCount: 3,
          masteryRate: 0.35,
          badges: [{ id: 1, title: 'someTitle', altMessage: 'someAltMessage', imageUrl: 'someImageUrl' }],
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should convert a CampaignAssessmentParticipation model object into JSON API data', function () {
        // when
        const json = serializer.serialize(modelCampaignAssessmentParticipation);

        // then
        expect(json).to.deep.equal(expectedJsonApi);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('without badges', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const createdAt = new Date('2020-01-01');
        const sharedAt = new Date('2020-01-02');
        expectedJsonApi = {
          data: {
            type: 'campaign-assessment-participations',
            id: '1',
            attributes: {
              'first-name': 'someFirstName',
              'last-name': 'someLastName',
              'participant-external-id': 'someParticipantExternalId',
              'campaign-id': 2,
              'created-at': createdAt,
              'is-shared': true,
              'shared-at': sharedAt,
              'mastery-rate': 0.35,
              progression: 1,
            },
            relationships: {
              badges: {
                data: [],
              },
              'campaign-analysis': {
                links: {
                  related: '/api/campaign-participations/1/analyses',
                },
              },
              'campaign-assessment-participation-result': {
                links: {
                  related: '/api/campaigns/2/assessment-participations/1/results',
                },
              },
            },
          },
        };

        modelCampaignAssessmentParticipation = new CampaignAssessmentParticipation({
          campaignParticipationId: 1,
          campaignId: 2,
          firstName: 'someFirstName',
          lastName: 'someLastName',
          participantExternalId: 'someParticipantExternalId',
          assessmentState: Assessment.states.COMPLETED,
          createdAt,
          status: CampaignParticipationStatuses.SHARED,
          sharedAt,
          targetedSkillsCount: 0,
          testedSkillsCount: 0,
          masteryRate: 0.35,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should convert a CampaignAssessmentParticipation model object into JSON API data', function () {
        // when
        const json = serializer.serialize(modelCampaignAssessmentParticipation);

        // then
        expect(json).to.deep.equal(expectedJsonApi);
      });
    });
  });
});
