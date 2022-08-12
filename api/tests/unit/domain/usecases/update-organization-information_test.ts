// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { updateOrganizationInformation } = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../../../lib/domain/models/Tag');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationTag = require('../../../../lib/domain/models/OrganizationTag');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-organization-information', function () {
  let organizationRepository: $TSFixMe;
  let organizationTagRepository: $TSFixMe;
  let tagRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    organizationRepository = {
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

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when organization exists', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow to update the organization name (only) if modified', async function () {
      // given
      const newName = 'New name';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        name: newName,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationRepository });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        name: newName,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow to update the organization type (only) if modified', async function () {
      // given
      const newType = 'PRO';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        type: newType,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationRepository });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, type: newType });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow to update the organization logo URL (only) if modified', async function () {
      // given
      const newLogoUrl = 'http://new.logo.url';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        logoUrl: newLogoUrl,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationRepository });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        logoUrl: newLogoUrl,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow to update the organization external id (only) if modified', async function () {
      // given
      const externalId = '9752145V';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        externalId,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationRepository });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, externalId });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow to update the organization external id with null value', async function () {
      // given
      const externalId = null;
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        externalId,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationRepository });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, externalId });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow to update the organization province code (only) if modified', async function () {
      // given
      const provinceCode = '975';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        provinceCode,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationRepository });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, provinceCode });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow to update the organization province code with null value', async function () {
      // given
      const provinceCode = null;
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        provinceCode,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationRepository });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, provinceCode });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow to update the organization isManagingStudents (only) if modified', async function () {
      // given
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        isManagingStudents: false,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationRepository });
      expect(organizationRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        isManagingStudents: false,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow to update the organization email', async function () {
      // given
      const newEmail = 'sco.generic.newaccount@example.net';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        email: newEmail,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationRepository });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, email: newEmail });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow to update the organization credit', async function () {
      // given
      const newCredit = 100;
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        credit: newCredit,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationRepository });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        credit: newCredit,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow to update the organization documentationUrl', async function () {
      // given
      const newDocumentationUrl = 'https://pix.fr/';
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        documentationUrl: newDocumentationUrl,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationRepository });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        documentationUrl: newDocumentationUrl,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow to update the organization showSkills flag', async function () {
      // given
      const newShowSkills = true;
      const organizationId = 7;
      const givenOrganization = _buildOrganizationWithNullAttributes({
        id: organizationId,
        showSkills: newShowSkills,
      });
      const originalOrganization = _buildOriginalOrganization(organizationId);

      organizationRepository.get.resolves(originalOrganization);

      // when
      await updateOrganizationInformation({ organization: givenOrganization, organizationRepository });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({
        ...originalOrganization,
        showSkills: newShowSkills,
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when updating tags', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

        organizationRepository.get.withArgs(organizationId).resolves(originalOrganization);
        tagRepository.get.withArgs(tagToAdd.id).resolves(originalTag);

        // when
        await updateOrganizationInformation({
          organization: givenOrganization,
          organizationRepository,
          organizationTagRepository,
          tagRepository,
        });

        // given
        const organizationTagToAdd = new OrganizationTag({ organizationId, tagId });
        expect(organizationTagRepository.create).to.have.been.calledWith(organizationTagToAdd);
        expect(organizationTagRepository.delete).to.have.not.been.called;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

        organizationRepository.get.withArgs(organizationId).resolves(originalOrganization);
        tagRepository.get.withArgs(originalTag.id).resolves(originalTag);
        organizationTagRepository.findOneByOrganizationIdAndTagId
          .withArgs({ organizationId: originalOrganization.id, tagId: originalTag.id })
          .resolves(organizationTagToRemove);

        // when
        await updateOrganizationInformation({
          organization: givenOrganization,
          organizationRepository,
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

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when an error occurred', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject a NotFoundError (DomainError) when the organization does not exist', async function () {
      // given
      const givenOrganization = _buildOrganizationWithNullAttributes({ id: 8 });
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      organizationRepository.get.rejects(new NotFoundError('Not found organization'));

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateOrganizationInformation)({
        organization: givenOrganization,
        organizationRepository,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});

function _buildOrganizationWithNullAttributes(attributes: $TSFixMe) {
  return new Organization({
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
  });
}

function _buildOriginalOrganization(organizationId: $TSFixMe) {
  return domainBuilder.buildOrganization({
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
