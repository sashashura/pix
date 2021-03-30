const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');

const findDivisionsByOrganization = require('../../../../lib/domain/usecases/find-divisions-by-organization');
const { NoDivisionListForOrganization } = require('../../../../lib/domain/errors');

describe('Unit | UseCase | find-divisions-by-organization', () => {

  describe('when user has access to organization', () => {

    it('should return all divisions', async () => {
      // given
      const organizationId = 1234;
      const scoAndIsManagingStudentOrganization = domainBuilder
        .buildOrganization({ type: 'SCO', isManagingStudents: true });

      const divisionRepository = { findByOrganizationId: sinon.stub() };
      divisionRepository.findByOrganizationId
        .withArgs({ organizationId })
        .resolves([{ name: '3a' }, { name: '3b' }, { name: '5c' }]);

      const organizationRepository = { get: sinon.stub() };
      organizationRepository.get
        .withArgs(organizationId)
        .resolves(scoAndIsManagingStudentOrganization);

      // when
      const divisions = await findDivisionsByOrganization({
        organizationId,
        divisionRepository,
        organizationRepository,
      });

      // then
      expect(divisions).to.be.deep.equal([{ name: '3a' }, { name: '3b' }, { name: '5c' }]);
    });
  });

  describe('when given organization is not SCO and not is managing students', () => {

    it('should throw', async () => {
      // given
      const organizationId = 1234;
      const nonScoOrganization = domainBuilder.buildOrganization({ type: 'SUP ' });

      const divisionRepository = { findByOrganizationId: sinon.stub() };
      divisionRepository.findByOrganizationId
        .withArgs({ organizationId })
        .resolves([{ name: '3a' }, { name: '3b' }, { name: '5c' }]);

      const organizationRepository = { get: sinon.stub() };
      organizationRepository.get
        .withArgs(organizationId)
        .resolves(nonScoOrganization);

      // when
      const error = await catchErr(findDivisionsByOrganization)({
        organizationId,
        divisionRepository,
        organizationRepository,
      });

      // then
      expect(error).to.be.instanceOf(NoDivisionListForOrganization);
    });
  });
});
