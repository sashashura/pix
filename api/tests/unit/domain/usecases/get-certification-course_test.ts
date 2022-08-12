// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getCertificationCourse = require('../../../../lib/domain/usecases/get-certification-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourse = require('../../../../lib/domain/models/CertificationCourse');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-certification-course', function () {
  let certificationCourse: $TSFixMe;
  let certificationCourseRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationCourse = new CertificationCourse({
      id: 'certification_course_id',
    });
    certificationCourseRepository = {
      get: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get the certificationCourse', async function () {
    // given
    certificationCourseRepository.get.withArgs(certificationCourse.getId()).resolves(certificationCourse);

    // when
    const actualCertificationCourse = await getCertificationCourse({
      certificationCourseId: certificationCourse.getId(),
      certificationCourseRepository,
    });

    // then
    expect(actualCertificationCourse.getId()).to.equal(certificationCourse.getId());
  });
});
