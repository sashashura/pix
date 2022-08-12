// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createOrga... Remove this comment to see the full error message
const { createOrganization } = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationCreationValidator = require('../../../../lib/domain/validators/organization-creation-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-organization', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(organizationCreationValidator, 'validate');
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('Green cases', function () {
    let name: $TSFixMe;
    let type: $TSFixMe;
    let externalId: $TSFixMe;
    let provinceCode: $TSFixMe;
    let documentationUrl: $TSFixMe;
    let organizationRepository: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      name = 'ACME';
      type = 'PRO';
      externalId = 'externalId';
      provinceCode = 'provinceCode';
      documentationUrl = 'https://pix.fr';
      organizationCreationValidator.validate.returns();

      organizationRepository = { create: sinon.stub() };
      organizationRepository.create.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should validate params (name + type + documentationUrl)', async function () {
      // when
      await createOrganization({ name, type, documentationUrl, externalId, provinceCode, organizationRepository });

      // then
      expect(organizationCreationValidator.validate).to.have.been.calledWithExactly({ name, type, documentationUrl });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a new Organization Entity with Super Admin userId', async function () {
      // given
      const superAdminUserId = 10;
      const createdBy = superAdminUserId;
      const expectedOrganization = new Organization({
        createdBy,
        name,
        documentationUrl,
        type,
        externalId,
        provinceCode,
      });

      // when
      await createOrganization({
        createdBy,
        externalId,
        name,
        provinceCode,
        type,
        documentationUrl,
        organizationRepository,
      });

      // then
      expect(organizationRepository.create).to.have.been.calledWith(expectedOrganization);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('Red cases', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an EntityValidationError when params are not valid', async function () {
      // given
      const name = 'ACME';
      const type = 'PRO';
      const organizationRepository = {};

      organizationCreationValidator.validate.throws(new EntityValidationError({}));

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createOrganization)({ name, type, organizationRepository });

      // then
      expect(error).to.be.an.instanceOf(EntityValidationError);
    });
  });
});
