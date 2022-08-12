// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'StudentFor... Remove this comment to see the full error message
const StudentForEnrollment = require('../../../../lib/domain/read-models/StudentForEnrollment');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findStudentsForEnrollment = require('../../../../lib/domain/usecases/find-students-for-enrollment');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-students-for-enrollment', function () {
  const certificationCenterId = 1;
  const userId = 'userId';
  let organization: $TSFixMe;

  const organizationRepository = {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    getIdByCertificationCenterId: sinon.stub(),
  };
  const organizationLearnerRepository = {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    findByOrganizationIdAndUpdatedAtOrderByDivision: sinon.stub(),
  };

  const certificationCandidateRepository = {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    findBySessionId: sinon.stub(),
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    const externalId = 'AAA111';
    const certificationCenter = domainBuilder.buildCertificationCenter({ id: certificationCenterId, externalId });
    organization = domainBuilder.buildOrganization({ externalId });

    organizationRepository.getIdByCertificationCenterId.withArgs(certificationCenter.id).resolves(organization.id);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when user has access to certification center', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there is no certification center for the organization ', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty list of student', async function () {
        // given
        organizationRepository.getIdByCertificationCenterId
          .withArgs(certificationCenterId)
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
          .rejects(new NotFoundError());

        // when
        const studentsFounds = await findStudentsForEnrollment({
          userId,
          certificationCenterId,
          page: { size: 10, number: 1 },
          organizationRepository,
          organizationLearnerRepository,
          certificationCandidateRepository,
        });

        // then
        expect(studentsFounds).to.deep.equal({
          data: [],
          pagination: { page: 1, pageSize: 10, rowCount: 0, pageCount: 0 },
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all students, enrolled or enrollable, regarding a session', async function () {
      // given
      const sessionId = 3;
      const enrolledStudent = domainBuilder.buildOrganizationLearner({ id: 10, organization, division: '3A' });
      const enrollableStudents = _.times(5, (iteration: $TSFixMe) => domainBuilder.buildOrganizationLearner({ id: iteration, organization })
      );
      const certificationCandidates = [
        domainBuilder.buildCertificationCandidate({ sessionId, organizationLearnerId: enrolledStudent.id }),
      ];
      organizationLearnerRepository.findByOrganizationIdAndUpdatedAtOrderByDivision
        .withArgs({ page: { number: 1, size: 10 }, filter: { divisions: ['3A'] }, organizationId: organization.id })
        .resolves({
          data: [enrolledStudent, ...enrollableStudents],
          pagination: { page: 1, pageSize: 10, rowCount: 5, pageCount: 1 },
        });
      certificationCandidateRepository.findBySessionId.withArgs(sessionId).resolves(certificationCandidates);

      // when
      const studentsFounds = await findStudentsForEnrollment({
        userId,
        certificationCenterId,
        sessionId,
        page: { number: 1, size: 10 },
        filter: { divisions: ['3A'] },
        organizationRepository,
        organizationLearnerRepository,
        certificationCandidateRepository,
      });

      // then
      const expectedEnrolledStudent = new StudentForEnrollment({ ...enrolledStudent, isEnrolled: true });
      const exepectedEnrollableStudents = enrollableStudents.map(
        (student: $TSFixMe) => new StudentForEnrollment({ ...student, isEnrolled: false })
      );
      const expectedStudents = [expectedEnrolledStudent, ...exepectedEnrollableStudents];
      expect(studentsFounds).to.be.deep.equal({
        data: expectedStudents,
        pagination: { page: 1, pageSize: 10, rowCount: 5, pageCount: 1 },
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the linked organization has no student', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return empty array', async function () {
        // given
        organizationLearnerRepository.findByOrganizationIdAndUpdatedAtOrderByDivision
          .withArgs({ page: { number: 1, size: 10 }, filter: {}, organizationId: organization.id })
          .resolves({
            data: [],
            pagination: { page: 1, pageSize: 10, rowCount: 0, pageCount: 0 },
          });

        // when
        const studentsFounds = await findStudentsForEnrollment({
          userId,
          certificationCenterId,
          page: { number: 1, size: 10 },
          filter: {},
          organizationRepository,
          organizationLearnerRepository,
          certificationCandidateRepository,
        });

        // then
        expect(studentsFounds).to.be.deep.equal({
          data: [],
          pagination: { page: 1, pageSize: 10, rowCount: 0, pageCount: 0 },
        });
      });
    });
  });
});
