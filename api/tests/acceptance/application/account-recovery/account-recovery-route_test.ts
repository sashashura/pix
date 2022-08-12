// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | Account-recovery', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/account-recovery', function () {
    let server: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      //given
      server = await createServer();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await databaseBuilder.knex('account-recovery-demands').delete();
    });

    const studentInformation = {
      ineIna: '123456789aa',
      firstName: 'Jude',
      lastName: 'Law',
      birthdate: '2016-06-01',
    };

    const createUserWithSeveralOrganizationLearners = async ({ email = 'jude.law@example.net' } = {}) => {
      const user = databaseBuilder.factory.buildUser.withRawPassword({
        id: 8,
        firstName: 'Judy',
        lastName: 'Howl',
        email,
        username: 'jude.law0601',
      });
      const organization = databaseBuilder.factory.buildOrganization({
        id: 7,
        name: 'Collège Hollywoodien',
      });
      const latestOrganization = databaseBuilder.factory.buildOrganization({
        id: 2,
        name: 'Super Collège Hollywoodien',
      });
      databaseBuilder.factory.buildOrganizationLearner({
        userId: user.id,
        ...studentInformation,
        nationalStudentId: studentInformation.ineIna.toUpperCase(),
        organizationId: organization.id,
        updatedAt: new Date('2005-01-01T15:00:00Z'),
      });
      databaseBuilder.factory.buildOrganizationLearner({
        userId: user.id,
        ...studentInformation,
        nationalStudentId: studentInformation.ineIna.toUpperCase(),
        organizationId: latestOrganization.id,
        updatedAt: new Date('2010-01-01T15:00:00Z'),
      });
      await databaseBuilder.commit();
    };

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 HTTP status code', async function () {
      // given
      await createUserWithSeveralOrganizationLearners();
      const newEmail = 'new_email@example.net';

      const options = {
        method: 'POST',
        url: '/api/account-recovery',
        payload: {
          data: {
            attributes: {
              'ine-ina': studentInformation.ineIna,
              'first-name': studentInformation.firstName,
              'last-name': studentInformation.lastName,
              birthdate: studentInformation.birthdate,
              email: newEmail,
            },
          },
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 400 if email already exists', async function () {
      // given
      const newEmail = 'new_email@example.net';
      await createUserWithSeveralOrganizationLearners({ email: newEmail });

      const options = {
        method: 'POST',
        url: '/api/account-recovery',
        payload: {
          data: {
            attributes: {
              'ine-ina': studentInformation.ineIna,
              'first-name': studentInformation.firstName,
              'last-name': studentInformation.lastName,
              birthdate: studentInformation.birthdate,
              email: newEmail,
            },
          },
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(400);
      expect(response.result.errors[0].detail).to.equal('Cette adresse e-mail est déjà utilisée.');
    });
  });
});
