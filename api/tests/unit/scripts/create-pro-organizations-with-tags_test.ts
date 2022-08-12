// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createOrga... Remove this comment to see the full error message
const { createOrganizationWithTags } = require('../../../scripts/create-pro-organizations-with-tags');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationTagRepository = require('../../../lib/infrastructure/repositories/organization-tag-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationRepository = require('../../../lib/infrastructure/repositories/organization-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tagReposit... Remove this comment to see the full error message
const tagRepository = require('../../../lib/infrastructure/repositories/tag-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationRepository = require('../../../lib/infrastructure/repositories/organization-invitation-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationService = require('../../../lib/domain/services/organization-invitation-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FileValida... Remove this comment to see the full error message
const { FileValidationError } = require('../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Scripts | create-pro-organization-with-tags.js', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    sinon.stub(console, 'log');
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When organization file is empty', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // given
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      const organizationsWithValidDataPath = `${__dirname}/helpers/files/organizations-empty-file.csv`;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createOrganizationWithTags)(organizationsWithValidDataPath);

      // then
      expect(error).to.be.instanceOf(FileValidationError);
      expect((error as $TSFixMe).meta).to.be.equal('File is empty');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When some required headers are missing', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // given
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      const organizationsWithValidDataPath = `${__dirname}/helpers/files/organizations-with-missing-headers-test.csv`;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createOrganizationWithTags)(organizationsWithValidDataPath);

      // then
      expect(error).to.be.instanceOf(FileValidationError);
      expect((error as $TSFixMe).meta).to.be.equal('Headers missing: externalId,createdBy');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When required headers are present but data is missing', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // given
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      const organizationsWithValidDataPath = `${__dirname}/helpers/files/organizations-with-header-and-missing-data-test.csv`;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createOrganizationWithTags)(organizationsWithValidDataPath);

      // then
      expect(error).to.be.instanceOf(FileValidationError);
      expect((error as $TSFixMe).meta).to.be.equal('File is empty');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When data file is valid', function () {
    let sandbox: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      sandbox = sinon.createSandbox();
      sandbox.stub(organizationRepository, 'findByExternalIdsFetchingIdsOnly');
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      sandbox.restore();
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create organizations with tags', async function () {
      // given
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      const organizationsWithValidDataPath = `${__dirname}/helpers/files/organizations-with-header-and-valid-data-test.csv`;
      const createdOrganizations = [
        {
          id: 16000,
          externalId: 'b2066',
          email: 'youness.yahya@pix.fr',
          name: 'Nom orga',
        },
        {
          id: 16001,
          externalId: 'b2067',
          email: 'youness.yahya@pix.fr',
          name: 'Nom orga',
        },
      ];

      const allTags = [
        { id: 1, name: 'AGRICULTURE' },
        { id: 2, name: 'PUBLIC' },
      ];

      organizationRepository.batchCreateProOrganizations = sinon.stub().resolves(createdOrganizations);
      organizationRepository.batchCreate = sinon.stub();
      tagRepository.create = sinon.stub();
      tagRepository.findAll = sinon.stub().resolves(allTags);
      organizationTagRepository.batchCreate = sinon.stub();
      organizationInvitationRepository.create = sinon.stub();
      organizationInvitationService.createProOrganizationInvitation = sinon.stub();

      // when
      const response = await createOrganizationWithTags(organizationsWithValidDataPath);

      // then
      expect(organizationInvitationService.createProOrganizationInvitation).to.have.been.called;
      expect(response).to.equal('Organizations created with success !');
    });
  });
});
