// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/campaign-profiles-collection-participation-summary-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfilesCollectionParticipationSummary = require('../../../../../lib/domain/read-models/CampaignProfilesCollectionParticipationSummary');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | campaign-profiles-collection-participation-summary-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a serialized JSON data object', function () {
      const meta = { some: 'meta' };
      const participationSummary = new CampaignProfilesCollectionParticipationSummary({
        campaignParticipationId: '1',
        firstName: 'Antoine',
        lastName: 'Boidelo',
        participantExternalId: 'abo',
        sharedAt: new Date(2020, 2, 2),
        pixScore: 1024,
        certifiable: true,
        certifiableCompetencesCount: 8,
      });

      const expectedSerializedResult = {
        data: {
          id: '1',
          type: 'CampaignProfilesCollectionParticipationSummaries',
          attributes: {
            'first-name': 'Antoine',
            'last-name': 'Boidelo',
            'participant-external-id': 'abo',
            'shared-at': new Date(2020, 2, 2),
            'pix-score': 1024,
            certifiable: true,
            'certifiable-competences-count': 8,
          },
        },
        meta,
      };

      // when
      const result = serializer.serialize({ data: participationSummary, pagination: meta });

      // then
      expect(result).to.deep.equal(expectedSerializedResult);
    });
  });
});
