const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeaderForApplication,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiSendingFactory = databaseBuilder.factory.poleEmploiSendingFactory;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../lib/config');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Pole Emploi envois', function () {
  let server: $TSFixMe, options;

  const POLE_EMPLOI_CLIENT_ID = 'poleEmploiClientId';
  const POLE_EMPLOI_SCOPE = 'pole-emploi-participants-result';
  const POLE_EMPLOI_SOURCE = 'poleEmploi';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/pole-emploi/envois', function () {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const originalEnv = settings.apiManager.url;

    // @ts-expect-error TS(2304): Cannot find name 'before'.
    before(function () {
      settings.apiManager.url = 'https://url-externe';
    });

    // @ts-expect-error TS(2304): Cannot find name 'after'.
    after(function () {
      settings.apiManager.url = originalEnv;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the request returns 200', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the sending and a link', async function () {
        const sending = poleEmploiSendingFactory.buildWithUser(
          {
            id: 76345,
            createdAt: new Date('2021-05-01'),
            payload: {
              campagne: {
                nom: 'Campagne PE',
                dateDebut: new Date('2020-08-01'),
                type: 'EVALUATION',
                codeCampagne: 'POLEEMPLOI123',
                urlCampagne: 'https://app.pix.fr/campagnes/POLEEMPLOI123',
                nomOrganisme: 'Pix',
                typeOrganisme: 'externe',
              },
              individu: { nom: 'Kamado', prenom: 'Tanjiro' },
              test: {
                etat: 2,
                typeTest: 'DI',
                referenceExterne: 123456,
                dateDebut: new Date('2020-09-01'),
                elementsEvalues: [],
              },
            },
            isSuccessful: true,
          },
          'externalUserId'
        );
        poleEmploiSendingFactory.buildWithUser({ isSuccessful: false });
        await databaseBuilder.commit();

        options = {
          method: 'GET',
          url: '/api/pole-emploi/envois?enErreur=false',
          headers: {
            authorization: generateValidRequestAuthorizationHeaderForApplication(
              POLE_EMPLOI_CLIENT_ID,
              POLE_EMPLOI_SOURCE,
              POLE_EMPLOI_SCOPE
            ),
          },
        };

        //when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.headers.link).to.equal(
          'https://url-externe/pole-emploi/envois?curseur=eyJpZEVudm9pIjo3NjM0NSwiZGF0ZUVudm9pIjoiMjAyMS0wNS0wMVQwMDowMDowMC4wMDBaIn0=&enErreur=false'
        );
        expect(response.result).to.deep.equal([
          {
            idEnvoi: sending.id,
            dateEnvoi: new Date('2021-05-01'),
            resultat: {
              campagne: {
                nom: 'Campagne PE',
                dateDebut: '2020-08-01T00:00:00.000Z',
                type: 'EVALUATION',
                codeCampagne: 'POLEEMPLOI123',
                urlCampagne: 'https://app.pix.fr/campagnes/POLEEMPLOI123',
                nomOrganisme: 'Pix',
                typeOrganisme: 'externe',
              },
              individu: {
                nom: 'Kamado',
                prenom: 'Tanjiro',
                idPoleEmploi: 'externalUserId',
              },
              test: {
                etat: 2,
                typeTest: 'DI',
                referenceExterne: 123456,
                dateDebut: '2020-09-01T00:00:00.000Z',
                elementsEvalues: [],
              },
            },
          },
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the request has failed', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 403 HTTP status code if user is not allowed to access', async function () {
        // given
        options = {
          method: 'GET',
          url: '/api/pole-emploi/envois',
          headers: {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            authorization: generateValidRequestAuthorizationHeaderForApplication(
              POLE_EMPLOI_CLIENT_ID,
              POLE_EMPLOI_SOURCE
            ),
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 401 HTTP status code if user is not authenticated', async function () {
        // given
        options = {
          method: 'GET',
          url: '/api/pole-emploi/envois',
          headers: { authorization: generateValidRequestAuthorizationHeader() },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });
});
