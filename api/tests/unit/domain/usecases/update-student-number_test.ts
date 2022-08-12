// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const updateStudentNumber = require('../../../../lib/domain/usecases/update-student-number');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-student-number', function () {
  const organizationId = 2;
  const studentNumber = '4321A';
  const organizationLearnerId = 1234;

  let organizationLearner;

  const supOrganizationLearnerRepository = {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    findOneByStudentNumber: sinon.stub(),
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    updateStudentNumber: sinon.stub(),
  };

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When there is an organization learner with the same student number', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      organizationLearner = domainBuilder.buildSupOrganizationLearner();

      supOrganizationLearnerRepository.findOneByStudentNumber
        .withArgs({ organizationId, studentNumber })
        .resolves(organizationLearner);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an AlreadyExistingEntityError', async function () {
      // given
      const errorMessage = 'STUDENT_NUMBER_EXISTS';

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateStudentNumber)({
        supOrganizationLearnerRepository,
        organizationLearnerId,
        studentNumber,
        organizationId,
      });

      // then
      expect(error).to.be.an.instanceOf(AlreadyExistingEntityError);
      expect((error as $TSFixMe).message).to.equal(errorMessage);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When there are not organization learner with the same student number', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      supOrganizationLearnerRepository.findOneByStudentNumber
        .withArgs({ organizationId, studentNumber })
        .resolves(null);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update a student number', async function () {
      // when
      await updateStudentNumber({
        supOrganizationLearnerRepository,
        organizationLearnerId,
        studentNumber,
        organizationId,
      });

      // then
      expect(supOrganizationLearnerRepository.updateStudentNumber).to.have.been.calledWith(
        organizationLearnerId,
        studentNumber
      );
    });
  });
});
