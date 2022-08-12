// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationTag = require('../../../../lib/domain/models/OrganizationTag');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainTran... Remove this comment to see the full error message
const domainTransaction = require('../../../../lib/infrastructure/DomainTransaction');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createProOrganizations = require('../../../../lib/domain/usecases/create-pro-organizations-with-tags');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationService = require('../../../../lib/domain/services/organization-invitation-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationValidator = require('../../../../lib/domain/validators/organization-with-tags-script');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ManyOrgani... Remove this comment to see the full error message
  ManyOrganizationsFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
  ObjectValidationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationAlreadyExistError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationTagNotFound,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-pro-organizations-with-tags', function () {
  let organizationRepositoryStub: $TSFixMe;
  let organizationTagRepositoryStub: $TSFixMe;
  let organizationInvitationRepositoryStub: $TSFixMe;

  const allTags = [
    { id: 1, name: 'TAG1' },
    { id: 2, name: 'TAG2' },
    { id: 3, name: 'TAG3' },
  ];

  let tagRepositoryStub: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    organizationRepositoryStub = {
      findByExternalIdsFetchingIdsOnly: sinon.stub(),
      batchCreateProOrganizations: sinon.stub(),
    };
    organizationTagRepositoryStub = {
      batchCreate: sinon.stub(),
    };
    tagRepositoryStub = {
      findAll: sinon.stub(),
    };
    organizationInvitationRepositoryStub = {};

    domainTransaction.execute = (lambda: $TSFixMe) => {
      return lambda(Symbol());
    };

    sinon.stub(organizationInvitationService, 'createProOrganizationInvitation').resolves();
    sinon.stub(organizationValidator, 'validate');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an ObjectValidationError if organizations are undefined', async function () {
    // given
    const organizations = undefined;

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(createProOrganizations)({ organizations });

    // then
    expect(error).to.be.an.instanceOf(ObjectValidationError);
    expect((error as $TSFixMe).message).to.be.equals('Les organisations ne sont pas renseignées.');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an error if the same organization appears twice', async function () {
    // given
    const organizations = [{ externalId: 'externalId' }, { externalId: 'externalId' }];

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(createProOrganizations)({ organizations });

    // then
    expect(error).to.be.an.instanceOf(ManyOrganizationsFoundError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should validate organization data before trying to create organizations', async function () {
    // given
    const organizations = [
      { name: '', externalId: 'AB1234', email: 'fake@axample.net', createdBy: 4, tags: 'tag1_tag2' },
    ];

    // when
    tagRepositoryStub.findAll.resolves(allTags);
    organizationRepositoryStub.batchCreateProOrganizations.resolves(organizations);

    // when
    await createProOrganizations({
      domainTransaction,
      organizations: organizations,
      organizationRepository: organizationRepositoryStub,
      tagRepository: tagRepositoryStub,
      organizationTagRepository: organizationTagRepositoryStub,
    });

    // then
    expect(organizationValidator.validate).to.have.been.calledWith(organizations[0]);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an error when organization tags not exists', async function () {
    // given
    const firstOrganization = {
      id: 1,
      name: 'organization A',
      externalId: 'externalId A',
      tags: 'TagNotFound',
      type: 'PRO',
      email: 'fake@axample.net',
      createdBy: 4,
    };
    const secondOrganization = {
      id: 2,
      name: 'organization B',
      externalId: 'externalId B',
      tags: 'Tag1_Tag2',
      type: 'PRO',
      email: 'fake@axample.net',
      createdBy: 4,
    };

    organizationRepositoryStub.findByExternalIdsFetchingIdsOnly.resolves([]);
    tagRepositoryStub.findAll.resolves(allTags);
    organizationRepositoryStub.batchCreateProOrganizations.resolves([
      domainBuilder.buildOrganization(firstOrganization),
      domainBuilder.buildOrganization(secondOrganization),
    ]);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(createProOrganizations)({
      domainTransaction,
      organizations: [firstOrganization, secondOrganization],
      organizationRepository: organizationRepositoryStub,
      tagRepository: tagRepositoryStub,
      organizationTagRepository: organizationTagRepositoryStub,
    });

    // then
    expect(error).to.be.instanceOf(OrganizationTagNotFound);
    expect((error as $TSFixMe).message).to.be.equal("Le tag TagNotFound de l'organisation organization A n'existe pas.");
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should add organizations into database', async function () {
    // given
    const organization = {
      id: 1,
      name: 'organization A',
      externalId: 'externalId A',
      tags: 'Tag1_Tag2_Tag3',
      type: 'PRO',
      email: 'fake@example.net',
      createdBy: 4,
    };
    // eslint-disable-next-line no-unused-vars
    const { email, ...organizationWithoutEmail } = new Organization(organization);

    const expectedProOrganizationToInsert = [organizationWithoutEmail];
    tagRepositoryStub.findAll.resolves(allTags);
    organizationRepositoryStub.batchCreateProOrganizations.resolves([organizationWithoutEmail]);

    // when
    await createProOrganizations({
      domainTransaction,
      organizations: [organization],
      organizationRepository: organizationRepositoryStub,
      tagRepository: tagRepositoryStub,
      organizationTagRepository: organizationTagRepositoryStub,
    });

    // then
    expect(organizationRepositoryStub.batchCreateProOrganizations).to.be.calledWith(expectedProOrganizationToInsert);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should add organization tags when exists', async function () {
    // given
    const firstOrganization = {
      id: 1,
      name: 'organization A',
      externalId: 'externalId A',
      tags: 'Tag1',
      type: 'PRO',
      email: 'fake@axample.net',
      createdBy: 4,
    };
    const secondOrganization = {
      id: 2,
      name: 'organization B',
      externalId: 'externalId B',
      tags: 'Tag1_Tag2',
      type: 'PRO',
      email: 'fake@axample.net',
      createdBy: 4,
    };

    const expectedOrganizationTag1ToInsert = new OrganizationTag({ organizationId: firstOrganization.id, tagId: 1 });
    const expectedOrganizationTag2ToInsert = new OrganizationTag({ organizationId: secondOrganization.id, tagId: 1 });
    const expectedOrganizationTag3ToInsert = new OrganizationTag({ organizationId: secondOrganization.id, tagId: 2 });
    const expectedOrganizationTagsToInsert = [
      expectedOrganizationTag1ToInsert,
      expectedOrganizationTag2ToInsert,
      expectedOrganizationTag3ToInsert,
    ];

    organizationRepositoryStub.findByExternalIdsFetchingIdsOnly.resolves([]);
    tagRepositoryStub.findAll.resolves(allTags);
    organizationRepositoryStub.batchCreateProOrganizations.resolves([
      domainBuilder.buildOrganization(firstOrganization),
      domainBuilder.buildOrganization(secondOrganization),
    ]);

    // when
    await createProOrganizations({
      domainTransaction,
      organizations: [firstOrganization, secondOrganization],
      organizationRepository: organizationRepositoryStub,
      tagRepository: tagRepositoryStub,
      organizationTagRepository: organizationTagRepositoryStub,
    });

    // then
    expect(organizationTagRepositoryStub.batchCreate).to.be.calledWith(expectedOrganizationTagsToInsert);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create invitation for organizations with email and role', async function () {
    // given
    const firstOrganizationWithAdminRole = {
      id: 1,
      name: 'organization A',
      externalId: 'externalId A',
      tags: 'Tag1',
      email: 'organizationA@exmaple.net',
      organizationInvitationRole: Membership.roles.ADMIN,
      locale: 'en',
      type: 'PRO',
      createdBy: 4,
    };
    const secondOrganizationWithMemberRole = {
      id: 2,
      name: 'organization B',
      externalId: 'externalId B',
      tags: 'Tag2',
      email: 'organizationB@exmaple.net',
      organizationInvitationRole: Membership.roles.MEMBER,
      type: 'PRO',
      createdBy: 4,
    };

    organizationRepositoryStub.findByExternalIdsFetchingIdsOnly.resolves([]);
    tagRepositoryStub.findAll.resolves(allTags);
    organizationRepositoryStub.batchCreateProOrganizations.resolves([
      domainBuilder.buildOrganization(firstOrganizationWithAdminRole),
      domainBuilder.buildOrganization(secondOrganizationWithMemberRole),
    ]);

    // when
    await createProOrganizations({
      domainTransaction,
      organizations: [firstOrganizationWithAdminRole, secondOrganizationWithMemberRole],
      organizationRepository: organizationRepositoryStub,
      tagRepository: tagRepositoryStub,
      organizationTagRepository: organizationTagRepositoryStub,
      organizationInvitationRepository: organizationInvitationRepositoryStub,
    });

    // then
    expect(organizationInvitationService.createProOrganizationInvitation).to.have.been.calledWith({
      organizationRepository: organizationRepositoryStub,
      organizationInvitationRepository: organizationInvitationRepositoryStub,
      organizationId: firstOrganizationWithAdminRole.id,
      name: firstOrganizationWithAdminRole.name,
      email: firstOrganizationWithAdminRole.email,
      role: firstOrganizationWithAdminRole.organizationInvitationRole,
      locale: firstOrganizationWithAdminRole.locale,
    });
    expect(organizationInvitationService.createProOrganizationInvitation).to.have.been.calledWith({
    organizationRepository: organizationRepositoryStub,
    organizationInvitationRepository: organizationInvitationRepositoryStub,
    organizationId: secondOrganizationWithMemberRole.id,
    name: secondOrganizationWithMemberRole.name,
    email: secondOrganizationWithMemberRole.email,
    role: secondOrganizationWithMemberRole.organizationInvitationRole,
    locale: (secondOrganizationWithMemberRole as $TSFixMe).locale,
});
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should not create invitation if organization email is empty', async function () {
    // given
    const organizationWithoutEmail = {
      id: 1,
      name: 'organization A',
      externalId: 'externalId A',
      tags: 'TAG1',
      email: null,
      type: 'PRO',
      createdBy: 4,
    };

    organizationRepositoryStub.findByExternalIdsFetchingIdsOnly.resolves([]);
    tagRepositoryStub.findAll.resolves(allTags);
    organizationRepositoryStub.batchCreateProOrganizations.resolves([
      domainBuilder.buildOrganization(organizationWithoutEmail),
    ]);

    // when
    await createProOrganizations({
      domainTransaction,
      organizations: [organizationWithoutEmail],
      organizationRepository: organizationRepositoryStub,
      tagRepository: tagRepositoryStub,
      organizationTagRepository: organizationTagRepositoryStub,
      organizationInvitationRepository: organizationInvitationRepositoryStub,
    });

    // then
    expect(organizationInvitationService.createProOrganizationInvitation).to.not.have.been.called;
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when an organization already exists in database', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // given

      const organizations = [
        { externalId: 'Ab1234', name: 'fake', email: 'fake@axample.net', createdBy: 4 },
        { externalId: 'Cd456', name: 'fake', email: 'fake@axample.net', createdBy: 4 },
      ];
      organizationRepositoryStub.findByExternalIdsFetchingIdsOnly.resolves([
        { id: '1', externalId: 'Ab1234' },
        { id: '2', externalId: 'Cd456' },
      ]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createProOrganizations)({
        organizations,
        organizationRepository: organizationRepositoryStub,
      });

      // then
      expect(error).to.be.an.instanceOf(OrganizationAlreadyExistError);
      expect((error as $TSFixMe).message).to.equal('Les organisations avec les externalIds suivants : Ab1234, Cd456 existent déjà.');
    });
  });
});
