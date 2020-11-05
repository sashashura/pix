const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
const { updateOrganizationInformation } = require('../../../../lib/domain/usecases');
const { logoDimensions } = require('../../../../lib/domain/models/Organization');
const { NotFoundError } = require('../../../../lib/domain/errors');

describe('Unit | UseCase | update-organization-information', () => {

  let originalOrganization;
  let organizationRepository;
  const imageUtils = {
    scaleDownBase64FormattedImage: sinon.stub(),
  };

  beforeEach(() => {
    originalOrganization = domainBuilder.buildOrganization({
      name: 'Old name',
      type: 'SCO',
      logoUrl: 'http://old.logo.url',
      externalId: 'extId',
      provinceCode: '666',
      isManagingStudents: true,
      canCollectProfiles: true,
      email: null,
      credit: null,
    });
    organizationRepository = {
      get: sinon.stub().resolves(originalOrganization),
      update: sinon.stub(),
    };
  });

  context('when organization exists', () => {

    it('should allow to update the organization name (only) if modified', async () => {
      // given
      const newName = 'New name';

      // when
      await updateOrganizationInformation({
        id: originalOrganization.id,
        name: newName,
        organizationRepository,
        imageUtils,
      });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, name: newName });
    });

    it('should allow to update the organization type (only) if modified', async () => {
      // given
      const newType = 'PRO';

      // when
      await updateOrganizationInformation({
        id: originalOrganization.id,
        type: newType,
        organizationRepository,
        imageUtils,
      });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, type: newType });
    });

    it('should allow to update a scaled down organization logo URL (only) if modified', async () => {
      // given
      const newLogoUrl = 'http://new.logo.url';
      const scaledDownNewLogo = Symbol('scaledDownLogo');
      imageUtils.scaleDownBase64FormattedImage
        .withArgs({
          originImage: newLogoUrl,
          height: logoDimensions.HEIGHT,
          width: logoDimensions.WIDTH,
        }).resolves({ scaledDownImage: scaledDownNewLogo });

      // when
      await updateOrganizationInformation({
        id: originalOrganization.id,
        logoUrl: newLogoUrl,
        organizationRepository,
        imageUtils,
      });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, logoUrl: scaledDownNewLogo });
    });

    it('should allow to update the organization external id (only) if modified', async () => {
      // given
      const externalId = '9752145V';

      // when
      await updateOrganizationInformation({
        id: originalOrganization.id,
        externalId,
        organizationRepository,
        imageUtils,
      });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, externalId });
    });

    it('should allow to update the organization external id with null value', async () => {
      // given
      const externalId = null;

      // when
      await updateOrganizationInformation({
        id: originalOrganization.id,
        externalId,
        organizationRepository,
        imageUtils,
      });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, externalId });
    });

    it('should allow to update the organization province code (only) if modified', async () => {
      // given
      const provinceCode = '975';

      // when
      await updateOrganizationInformation({
        id: originalOrganization.id,
        provinceCode,
        organizationRepository,
        imageUtils,
      });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, provinceCode });
    });

    it('should allow to update the organization province code with null value', async () => {
      // given
      const provinceCode = null;

      // when
      await updateOrganizationInformation({
        id: originalOrganization.id,
        provinceCode,
        organizationRepository,
        imageUtils,
      });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, provinceCode });
    });

    it('should allow to update the organization isManagingStudents (only) if modified', async () => {
      // when
      await updateOrganizationInformation({
        id: originalOrganization.id,
        isManagingStudents: false,
        organizationRepository,
        imageUtils,
      });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, isManagingStudents: false });
    });

    it('should allow to update the organization canCollectProfiles (only) if modified', async () => {
      // when
      await updateOrganizationInformation({
        id: originalOrganization.id,
        canCollectProfiles: false,
        organizationRepository,
        imageUtils,
      });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, canCollectProfiles: false });
    });

    it('should allow to update the organization email', async () => {
      // given
      const newEmail = 'sco.generic.newaccount@example.net';

      // when
      await updateOrganizationInformation({
        id: originalOrganization.id,
        email: newEmail,
        organizationRepository,
        imageUtils,
      });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, email: newEmail });
    });

    it('should allow to update the organization credit', async () => {
      // given
      const newCredit = 100;

      // when
      await updateOrganizationInformation({
        id: originalOrganization.id,
        credit: newCredit,
        organizationRepository,
        imageUtils,
      });

      // then
      expect(organizationRepository.update).to.have.been.calledWithMatch({ ...originalOrganization, credit: newCredit });
    });
  });

  context('when an error occurred', () => {

    it('should reject a NotFoundError (DomainError) when the organization does not exist', async () => {
      // given
      organizationRepository.get = sinon.stub().rejects(new NotFoundError('Not found organization'));

      // when
      const error = await catchErr(updateOrganizationInformation)({
        id: originalOrganization.id,
        logoUrl: 'http://new.logo.url',
        organizationRepository,
        imageUtils,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
