// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'studentRep... Remove this comment to see the full error message
const studentRepository = require('../../../../lib/infrastructure/repositories/student-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | student-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findReconciledStudentsByNationalStudentId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return instances of Student', async function () {
      // given
      const organizationId = 1;
      const firstNationalStudentId = '123456789AB';
      const firstAccount = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildOrganization({ id: organizationId, isManagingStudents: true });
      databaseBuilder.factory.buildCertificationCourse({ userId: firstAccount.id });
      databaseBuilder.factory.buildCertificationCourse({ userId: firstAccount.id });
      const firstOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId,
        userId: firstAccount.id,
        nationalStudentId: firstNationalStudentId,
      });

      const secondAccount = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildCertificationCourse({ userId: secondAccount.id });
      databaseBuilder.factory.buildOrganizationLearner({
        userId: secondAccount.id,
        nationalStudentId: firstNationalStudentId,
      });

      const secondNationalStudentId = '567891234CD';
      const thirdAccount = databaseBuilder.factory.buildUser();
      const secondOrganizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId,
        userId: thirdAccount.id,
        nationalStudentId: secondNationalStudentId,
      });

      await databaseBuilder.commit();

      // when
      const [firstStudent, secondStudent] = await studentRepository.findReconciledStudentsByNationalStudentId([
        firstNationalStudentId,
        secondNationalStudentId,
      ]);

      // then
      expect(firstStudent.nationalStudentId).to.equal(firstNationalStudentId);
      expect(firstStudent.account).to.deep.equal({
        organizationId,
        birthdate: firstOrganizationLearner.birthdate,
        userId: firstAccount.id,
        updatedAt: firstAccount.updatedAt,
        certificationCount: 2,
      });
      expect(secondStudent.nationalStudentId).to.equal(secondNationalStudentId);
      expect(secondStudent.account).to.deep.equal({
        organizationId,
        birthdate: secondOrganizationLearner.birthdate,
        userId: thirdAccount.id,
        updatedAt: thirdAccount.updatedAt,
        certificationCount: 0,
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getReconciledStudentByNationalStudentId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return instance of Student', async function () {
      // given
      const nationalStudentId = '123456789AB';
      const organizationId = 1;
      const account = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildOrganization({ id: organizationId, isManagingStudents: true });
      databaseBuilder.factory.buildCertificationCourse({ userId: account.id });
      databaseBuilder.factory.buildCertificationCourse({ userId: account.id });
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId,
        userId: account.id,
        nationalStudentId,
      });

      await databaseBuilder.commit();

      // when
      const student = await studentRepository.getReconciledStudentByNationalStudentId(nationalStudentId);

      // then
      expect(student.nationalStudentId).to.equal(nationalStudentId);
      expect(student.account).to.deep.equal({
        organizationId,
        birthdate: organizationLearner.birthdate,
        userId: account.id,
        updatedAt: account.updatedAt,
        certificationCount: 2,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null when no student found', async function () {
      // given
      const nationalStudentId = '000000999B';

      // when
      const student = await studentRepository.getReconciledStudentByNationalStudentId(nationalStudentId);

      // then
      expect(student).to.be.null;
    });
  });
});
