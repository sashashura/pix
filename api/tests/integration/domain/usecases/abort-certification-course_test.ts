// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'abortCerti... Remove this comment to see the full error message
const abortCertificationCourse = require('../../../../lib/domain/usecases/abort-certification-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCourseRepository = require('../../../../lib/infrastructure/repositories/certification-course-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | abort-certification-course', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when abort reason is valid', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the certificationCourse with a reason', async function () {
      // given
      const certificationCourse = databaseBuilder.factory.buildCertificationCourse();
      await databaseBuilder.commit();

      const abortReason = 'technical';
      // when
      await abortCertificationCourse({
        certificationCourseRepository,
        certificationCourseId: certificationCourse.id,
        abortReason,
      });

      // then
      const [abortReasonFound] = await knex('certification-courses')
        .select('abortReason')
        .where({ id: certificationCourse.id });

      expect(abortReasonFound).to.deep.equal({ abortReason });
    });
  });
});
