// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationRepository = require('../../../../lib/infrastructure/repositories/organization-invitation-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationRepository = require('../../../../lib/infrastructure/repositories/organization-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../../../lib/domain/models/OrganizationInvitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createOrga... Remove this comment to see the full error message
const { createOrganizationInvitation } = require('../../../../lib/domain/services/organization-invitation-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Service | Organization-Invitation Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createOrganizationInvitation', function () {
    let clock: $TSFixMe;
    const now = new Date('2021-01-02');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      clock = sinon.useFakeTimers(now);
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('organization-invitations').delete();
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a new organization-invitation with organizationId, email, role and status', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      await databaseBuilder.commit();

      const email = 'member@organization.org';
      const role = Membership.roles.ADMIN;
      const expectedOrganizationInvitation = {
        organizationId,
        email,
        status: OrganizationInvitation.StatusType.PENDING,
        role,
      };

      // when
      const result = await createOrganizationInvitation({
        organizationId,
        email,
        role,
        organizationRepository,
        organizationInvitationRepository,
      });

      // then
      expect(result).to.be.instanceOf(OrganizationInvitation);
      expect(_.omit(result, ['id', 'code', 'organizationName', 'createdAt', 'updatedAt'])).to.deep.equal(
        expectedOrganizationInvitation
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should re-send an email with same code when organization-invitation already exist with status pending', async function () {
      // given
      const organizationInvitation = databaseBuilder.factory.buildOrganizationInvitation({
        status: OrganizationInvitation.StatusType.PENDING,
      });
      await databaseBuilder.commit();

      // when
      const result = await createOrganizationInvitation({
        organizationId: organizationInvitation.organizationId,
        email: organizationInvitation.email,
        organizationRepository,
        organizationInvitationRepository,
      });

      // then
      const expectedOrganizationInvitation = {
        ...organizationInvitation,
        updatedAt: now,
      };
      expect(_.omit(result, 'organizationName')).to.deep.equal(expectedOrganizationInvitation);
    });
  });
});
