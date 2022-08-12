// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearnerColumns = require('../../../../lib/infrastructure/serializers/csv/sup-organization-learner-columns');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../../tests/tooling/i18n/i18n');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'i18n'.
const i18n = getI18n();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supOrganiz... Remove this comment to see the full error message
const supOrganizationLearnerColumns = new SupOrganizationLearnerColumns(i18n).columns
  .map((column: $TSFixMe) => column.label)
  .join(';');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'server'.
let server;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Application | organization-controller-import-sup-organization-learners', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    return knex('organization-learners').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST organizations/:id/schooling-registrations/import-csv', function () {
    let connectedUser: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      connectedUser = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is an admin for an organization which managing student', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('create organization-learners for the given organization', async function () {
        const organization = databaseBuilder.factory.buildOrganization({ type: 'SUP', isManagingStudents: true });
        databaseBuilder.factory.buildMembership({
          organizationId: organization.id,
          userId: connectedUser.id,
          organizationRole: Membership.roles.ADMIN,
        });
        await databaseBuilder.commit();
        const buffer =
          `${supOrganizationLearnerColumns}\n` +
          'Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1990;thebride@example.net;12346;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;Master;hello darkness my old friend\n' +
          'O-Ren;;;Ishii;Cottonmouth;01/01/1980;ishii@example.net;789;Assassination Squad;Bill;Deadly Viper Assassination Squad;DUT;Autre;';

        const options = {
          method: 'POST',
          url: `/api/organizations/${organization.id}/schooling-registrations/import-csv`,
          headers: {
            authorization: generateValidRequestAuthorizationHeader(connectedUser.id),
          },
          payload: buffer,
        };

        const response = await server.inject(options);
        const learners = await knex('organization-learners').where({ organizationId: organization.id });
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal({
          data: {
            id: String(organization.id),
            type: 'sup-organization-learner-warnings',
            attributes: {
              warnings: [
                {
                  code: 'unknown',
                  field: 'study-scheme',
                  studentNumber: '12346',
                  value: 'hello darkness my old friend',
                },
                { code: 'unknown', field: 'diploma', studentNumber: '12346', value: 'Master' },
                { code: 'unknown', field: 'diploma', studentNumber: '789', value: 'DUT' },
              ],
            },
          },
        });
        expect(learners).to.have.lengthOf(2);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('fails when the file payload is too large', async function () {
        const buffer = Buffer.alloc(1048576 * 11, 'B'); // > 10 Mo buffer

        const options = {
          method: 'POST',
          url: '/api/organizations/123/schooling-registrations/import-csv',
          headers: {
            authorization: generateValidRequestAuthorizationHeader(connectedUser.id),
          },
          payload: buffer,
        };

        const response = await server.inject(options);
        expect(response.statusCode).to.equal(413);
        expect(response.result.errors[0].code).to.equal('PAYLOAD_TOO_LARGE');
        expect(response.result.errors[0].meta.maxSize).to.equal('10');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is not an admin for the organization which managing student', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('create organization-learner for the given organization', async function () {
        const organization = databaseBuilder.factory.buildOrganization({ type: 'SUP', isManagingStudents: true });
        databaseBuilder.factory.buildMembership({
          organizationId: organization.id,
          userId: connectedUser.id,
          organizationRole: Membership.roles.MEMBER,
        });
        await databaseBuilder.commit();
        const buffer = supOrganizationLearnerColumns;

        const options = {
          method: 'POST',
          url: `/api/organizations/${organization.id}/schooling-registrations/import-csv`,
          headers: {
            authorization: generateValidRequestAuthorizationHeader(connectedUser.id),
          },
          payload: buffer,
        };

        const response = await server.inject(options);

        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when the user is an admin for the organization which managing student but the organization is not SUP',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('create organization-learners for the given organization', async function () {
          const organization = databaseBuilder.factory.buildOrganization({ type: 'SCO', isManagingStudents: true });
          databaseBuilder.factory.buildMembership({
            organizationId: organization.id,
            userId: connectedUser.id,
            organizationRole: Membership.roles.ADMIN,
          });
          await databaseBuilder.commit();
          const buffer = supOrganizationLearnerColumns;

          const options = {
            method: 'POST',
            url: `/api/organizations/${organization.id}/schooling-registrations/import-csv`,
            headers: {
              authorization: generateValidRequestAuthorizationHeader(connectedUser.id),
            },
            payload: buffer,
          };

          const response = await server.inject(options);

          expect(response.statusCode).to.equal(403);
        });
      }
    );
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST organizations/:id/sup-organization-learners/import-csv', function () {
    let connectedUser: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      connectedUser = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is an admin for an organization which managing student', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('create organization-learners for the given organization', async function () {
        const organization = databaseBuilder.factory.buildOrganization({ type: 'SUP', isManagingStudents: true });
        databaseBuilder.factory.buildMembership({
          organizationId: organization.id,
          userId: connectedUser.id,
          organizationRole: Membership.roles.ADMIN,
        });
        await databaseBuilder.commit();
        const buffer =
          `${supOrganizationLearnerColumns}\n` +
          'Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1990;thebride@example.net;12346;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;Master;hello darkness my old friend\n' +
          'O-Ren;;;Ishii;Cottonmouth;01/01/1980;ishii@example.net;789;Assassination Squad;Bill;Deadly Viper Assassination Squad;DUT;Autre;';

        const options = {
          method: 'POST',
          url: `/api/organizations/${organization.id}/sup-organization-learners/import-csv`,
          headers: {
            authorization: generateValidRequestAuthorizationHeader(connectedUser.id),
          },
          payload: buffer,
        };

        const response = await server.inject(options);
        const learners = await knex('organization-learners').where({ organizationId: organization.id });
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal({
          data: {
            id: String(organization.id),
            type: 'sup-organization-learner-warnings',
            attributes: {
              warnings: [
                {
                  code: 'unknown',
                  field: 'study-scheme',
                  studentNumber: '12346',
                  value: 'hello darkness my old friend',
                },
                { code: 'unknown', field: 'diploma', studentNumber: '12346', value: 'Master' },
                { code: 'unknown', field: 'diploma', studentNumber: '789', value: 'DUT' },
              ],
            },
          },
        });
        expect(learners).to.have.lengthOf(2);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('fails when the file payload is too large', async function () {
        const buffer = Buffer.alloc(1048576 * 11, 'B'); // > 10 Mo buffer

        const options = {
          method: 'POST',
          url: '/api/organizations/123/sup-organization-learners/import-csv',
          headers: {
            authorization: generateValidRequestAuthorizationHeader(connectedUser.id),
          },
          payload: buffer,
        };

        const response = await server.inject(options);
        expect(response.statusCode).to.equal(413);
        expect(response.result.errors[0].code).to.equal('PAYLOAD_TOO_LARGE');
        expect(response.result.errors[0].meta.maxSize).to.equal('10');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is not an admin for the organization which managing student', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('create organization-learner for the given organization', async function () {
        const organization = databaseBuilder.factory.buildOrganization({ type: 'SUP', isManagingStudents: true });
        databaseBuilder.factory.buildMembership({
          organizationId: organization.id,
          userId: connectedUser.id,
          organizationRole: Membership.roles.MEMBER,
        });
        await databaseBuilder.commit();
        const buffer = supOrganizationLearnerColumns;

        const options = {
          method: 'POST',
          url: `/api/organizations/${organization.id}/sup-organization-learners/import-csv`,
          headers: {
            authorization: generateValidRequestAuthorizationHeader(connectedUser.id),
          },
          payload: buffer,
        };

        const response = await server.inject(options);

        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when the user is an admin for the organization which managing student but the organization is not SUP',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('create organization-learners for the given organization', async function () {
          const organization = databaseBuilder.factory.buildOrganization({ type: 'SCO', isManagingStudents: true });
          databaseBuilder.factory.buildMembership({
            organizationId: organization.id,
            userId: connectedUser.id,
            organizationRole: Membership.roles.ADMIN,
          });
          await databaseBuilder.commit();
          const buffer = supOrganizationLearnerColumns;

          const options = {
            method: 'POST',
            url: `/api/organizations/${organization.id}/sup-organization-learners/import-csv`,
            headers: {
              authorization: generateValidRequestAuthorizationHeader(connectedUser.id),
            },
            payload: buffer,
          };

          const response = await server.inject(options);

          expect(response.statusCode).to.equal(403);
        });
      }
    );
  });
});
