// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/badge-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../../../../../lib/domain/models/BadgeCriterion');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | badge-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Badge model object into JSON API data', function () {
      // given
      const badge = domainBuilder.buildBadge({
        id: '1',
        altMessage: 'You won a banana badge',
        imageUrl: '/img/banana.svg',
        message: 'Congrats, you won a banana badge',
        key: 'BANANA',
        title: 'Banana',
        targetProfileId: '1',
        isCertifiable: false,
        isAlwaysVisible: true,
        badgeCriteria: [domainBuilder.buildBadgeCriterion({ skillSetIds: null })],
        skillSets: [],
      });

      const expectedSerializedBadge = {
        data: {
          attributes: {
            'alt-message': 'You won a banana badge',
            'image-url': '/img/banana.svg',
            'is-certifiable': false,
            'is-always-visible': true,
            message: 'Congrats, you won a banana badge',
            title: 'Banana',
            key: 'BANANA',
          },
          id: '1',
          type: 'badges',
        },
      };

      // when
      const json = serializer.serialize(badge);

      // then
      expect(json).to.deep.equal(expectedSerializedBadge);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Badge model with badge partner competence object into JSON API data', function () {
      // given
      const badge = domainBuilder.buildBadge({
        id: '1',
        altMessage: 'You won a banana badge',
        imageUrl: '/img/banana.svg',
        message: 'Congrats, you won a banana badge',
        key: 'BANANA',
        title: 'Banana',
        targetProfileId: '1',
        isCertifiable: false,
        isAlwaysVisible: true,
      });

      const expectedSerializedBadge = {
        data: {
          attributes: {
            'alt-message': 'You won a banana badge',
            'image-url': '/img/banana.svg',
            'is-certifiable': false,
            'is-always-visible': true,
            message: 'Congrats, you won a banana badge',
            title: 'Banana',
            key: 'BANANA',
          },
          id: '1',
          type: 'badges',
        },
      };

      // when
      const json = serializer.serialize(badge);

      // then
      expect(json).to.deep.equal(expectedSerializedBadge);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Badge model and scope with every partner competence badge criteria scope into JSON API data', function () {
      // given
      const badge = domainBuilder.buildBadge({
        id: '1',
        altMessage: 'You won a banana badge',
        imageUrl: '/img/banana.svg',
        message: 'Congrats, you won a banana badge',
        key: 'BANANA',
        title: 'Banana',
        targetProfileId: '1',
        isCertifiable: false,
        isAlwaysVisible: true,
        badgeCriteria: [
          domainBuilder.buildBadgeCriterion({
            scope: BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION,
            threshold: 40,
            skillSetIds: [],
          }),
        ],
      });

      const expectedSerializedBadge = {
        data: {
          attributes: {
            'alt-message': 'You won a banana badge',
            'image-url': '/img/banana.svg',
            'is-certifiable': false,
            'is-always-visible': true,
            message: 'Congrats, you won a banana badge',
            title: 'Banana',
            key: 'BANANA',
          },
          id: '1',
          type: 'badges',
        },
      };

      // when
      const json = serializer.serialize(badge);

      // then
      expect(json).to.deep.equal(expectedSerializedBadge);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert JSON API data into a Badge model object', async function () {
      // given
      const jsonBadge = {
        data: {
          type: 'badge-update',
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
      const badge = await serializer.deserialize(jsonBadge);

      // then
      const expectedBadge = {
        key: 'BADGE_KEY',
        altMessage: 'alt-message',
        message: 'message',
        title: 'title',
        isCertifiable: false,
        isAlwaysVisible: true,
        imageUrl: 'https://example.net/image.svg',
      };
      expect(badge).to.deep.equal(expectedBadge);
    });
  });
});
