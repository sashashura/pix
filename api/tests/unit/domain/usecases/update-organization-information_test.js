const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
const { updateOrganizationInformation } = require('../../../../lib/domain/usecases');
const { NotFoundError } = require('../../../../lib/domain/errors');
const Tag = require('../../../../lib/domain/models/Tag');
const OrganizationTag = require('../../../../lib/domain/models/OrganizationTag');
const OrganizationForAdmin = require('../../../../lib/domain/models/OrganizationForAdmin');
const OidcIdentityProviders = require('../../../../lib/domain/constants/oidc-identity-providers');

describe('Unit | UseCase | update-organization-information', function () {
  let organizationForAdminRepository;
  let organizationTagRepository;
  let tagRepository;

  beforeEach(function () {
    organizationForAdminRepository = {
      get: sinon.stub(),
      update: sinon.stub(),
    };
    organizationTagRepository = {
      create: sinon.stub(),
      delete: sinon.stub(),
      findOneByOrganizationIdAndTagId: sinon.stub(),
    };
    tagRepository = {
      get: sinon.stub(),
    };
  });

  context('when organization exists', function () {
    it('should allow to update the organization name (only) if modified', async function () {
      // given
      const newName = 'New name';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        name: newName,
        identityProviderForCampaigns: OidcIdentityProviders.CNAV.code,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationForAdminRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationForAdminRepository });

      // then
      expect(organizationForAdminRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        name: newName,
        identityProviderForCampaigns: OidcIdentityProviders.CNAV.code,
      });
    });

    it('should allow to update the organization type (only) if modified', async function () {
      // given
      const newType = 'PRO';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        type: newType,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationForAdminRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationForAdminRepository });

      // then
      expect(organizationForAdminRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        type: newType,
      });
    });

    it('should allow to update the organization logo URL (only) if modified', async function () {
      // given
      const newLogoUrl = 'http://new.logo.url';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        logoUrl: newLogoUrl,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationForAdminRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationForAdminRepository });

      // then
      expect(organizationForAdminRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        logoUrl: newLogoUrl,
      });
    });

    it('should allow to update the organization external id (only) if modified', async function () {
      // given
      const externalId = '9752145V';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        externalId,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationForAdminRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationForAdminRepository });

      // then
      expect(organizationForAdminRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        externalId,
      });
    });

    it('should allow to update the organization external id with null value', async function () {
      // given
      const externalId = null;
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        externalId,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationForAdminRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationForAdminRepository });

      // then
      expect(organizationForAdminRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        externalId,
      });
    });

    it('should allow to update the organization province code (only) if modified', async function () {
      // given
      const provinceCode = '975';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        provinceCode,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationForAdminRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationForAdminRepository });

      // then
      expect(organizationForAdminRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        provinceCode,
      });
    });

    it('should allow to update the organization province code with null value', async function () {
      // given
      const provinceCode = null;
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        provinceCode,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationForAdminRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationForAdminRepository });

      // then
      expect(organizationForAdminRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        provinceCode,
      });
    });

    it('should allow to update the organization isManagingStudents (only) if modified', async function () {
      // given
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        isManagingStudents: false,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationForAdminRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationForAdminRepository });
      expect(organizationForAdminRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        isManagingStudents: false,
      });
    });

    it('should allow to update the organization email', async function () {
      // given
      const newEmail = 'sco.generic.newaccount@example.net';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        email: newEmail,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationForAdminRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationForAdminRepository });

      // then
      expect(organizationForAdminRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        email: newEmail,
      });
    });

    it('should allow to update the organization credit', async function () {
      // given
      const newCredit = 100;
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        credit: newCredit,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationForAdminRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationForAdminRepository });

      // then
      expect(organizationForAdminRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        credit: newCredit,
      });
    });

    it('should allow to update the organization documentationUrl', async function () {
      // given
      const newDocumentationUrl = 'https://pix.fr/';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        documentationUrl: newDocumentationUrl,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationForAdminRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationForAdminRepository });

      // then
      expect(organizationForAdminRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        documentationUrl: newDocumentationUrl,
      });
    });

    it('should allow to update the organization showSkills flag', async function () {
      // given
      const newShowSkills = true;
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        showSkills: newShowSkills,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationForAdminRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationForAdminRepository });

      // then
      expect(organizationForAdminRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        showSkills: newShowSkills,
      });
    });

    context('when updating tags', function () {
      it('should allow to assign a tag to organization', async function () {
        // given
        const organizationId = 7;
        const tagId = 4;
        const tagToAdd = new Tag({ id: tagId });
        const givenOrganization = _buildOrganizationWithNullAttributes({
          id: organizationId,
          tags: [tagToAdd],
        });

        const originalOrganization = _buildOriginalOrganization(organizationId);
        const originalTag = domainBuilder.buildTag({ id: tagId, name: 'SCO' });

        organizationForAdminRepository.get.withArgs(organizationId).resolves(originalOrganization);
        tagRepository.get.withArgs(tagToAdd.id).resolves(originalTag);

        // when
        await updateOrganizationInformation({
          organization: givenOrganization,
          organizationForAdminRepository,
          organizationTagRepository,
          tagRepository,
        });

        // given
        const organizationTagToAdd = new OrganizationTag({ organizationId, tagId });
        expect(organizationTagRepository.create).to.have.been.calledWith(organizationTagToAdd);
        expect(organizationTagRepository.delete).to.have.not.been.called;
      });

      it('should allow to unassign a tag to organization', async function () {
        // given
        const organizationId = 7;
        const givenOrganization = _buildOrganizationWithNullAttributes({
          id: organizationId,
          tags: [],
        });

        const originalTag = domainBuilder.buildTag({ id: 4, name: 'SCO' });
        const originalOrganization = domainBuilder.buildOrganization({
          id: organizationId,
          tags: [originalTag],
        });
        const organizationTagToRemove = domainBuilder.buildOrganizationTag({
          organizationId: originalOrganization.id,
          tagId: originalTag.id,
        });

        organizationForAdminRepository.get.withArgs(organizationId).resolves(originalOrganization);
        tagRepository.get.withArgs(originalTag.id).resolves(originalTag);
        organizationTagRepository.findOneByOrganizationIdAndTagId
          .withArgs({ organizationId: originalOrganization.id, tagId: originalTag.id })
          .resolves(organizationTagToRemove);

        // when
        await updateOrganizationInformation({
          organization: givenOrganization,
          organizationForAdminRepository,
          organizationTagRepository,
          tagRepository,
        });

        // given
        expect(organizationTagRepository.delete).to.have.been.calledWith({
          organizationTagId: organizationTagToRemove.id,
        });
        expect(organizationTagRepository.create).to.have.not.been.called;
      });
    });
  });

  context('when an error occurred', function () {
    it('should reject a NotFoundError (DomainError) when the organization does not exist', async function () {
      // given
      const givenOrganization = _buildOrganizationWithNullAttributes({ id: 8 });
      organizationForAdminRepository.get.rejects(new NotFoundError('Not found organization'));

      // when
      const error = await catchErr(updateOrganizationInformation)({
        organization: givenOrganization,
        organizationForAdminRepository,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});

function _buildOrganizationWithNullAttributes(attributes) {
  return new OrganizationForAdmin({
    id: attributes.id,
    name: attributes.name,
    type: attributes.type,
    logoUrl: attributes.logoUrl,
    externalId: attributes.externalId,
    provinceCode: attributes.provinceCode,
    isManagingStudents: attributes.isManagingStudents,
    email: attributes.email,
    credit: attributes.credit,
    tags: attributes.tags,
    documentationUrl: attributes.documentationUrl,
    showSkills: attributes.showSkills,
    identityProviderForCampaigns: attributes.identityProviderForCampaigns,
  });
}

function _buildOriginalOrganization(organizationId) {
  return domainBuilder.buildOrganizationForAdmin({
    id: organizationId,
    name: 'Organization du lycée St Cricq',
    type: 'SCO',
    logoUrl: 'http://old.logo.url',
    externalId: 'extId',
    provinceCode: '666',
    isManagingStudents: true,
    email: null,
    credit: null,
  });
}
