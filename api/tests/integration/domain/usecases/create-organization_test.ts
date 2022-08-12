// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationRepository = require('../../../../lib/infrastructure/repositories/organization-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createOrga... Remove this comment to see the full error message
const createOrganization = require('../../../../lib/domain/usecases/create-organization');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | create-organization', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('organizations').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create and return an Organization', async function () {
    // given
    const superAdminUserId = databaseBuilder.factory.buildUser().id;
    await databaseBuilder.commit();

    const externalId = 'externalId';
    const name = 'ACME';
    const provinceCode = 'provinceCode';
    const type = 'PRO';
    const documentationUrl = 'https://pix.fr';

    // when
    const result = await createOrganization({
      createdBy: superAdminUserId,
      externalId,
      documentationUrl,
      name,
      provinceCode,
      type,
      organizationRepository,
    });

    // then
    expect(result).to.be.instanceOf(Organization);
    expect(result.createdBy).to.be.equal(superAdminUserId);
    expect(result.externalId).to.be.equal(externalId);
    expect(result.name).to.be.equal(name);
    expect(result.provinceCode).to.be.equal(provinceCode);
    expect(result.type).to.be.equal(type);
    expect(result.documentationUrl).to.be.equal(documentationUrl);
  });
});
