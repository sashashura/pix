const { expect } = require('../../test-helper');
const { banners } = require('../../../lib/config');

const createServer = require('../../../server');
const sinon = require('sinon');

describe('Acceptance | Controller | feature-toggle-controller', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();

    sinon.stub(banners, 'certif').value({
      type: 'warning',
      message:
        'Il est possible que votre expérience sur Pix soit dégradée suite à des perturbations. Le problème est en cours de résolution. Merci de votre compréhension.',
    });
  });

  describe('GET /api/feature-toggles', function () {
    const options = {
      method: 'GET',
      url: '/api/feature-toggles',
    };

    describe('when the app parameter is not passed', () => {
      it('should return 200 with feature toggles', async function () {
        // given
        const expectedData = {
          data: {
            id: '0',
            attributes: {
              'is-certification-billing-enabled': false,
              'is-email-validation-enabled': false,
              'is-complementary-certification-subscription-enabled': false,
              'is-new-tutorials-page-enabled': false,
            },
            type: 'feature-toggles',
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal(expectedData);
      });
    });

    describe.only('when passing the app parameter', () => {
      describe('and there is a banner', () => {
        const options = {
          method: 'GET',
          url: '/api/feature-toggles?app=certif',
        };

        it('should return 200 with feature toggles + the app banner', async function () {
          // given
          const expectedData = {
            data: {
              id: '0',
              attributes: {
                'is-certification-billing-enabled': false,
                'is-email-validation-enabled': false,
                'is-complementary-certification-subscription-enabled': false,
                'is-new-tutorials-page-enabled': false,
                banner: {
                  type: 'warning',
                  message:
                    'Il est possible que votre expérience sur Pix soit dégradée suite à des perturbations. Le problème est en cours de résolution. Merci de votre compréhension.',
                },
              },
              type: 'feature-toggles',
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
          expect(response.result).to.deep.equal(expectedData);
        });
      });

      describe.only('but there is no banner', () => {
        const options = {
          method: 'GET',
          url: '/api/feature-toggles?app=orga',
        };

        it('should return 200 with feature toggles and no banner', async function () {
          // given
          const expectedData = {
            data: {
              id: '0',
              attributes: {
                'is-certification-billing-enabled': false,
                'is-email-validation-enabled': false,
                'is-complementary-certification-subscription-enabled': false,
                'is-new-tutorials-page-enabled': false,
              },
              type: 'feature-toggles',
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
          expect(response.result).to.deep.equal(expectedData);
        });
      });
    });
  });
});
