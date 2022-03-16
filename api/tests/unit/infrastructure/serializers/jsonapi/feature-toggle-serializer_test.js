const { expect } = require('../../../../test-helper');
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/feature-toggle-serializer');

describe('Unit | Serializer | JSONAPI | feature-toggle-serializer', function () {
  describe('#serialize', function () {
    describe('if there is no banner', () => {
      it('should convert feature-toggle object into JSON API data', function () {
        // given
        const featureToggles = {
          someFeatureToggle: true,
        };
        const expectedJSON = {
          data: {
            type: 'feature-toggles',
            id: '0',
            attributes: {
              'some-feature-toggle': true,
            },
          },
        };

        // when
        const json = serializer.serialize(featureToggles);

        // then
        expect(json).to.deep.equal(expectedJSON);
      });
    });

    describe('if there is one banner', () => {
      it('should convert config object into JSON API data', function () {
        // given
        const featureToggles = {
          someFeatureToggle: true,
          banner: {
            type: 'warning',
            message:
              'Il est possible que votre expérience sur Pix soit dégradée suite à des perturbations. Le problème est en cours de résolution. Merci de votre compréhension.',
          },
        };
        const expectedJSON = {
          data: {
            type: 'feature-toggles',
            id: '0',
            attributes: {
              'some-feature-toggle': true,
              banner: {
                type: 'warning',
                message:
                  'Il est possible que votre expérience sur Pix soit dégradée suite à des perturbations. Le problème est en cours de résolution. Merci de votre compréhension.',
              },
            },
          },
        };

        // when
        const json = serializer.serialize(featureToggles);

        // then
        expect(json).to.deep.equal(expectedJSON);
      });
    });
  });
});
