// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const complementaryCertificationCourseRepository = require('../../../../lib/infrastructure/repositories/complementary-certification-course-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
const { PIX_PLUS_DROIT, PIX_PLUS_EDU_1ER_DEGRE } = require('../../../../lib/domain/models/ComplementaryCertification');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | complementary-certification-courses-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getComplementaryCertificationCourseId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when complementary certification has been started for the certification course', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the id', async function () {
        // given
        databaseBuilder.factory.buildComplementaryCertification({
          id: 1,
          label: 'Pix+ Edu 1er degré',
          key: PIX_PLUS_EDU_1ER_DEGRE,
        });
        databaseBuilder.factory.buildComplementaryCertification({
          id: 2,
          label: 'Pix+ Droit',
          key: PIX_PLUS_DROIT,
        });
        databaseBuilder.factory.buildCertificationCourse({ id: 99 });
        databaseBuilder.factory.buildComplementaryCertificationCourse({
          id: 999,
          certificationCourseId: 99,
          complementaryCertificationId: 2,
        });

        await databaseBuilder.commit();

        // when
        const hasPixPlusDroit = await complementaryCertificationCourseRepository.getComplementaryCertificationCourseId({
          certificationCourseId: 99,
          complementaryCertificationKey: PIX_PLUS_DROIT,
        });

        // then
        expect(hasPixPlusDroit).to.equal(999);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when another complementary certification has been started for the certification course', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns undefined', async function () {
        // given
        databaseBuilder.factory.buildComplementaryCertification({
          id: 1,
          label: 'Pix+ Edu',
          key: PIX_PLUS_EDU_1ER_DEGRE,
        });
        databaseBuilder.factory.buildComplementaryCertification({
          id: 2,
          label: 'Pix+ Droit',
          key: PIX_PLUS_DROIT,
        });
        databaseBuilder.factory.buildCertificationCourse({ id: 99 });
        databaseBuilder.factory.buildComplementaryCertificationCourse({
          certificationCourseId: 99,
          complementaryCertificationId: 1,
        });

        await databaseBuilder.commit();

        // when
        const hasPixPlusDroit = await complementaryCertificationCourseRepository.getComplementaryCertificationCourseId({
          certificationCourseId: 99,
          complementaryCertificationKey: PIX_PLUS_DROIT,
        });

        // then
        expect(hasPixPlusDroit).to.be.undefined;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when complementary certification has been started for another certification course', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns undefined', async function () {
        // given
        databaseBuilder.factory.buildComplementaryCertification({
          id: 2,
          label: 'Pix+ Droit',
          key: PIX_PLUS_DROIT,
        });
        databaseBuilder.factory.buildCertificationCourse({ id: 99 });
        databaseBuilder.factory.buildCertificationCourse({ id: 98 });
        databaseBuilder.factory.buildComplementaryCertificationCourse({
          certificationCourseId: 98,
          complementaryCertificationId: 2,
        });

        await databaseBuilder.commit();

        // when
        const hasPixPlusDroit = await complementaryCertificationCourseRepository.getComplementaryCertificationCourseId({
          certificationCourseId: 99,
          complementaryCertificationKey: PIX_PLUS_DROIT,
        });

        // then
        expect(hasPixPlusDroit).to.be.undefined;
      });
    });
  });
});
