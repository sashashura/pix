// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createMembership = require('../../../../lib/domain/usecases/create-membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationArchivedError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-membership', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should insert a new membership with role ADMIN', async function () {
    // given
    const organization = domainBuilder.buildOrganization();
    const membershipRepository = {
      create: sinon.stub(),
      findByOrganizationId: sinon.stub().resolves([]),
    };
    const organizationRepository = {
      get: sinon.stub().resolves(organization),
    };
    const userId = 1;
    const role = Membership.roles.ADMIN;

    // when
    await createMembership({ userId, organizationId: organization.id, membershipRepository, organizationRepository });

    // then
    expect(membershipRepository.create).to.has.been.calledWithExactly(userId, organization.id, role);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should insert a new membership with role MEMBER', async function () {
    // given
    const organization = domainBuilder.buildOrganization();
    const membershipRepository = {
      create: sinon.stub(),
      findByOrganizationId: sinon.stub().resolves([{}]),
    };
    const organizationRepository = {
      get: sinon.stub().resolves(organization),
    };
    const userId = 1;
    const role = Membership.roles.MEMBER;

    // when
    await createMembership({ userId, organizationId: organization.id, membershipRepository, organizationRepository });

    // then
    expect(membershipRepository.create).to.has.been.calledWithExactly(userId, organization.id, role);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when organization is archived', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an organization archived error', async function () {
      // given
      const userId = domainBuilder.buildUser().id;
      const archivedOrganization = domainBuilder.buildOrganization({ archivedAt: '2022-02-02' });
      const membershipRepository = {
        create: sinon.stub(),
      };
      const organizationRepository = {
        get: sinon.stub().resolves(archivedOrganization),
      };

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createMembership)({
        userId,
        organizationId: archivedOrganization.id,
        membershipRepository,
        organizationRepository,
      });

      // then
      expect(error).to.be.instanceOf(OrganizationArchivedError);
      expect((error as $TSFixMe).message).to.be.equal("L'organisation est archivée.");
      expect(membershipRepository.create).to.not.have.been.called;
    });
  });
});
