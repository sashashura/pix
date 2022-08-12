// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const cleaCertificationResultRepository = require('../../../../lib/infrastructure/repositories/clea-certification-result-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CleaCertif... Remove this comment to see the full error message
const CleaCertificationResult = require('../../../../lib/domain/models/CleaCertificationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
const { PIX_EMPLOI_CLEA_V1, PIX_EMPLOI_CLEA_V2, PIX_EMPLOI_CLEA_V3 } =
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repositories | clea-certification-result-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no clea certification result for a given certification id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a not_taken result', async function () {
        // given
        const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
        await databaseBuilder.commit();

        // when
        const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });

        // then
        const expectedCleaCertificationResult = domainBuilder.buildCleaCertificationResult.notTaken();
        expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
        expect(cleaCertificationResult).to.deep.equal(expectedCleaCertificationResult);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a acquired clea certification result for a given certification id', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('V1', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a acquired result', async function () {
          // given
          databaseBuilder.factory.buildBadge({ key: PIX_EMPLOI_CLEA_V1 });
          const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
          databaseBuilder.factory.buildComplementaryCertificationCourse({ id: 998, certificationCourseId });
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            complementaryCertificationCourseId: 998,
            partnerKey: PIX_EMPLOI_CLEA_V1,
            acquired: true,
          });
          await databaseBuilder.commit();

          // when
          const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });

          // then
          const expectedCleaCertificationResult = domainBuilder.buildCleaCertificationResult.acquired();
          expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
          expect(cleaCertificationResult).to.deep.equal(expectedCleaCertificationResult);
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is a rejected clea certification result for a given certification id', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return a rejected result', async function () {
            // given
            databaseBuilder.factory.buildBadge({ key: PIX_EMPLOI_CLEA_V1 });
            const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
            databaseBuilder.factory.buildComplementaryCertificationCourse({ id: 998, certificationCourseId });
            databaseBuilder.factory.buildComplementaryCertificationCourseResult({
              complementaryCertificationCourseId: 998,
              partnerKey: PIX_EMPLOI_CLEA_V1,
              acquired: false,
            });
            await databaseBuilder.commit();

            // when
            const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });

            // then
            const expectedCleaCertificationResult = domainBuilder.buildCleaCertificationResult.rejected();
            expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
            expect(cleaCertificationResult).to.deep.equal(expectedCleaCertificationResult);
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('V2', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a acquired result', async function () {
          // given
          databaseBuilder.factory.buildBadge({ key: PIX_EMPLOI_CLEA_V2 });
          const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
          databaseBuilder.factory.buildComplementaryCertificationCourse({ id: 998, certificationCourseId });
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            complementaryCertificationCourseId: 998,
            partnerKey: PIX_EMPLOI_CLEA_V2,
            acquired: true,
          });
          await databaseBuilder.commit();

          // when
          const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });

          // then
          const expectedCleaCertificationResult = domainBuilder.buildCleaCertificationResult.acquired();
          expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
          expect(cleaCertificationResult).to.deep.equal(expectedCleaCertificationResult);
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is a rejected clea certification result for a given certification id', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return a rejected result', async function () {
            // given
            databaseBuilder.factory.buildBadge({ key: PIX_EMPLOI_CLEA_V2 });
            const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
            databaseBuilder.factory.buildComplementaryCertificationCourse({ id: 998, certificationCourseId });
            databaseBuilder.factory.buildComplementaryCertificationCourseResult({
              complementaryCertificationCourseId: 998,
              partnerKey: PIX_EMPLOI_CLEA_V2,
              acquired: false,
            });
            await databaseBuilder.commit();

            // when
            const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });

            // then
            const expectedCleaCertificationResult = domainBuilder.buildCleaCertificationResult.rejected();
            expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
            expect(cleaCertificationResult).to.deep.equal(expectedCleaCertificationResult);
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('V3', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a acquired result', async function () {
          // given
          databaseBuilder.factory.buildBadge({ key: PIX_EMPLOI_CLEA_V3 });
          const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
          databaseBuilder.factory.buildComplementaryCertificationCourse({ id: 998, certificationCourseId });
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            complementaryCertificationCourseId: 998,
            partnerKey: PIX_EMPLOI_CLEA_V3,
            acquired: true,
          });
          await databaseBuilder.commit();

          // when
          const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });

          // then
          const expectedCleaCertificationResult = domainBuilder.buildCleaCertificationResult.acquired();
          expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
          expect(cleaCertificationResult).to.deep.equal(expectedCleaCertificationResult);
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is a rejected clea certification result for a given certification id', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return a rejected result', async function () {
            // given
            databaseBuilder.factory.buildBadge({ key: PIX_EMPLOI_CLEA_V3 });
            const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
            databaseBuilder.factory.buildComplementaryCertificationCourse({ id: 998, certificationCourseId });
            databaseBuilder.factory.buildComplementaryCertificationCourseResult({
              complementaryCertificationCourseId: 998,
              partnerKey: PIX_EMPLOI_CLEA_V3,
              acquired: false,
            });
            await databaseBuilder.commit();

            // when
            const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });

            // then
            const expectedCleaCertificationResult = domainBuilder.buildCleaCertificationResult.rejected();
            expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
            expect(cleaCertificationResult).to.deep.equal(expectedCleaCertificationResult);
          });
        });
      });
    });
  });
});
