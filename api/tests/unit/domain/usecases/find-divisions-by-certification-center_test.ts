// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findDivisionsByCertificationCenter = require('../../../../lib/domain/usecases/find-divisions-by-certification-center');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-divisions-by-certification-center', function () {
  let organization;
  let organizationRepository: $TSFixMe;
  let divisionRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    organizationRepository = {
      getIdByCertificationCenterId: sinon.stub(),
    };
    divisionRepository = {
      findByOrganizationIdForCurrentSchoolYear: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when user has access to certification center', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all divisions', async function () {
      // given
      const externalId = 'AAA111';
      const certificationCenter = domainBuilder.buildCertificationCenter({ externalId });
      organization = domainBuilder.buildOrganization({ externalId });

      organizationRepository.getIdByCertificationCenterId.withArgs(certificationCenter.id).resolves(organization.id);
      divisionRepository.findByOrganizationIdForCurrentSchoolYear
        .withArgs({ organizationId: organization.id })
        .resolves([{ name: '3a' }, { name: '3b' }, { name: '5c' }]);

      // when
      const divisions = await findDivisionsByCertificationCenter({
        certificationCenterId: certificationCenter.id,
        organizationRepository,
        divisionRepository,
      });

      // then
      expect(divisions).to.be.deep.equal([{ name: '3a' }, { name: '3b' }, { name: '5c' }]);
    });
  });
});
