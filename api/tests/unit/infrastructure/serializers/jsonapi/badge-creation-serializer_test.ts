// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/badge-creation-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | badge-creation-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert JSON API data into a BadgeCreation model object', async function () {
      // given
      const jsonBadge = {
        data: {
          type: 'badge-creations',
          attributes: {
            key: 'BADGE_KEY',
            'alt-message': 'alt-message',
            'image-url': 'https://example.net/image.svg',
            message: 'message',
            title: 'title',
            'is-certifiable': false,
            'is-always-visible': true,
            'campaign-threshold': 99,
            'skill-set-threshold': 66,
            'skill-set-name': "le nom du lot d'acquis",
            'skill-set-skills-ids': ['skillId1', 'skillId2', 'skillId4'],
          },
        },
      };

      // when
      const badgeCreation = await serializer.deserialize(jsonBadge);

      // then
      const expectedBadgeCreation = {
        key: 'BADGE_KEY',
        altMessage: 'alt-message',
        imageUrl: 'https://example.net/image.svg',
        message: 'message',
        title: 'title',
        isCertifiable: false,
        isAlwaysVisible: true,
        campaignThreshold: 99,
        skillSetThreshold: 66,
        skillSetName: "le nom du lot d'acquis",
        skillSetSkillsIds: ['skillId1', 'skillId2', 'skillId4'],
      };
      expect(badgeCreation).to.deep.equal(expectedBadgeCreation);
    });
  });
});
