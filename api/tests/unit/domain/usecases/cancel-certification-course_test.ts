// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const cancelCertificationCourse = require('../../../../lib/domain/usecases/cancel-certification-course');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | cancel-certification-course', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should cancel the certification course', async function () {
    // given
    const certificationCourse = domainBuilder.buildCertificationCourse({ id: 123 });
    sinon.spy(certificationCourse, 'cancel');
    const certificationCourseRepository = {
      update: sinon.stub(),
      get: sinon.stub(),
    };
    certificationCourseRepository.get.withArgs(123).resolves(certificationCourse);
    certificationCourseRepository.update.resolves();

    // when
    await cancelCertificationCourse({
      certificationCourseId: 123,
      certificationCourseRepository,
    });

    // then
    expect(certificationCourse.cancel).to.have.been.calledOnce;
    expect(certificationCourseRepository.update).to.have.been.calledWith(certificationCourse);
  });
});
