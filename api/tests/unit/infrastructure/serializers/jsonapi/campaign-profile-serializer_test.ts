// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/campaign-profile-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfile = require('../../../../../lib/domain/read-models/CampaignProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PlacementP... Remove this comment to see the full error message
const PlacementProfile = require('../../../../../lib/domain/models/PlacementProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserCompet... Remove this comment to see the full error message
const UserCompetence = require('../../../../../lib/domain/models/UserCompetence');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Area'.
const Area = require('../../../../../lib/domain/models/Area');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | campaign-profile-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    const campaignProfile = new CampaignProfile({
      campaignParticipationId: 9,
      campaignId: 8,
      firstName: 'someFirstName',
      lastName: 'someLastName',
      status: SHARED,
      participantExternalId: 'anExternalId',
      createdAt: '2020-01-01',
      sharedAt: '2020-01-02',
      pixScore: 12,
      placementProfile: new PlacementProfile({
        userCompetences: [
          new UserCompetence({
            id: 1,
            name: 'competence1',
            index: '1.1.1',
            pixScore: 12,
            estimatedLevel: 1,
            area: new Area({
              id: 1,
              title: 'area1',
              color: 'blue',
            }),
          }),
        ],
      }),
    });

    const expectedJsonApi = {
      data: {
        type: 'campaign-profiles',
        id: '9',
        attributes: {
          'first-name': 'someFirstName',
          'last-name': 'someLastName',
          'campaign-id': 8,
          'external-id': 'anExternalId',
          'pix-score': 12,
          'created-at': '2020-01-01',
          'shared-at': '2020-01-02',
          'is-shared': true,
          'competences-count': 1,
          'certifiable-competences-count': 1,
          'is-certifiable': false,
        },
        relationships: {
          competences: {
            data: [
              {
                id: '1',
                type: 'campaign-profile-competences',
              },
            ],
          },
        },
      },
      included: [
        {
          type: 'campaign-profile-competences',
          id: '1',
          attributes: {
            name: 'competence1',
            index: '1.1.1',
            'pix-score': 12,
            'estimated-level': 1,
            'area-color': 'blue',
          },
        },
      ],
    };

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a campaignProfile model object into JSON API data', function () {
      const json = serializer.serialize(campaignProfile);

      expect(json).to.deep.equal(expectedJsonApi);
    });
  });
});
