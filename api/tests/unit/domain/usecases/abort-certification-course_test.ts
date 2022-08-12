// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'abortCerti... Remove this comment to see the full error message
const abortCertificationCourse = require('../../../../lib/domain/usecases/abort-certification-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourse = require('../../../../lib/domain/models/CertificationCourse');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | abort-certification-course', function () {
  let certificationCourseRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationCourseRepository = {
      get: sinon.stub(),
      update: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when abort reason is valid', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the certificationCourse with a reason', async function () {
      // given
      const abortReason = 'technical';
      const certificationCourse = domainBuilder.buildCertificationCourse({ abortReason: null });
      certificationCourseRepository.get.withArgs(certificationCourse.getId()).resolves(certificationCourse);

      // when
      await abortCertificationCourse({
        certificationCourseRepository,
        certificationCourseId: certificationCourse.getId(),
        abortReason,
      });

      // then
      expect(certificationCourseRepository.update).to.have.been.calledWithExactly(
        new CertificationCourse({
          ...certificationCourse.toDTO(),
          abortReason: 'technical',
        })
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if abortReason is not provided', async function () {
      // given
      const abortReason = null;
      const certificationCourse = domainBuilder.buildCertificationCourse({ abortReason: null });
      certificationCourseRepository.get.withArgs(certificationCourse.getId()).resolves(certificationCourse);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const err = await catchErr(abortCertificationCourse)({
        certificationCourseRepository,
        certificationCourseId: certificationCourse.getId(),
        abortReason,
      });

      // then
      expect(err).to.be.instanceOf(EntityValidationError);
      expect(certificationCourseRepository.update).not.to.have.been.called;
    });
  });
});
