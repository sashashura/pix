// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../lib/infrastructure/bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const complementaryCertificationCourseResultRepository = require('../../../../lib/infrastructure/repositories/complementary-certification-course-result-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../../../lib/domain/models/Badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../../../../lib/domain/models/ComplementaryCertificationCourseResult');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | complementary-certification-courses-result-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getFromComplementaryCertificationCourseId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when a ComplementaryCertificationCourseResult matches the complementaryCertificationCourseId', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns ComplementaryCertificationCourseResult as an array', async function () {
        // given
        databaseBuilder.factory.buildComplementaryCertification({
          id: 1,
          name: 'Pix+Edu',
        });
        databaseBuilder.factory.buildCertificationCourse({ id: 99 });
        databaseBuilder.factory.buildComplementaryCertificationCourse({
          id: 999,
          certificationCourseId: 99,
          complementaryCertificationId: 1,
        });

        databaseBuilder.factory.buildBadge({
          key: Badge.keys.PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        });

        databaseBuilder.factory.buildComplementaryCertificationCourseResult({
          complementaryCertificationCourseId: 999,
          partnerKey: Badge.keys.PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
          source: ComplementaryCertificationCourseResult.sources.PIX,
          acquired: true,
        });

        await databaseBuilder.commit();

        // when
        const [result] =
          await complementaryCertificationCourseResultRepository.getFromComplementaryCertificationCourseId({
            complementaryCertificationCourseId: 999,
          });

        // then
        expect(result).to.deepEqualInstance(
          domainBuilder.buildComplementaryCertificationCourseResult({
            acquired: true,
            complementaryCertificationCourseId: 999,
            partnerKey: 'PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE',
            source: ComplementaryCertificationCourseResult.sources.PIX,
          })
        );
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when no ComplementaryCertificationCourseResult matches the complementaryCertificationCourseId', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns an empty array', async function () {
        // when
        const result = await complementaryCertificationCourseResultRepository.getFromComplementaryCertificationCourseId(
          {
            complementaryCertificationCourseId: 99,
          }
        );

        // then
        expect(result).to.deep.equal([]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('complementary-certification-course-results').delete();
    });
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the ComplementaryCertificationCourseResult does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('saves the ComplementaryCertificationCourseResult', async function () {
        // given
        databaseBuilder.factory.buildComplementaryCertification({
          id: 1,
          name: 'Pix+Edu',
        });
        databaseBuilder.factory.buildCertificationCourse({ id: 99 });
        databaseBuilder.factory.buildComplementaryCertificationCourse({
          id: 999,
          certificationCourseId: 99,
          complementaryCertificationId: 1,
        });

        databaseBuilder.factory.buildBadge({
          key: Badge.keys.PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        });

        await databaseBuilder.commit();

        const complementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          acquired: true,
          complementaryCertificationCourseId: 999,
          partnerKey: Badge.keys.PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
          source: ComplementaryCertificationCourseResult.sources.PIX,
        });

        // when
        await complementaryCertificationCourseResultRepository.save(complementaryCertificationCourseResult);

        // then
        const savedComplementaryCertificationCourseResult = await knex('complementary-certification-course-results')
          .where({
            acquired: true,
            complementaryCertificationCourseId: 999,
            partnerKey: Badge.keys.PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
            source: ComplementaryCertificationCourseResult.sources.PIX,
          })
          .first();

        expect(_.omit(savedComplementaryCertificationCourseResult, 'id')).to.deep.equal({
          acquired: true,
          complementaryCertificationCourseId: 999,
          partnerKey: Badge.keys.PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
          source: ComplementaryCertificationCourseResult.sources.PIX,
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the ComplementaryCertificationCourseResult already exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('updates the ComplementaryCertificationCourseResult', async function () {
        // given
        databaseBuilder.factory.buildComplementaryCertification({
          id: 1,
          name: 'Pix+Edu',
        });
        databaseBuilder.factory.buildCertificationCourse({ id: 99 });
        databaseBuilder.factory.buildComplementaryCertificationCourse({
          id: 999,
          certificationCourseId: 99,
          complementaryCertificationId: 1,
        });

        databaseBuilder.factory.buildBadge({
          key: Badge.keys.PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        });

        databaseBuilder.factory.buildBadge({
          key: Badge.keys.PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
        });

        databaseBuilder.factory.buildComplementaryCertificationCourseResult({
          acquired: true,
          complementaryCertificationCourseId: 999,
          partnerKey: Badge.keys.PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
          source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
        });

        await databaseBuilder.commit();

        const complementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          acquired: true,
          complementaryCertificationCourseId: 999,
          partnerKey: Badge.keys.PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
          source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
        });

        // when
        await complementaryCertificationCourseResultRepository.save(complementaryCertificationCourseResult);

        // then
        const results = await knex('complementary-certification-course-results').where({
          acquired: true,
          complementaryCertificationCourseId: 999,
          source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
        });

        expect(results).to.have.lengthOf(1);
        expect(_.omit(results[0], 'id')).to.deep.equal({
          acquired: true,
          complementaryCertificationCourseId: 999,
          partnerKey: Badge.keys.PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
          source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
        });
      });
    });
  });
});
