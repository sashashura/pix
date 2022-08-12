// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const pixPlusDroitExpertCertificationResultRepository = require('../../../../lib/infrastructure/repositories/pix-plus-droit-expert-certification-result-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
const { PIX_DROIT_EXPERT_CERTIF } = require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repositories | pix-plus-droit-expert-certification-result-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no pix plus droit expert certification result for a given certification id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a not_taken result', async function () {
        // given
        const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
        await databaseBuilder.commit();

        // when
        const pixPlusCertificationResult = await pixPlusDroitExpertCertificationResultRepository.get({
          certificationCourseId,
        });

        // then
        const expectedPixPlusCertificationResult = domainBuilder.buildPixPlusDroitCertificationResult.expert.notTaken();
        expect(pixPlusCertificationResult).to.deepEqualInstance(expectedPixPlusCertificationResult);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when there is a acquired pix plus droit expert certification result for a given certification id',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a acquired result', async function () {
          // given
          databaseBuilder.factory.buildBadge({ key: PIX_DROIT_EXPERT_CERTIF });
          const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
          databaseBuilder.factory.buildComplementaryCertificationCourse({ id: 998, certificationCourseId });
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            complementaryCertificationCourseId: 998,
            partnerKey: PIX_DROIT_EXPERT_CERTIF,
            acquired: true,
          });
          await databaseBuilder.commit();

          // when
          const pixPlusCertificationResult = await pixPlusDroitExpertCertificationResultRepository.get({
            certificationCourseId,
          });

          // then
          const expectedPixPlusCertificationResult =
            domainBuilder.buildPixPlusDroitCertificationResult.expert.acquired();
          expect(pixPlusCertificationResult).to.deepEqualInstance(expectedPixPlusCertificationResult);
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when there is a rejected pix plus droit expert certification result for a given certification id',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a rejected result', async function () {
          // given
          databaseBuilder.factory.buildBadge({ key: PIX_DROIT_EXPERT_CERTIF });
          const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
          databaseBuilder.factory.buildComplementaryCertificationCourse({ id: 998, certificationCourseId });
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            complementaryCertificationCourseId: 998,
            partnerKey: PIX_DROIT_EXPERT_CERTIF,
            acquired: false,
          });
          await databaseBuilder.commit();

          // when
          const pixPlusCertificationResult = await pixPlusDroitExpertCertificationResultRepository.get({
            certificationCourseId,
          });

          // then
          const expectedPixPlusCertificationResult =
            domainBuilder.buildPixPlusDroitCertificationResult.expert.rejected();
          expect(pixPlusCertificationResult).to.deepEqualInstance(expectedPixPlusCertificationResult);
        });
      }
    );
  });
});
