const { expect, databaseBuilder, domainBuilder } = require('../../../test-helper');
const complementaryCertificationCourseRepository = require('../../../../lib/infrastructure/repositories/complementary-certification-course-repository');
const { PIX_PLUS_DROIT, PIX_PLUS_EDU_1ER_DEGRE } = require('../../../../lib/domain/models/ComplementaryCertification');

describe('Integration | Repository | complementary-certification-courses-repository', function () {
  describe('#getComplementaryCertificationCourseId', function () {
    describe('when complementary certification has been started for the certification course', function () {
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

    describe('when another complementary certification has been started for the certification course', function () {
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

    describe('when complementary certification has been started for another certification course', function () {
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

  describe('#findComplementaryCertificationCourses', function () {
    it('returns the complementary certification courses', async function () {
      // given
      databaseBuilder.factory.buildComplementaryCertification({
        id: 1,
        label: 'Pix+ 1',
        key: 'PIX_PLUS_1',
      });
      databaseBuilder.factory.buildComplementaryCertification({
        id: 2,
        label: 'Pix+ 2',
        key: 'PIX_PLUS_2',
      });
      databaseBuilder.factory.buildCertificationCourse({ id: 99 });
      databaseBuilder.factory.buildComplementaryCertificationCourse({
        id: 999,
        certificationCourseId: 99,
        complementaryCertificationId: 2,
      });
      databaseBuilder.factory.buildComplementaryCertificationCourse({
        id: 996,
        certificationCourseId: 99,
        complementaryCertificationId: 1,
      });

      await databaseBuilder.commit();

      // when
      const result = await complementaryCertificationCourseRepository.findComplementaryCertificationCourses({
        certificationCourseId: 99,
      });

      // then
      expect(result).to.deepEqualArray([
        domainBuilder.buildComplementaryCertificationCourse({
          id: 996,
          certificationCourseId: 99,
          complementaryCertificationId: 1,
        }),
        domainBuilder.buildComplementaryCertificationCourse({
          id: 999,
          certificationCourseId: 99,
          complementaryCertificationId: 2,
        }),
      ]);
    });

    describe('when there is no complementary certification course', function () {
      it('should return an empty list', async function () {
        // given
        databaseBuilder.factory.buildCertificationCourse({ id: 99 });

        await databaseBuilder.commit();

        // when
        const result = await complementaryCertificationCourseRepository.findComplementaryCertificationCourses({
          certificationCourseId: 99,
        });

        // then
        expect(result).to.deep.equal([]);
      });
    });
  });
});
