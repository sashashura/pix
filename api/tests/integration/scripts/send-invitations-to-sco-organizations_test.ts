// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfO... Remove this comment to see the full error message
const BookshelfOrganizationInvitation = require('../../../lib/infrastructure/orm-models/OrganizationInvitation');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getOrganiz... Remove this comment to see the full error message
  getOrganizationByExternalId,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildInvit... Remove this comment to see the full error message
  buildInvitation,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prepareDat... Remove this comment to see the full error message
  prepareDataForSending,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sendJoinOr... Remove this comment to see the full error message
  sendJoinOrganizationInvitations,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/send-invitations-to-sco-organizations');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | send-invitations-to-sco-organizations.js', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getOrganizationByExternalId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get organization by externalId', async function () {
      // given
      const externalId = '1234567A';
      const organization = databaseBuilder.factory.buildOrganization({ externalId });
      const expectedOrganization = _.omit(organization, [
        'createdAt',
        'updatedAt',
        'email',
        'tags',
        'createdBy',
        'archivedBy',
        'identityProviderForCampaigns',
      ]);

      await databaseBuilder.commit();

      // when
      const result = await getOrganizationByExternalId(externalId);

      // then
      expect(
        _.omit(result, [
          'email',
          'memberships',
          'organizationInvitations',
          'students',
          'targetProfileShares',
          'tags',
          'createdBy',
        ])
      ).to.deep.equal(expectedOrganization);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#buildInvitation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build invitation by externalId and email', async function () {
      // given
      const email = 'user@example.net';
      const externalId = '1234567A';
      const organizationId = databaseBuilder.factory.buildOrganization({ externalId }).id;
      const expectedInvitation = { organizationId, email };

      await databaseBuilder.commit();

      // when
      const invitation = await buildInvitation({ externalId, email });

      // then
      expect(invitation).to.deep.equal(expectedInvitation);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#prepareDataForSending', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build a list of invitations with organizationId and email', async function () {
      // given
      const email1 = 'user1@example.net';
      const email2 = 'user2@example.net';
      const uaiA = '1234567A';
      const uaiB = '1234567B';

      const organizationAId = databaseBuilder.factory.buildOrganization({ externalId: uaiA }).id;
      const organizationBId = databaseBuilder.factory.buildOrganization({ externalId: uaiB }).id;

      const objectsFromFile = [
        { uai: uaiA, email: email1 },
        { uai: uaiB, email: email2 },
      ];
      const expectedInvitations = [
        { organizationId: organizationAId, email: email1 },
        { organizationId: organizationBId, email: email2 },
      ];

      await databaseBuilder.commit();

      // when
      const result = await prepareDataForSending(objectsFromFile);

      // then
      expect(result).to.deep.have.members(expectedInvitations);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#sendJoinOrganizationInvitations', function () {
    const getNumberOfOrganizationInvitations = () => {
      return BookshelfOrganizationInvitation.count().then((number: $TSFixMe) => parseInt(number, 10));
    };

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('organization-invitations').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should add organization invitations into database', async function () {
      // given
      const objectsForInvitations = ['user1@example', 'user2@example', 'user3@example', 'user4@example'].map(
        (email) => {
          const organizationId = databaseBuilder.factory.buildOrganization().id;
          return { organizationId, email };
        }
      );

      const numberBefore = await getNumberOfOrganizationInvitations();
      const tags = ['TEST'];

      await databaseBuilder.commit();

      // when
      await sendJoinOrganizationInvitations(objectsForInvitations, tags);
      const numberAfter = await getNumberOfOrganizationInvitations();
      const invitationsCreatedInDatabase = numberAfter - numberBefore;

      // then
      expect(invitationsCreatedInDatabase).to.equal(objectsForInvitations.length);
    });
  });
});
