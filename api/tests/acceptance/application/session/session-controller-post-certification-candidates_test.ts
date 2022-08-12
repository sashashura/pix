// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
  domainBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-post-certification-candidates', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    let options: $TSFixMe;
    let payload;
    let sessionId;
    let userId;
    let certificationCandidate: $TSFixMe;
    let certificationCpfCountry: $TSFixMe;
    let certificationCpfCity: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      certificationCandidate = domainBuilder.buildCertificationCandidate.pro({
        birthCountry: 'FRANCE',
        birthINSEECode: '75115',
        birthPostalCode: null,
        birthCity: null,
      });
      userId = databaseBuilder.factory.buildUser().id;

      databaseBuilder.factory.buildOrganization({
        type: 'PRO',
        name: 'PRO_ORGANIZATION',
        externalId: 'EXTERNAL_ID',
      });

      const { id: certificationCenterId, name: certificationCenter } = databaseBuilder.factory.buildCertificationCenter(
        {
          name: 'PRO_CERTIFICATION_CENTER',
          type: 'PRO',
          externalId: 'EXTERNAL_ID',
        }
      );

      sessionId = databaseBuilder.factory.buildSession({ certificationCenterId, certificationCenter }).id;
      databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
      certificationCpfCountry = databaseBuilder.factory.buildCertificationCpfCountry({
        name: 'FRANCE',
        code: '99100',
        matcher: 'ACEFNR',
      });
      certificationCpfCity = databaseBuilder.factory.buildCertificationCpfCity({
        name: 'PARIS 15',
        INSEECode: '75115',
      });
      const complementaryCertification1Id = databaseBuilder.factory.buildComplementaryCertification({
        name: 'Certif complémentaire 1',
      }).id;
      const complementaryCertification2Id = databaseBuilder.factory.buildComplementaryCertification({
        name: 'Certif complémentaire 2',
      }).id;

      payload = {
        data: {
          type: 'certification-candidates',
          attributes: {
            'first-name': certificationCandidate.firstName,
            'last-name': certificationCandidate.lastName,
            'birth-city': null,
            'birth-country': certificationCandidate.birthCountry,
            email: certificationCandidate.email,
            'result-recipient-email': certificationCandidate.resultRecipientEmail,
            'external-id': certificationCandidate.externalId,
            birthdate: certificationCandidate.birthdate,
            'extra-time-percentage': certificationCandidate.extraTimePercentage,
            'has-seen-end-test-screen': certificationCandidate.hasSeenEndTestScreen,
            'birth-insee-code': certificationCandidate.birthINSEECode,
            'birth-postal-code': null,
            'billing-mode': 'FREE',
            sex: certificationCandidate.sex,
            'complementary-certifications': [
              { id: complementaryCertification1Id, name: 'Certif complémentaire 1' },
              { id: complementaryCertification2Id, name: 'Certif complémentaire 2' },
            ],
          },
        },
      };
      options = {
        method: 'POST',
        url: `/api/sessions/${sessionId}/certification-candidates`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
        },
        payload,
      };

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('complementary-certification-subscriptions').delete();
      return knex('certification-candidates').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should respond with a 201 created', async function () {
      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(201);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the saved certification candidate', async function () {
      // when
      const response = await server.inject(options);

      // then
      const expectedData = {
        type: 'certification-candidates',
        attributes: {
          'first-name': certificationCandidate.firstName,
          'last-name': certificationCandidate.lastName,
          birthdate: certificationCandidate.birthdate,
          'birth-city': certificationCpfCity.name,
          'birth-country': certificationCpfCountry.commonName,
          'birth-province-code': null,
          'billing-mode': 'Gratuite',
          'prepayment-code': null,
          'result-recipient-email': certificationCandidate.resultRecipientEmail,
          email: certificationCandidate.email,
          'external-id': certificationCandidate.externalId,
          'extra-time-percentage': certificationCandidate.extraTimePercentage,
          'is-linked': false,
          'schooling-registration-id': null,
          'organization-learner-id': null,
          'birth-insee-code': certificationCpfCity.INSEECode,
          'birth-postal-code': null,
          sex: certificationCandidate.sex,
          'complementary-certifications': [],
        },
      };

      expect(_.omit(response.result.data, 'id')).to.deep.equal(expectedData);
      expect(response.result.data.id).to.exist;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save the complementary certification subscriptions', async function () {
      // when
      await server.inject(options);

      // then
      const complementaryCertificationRegistrationsInDB = await knex('complementary-certification-subscriptions');
      expect(complementaryCertificationRegistrationsInDB.length).to.equal(2);
    });
  });
});
