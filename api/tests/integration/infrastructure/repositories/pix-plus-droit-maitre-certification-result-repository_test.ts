// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const pixPlusDroitMaitreCertificationResultRepository = require('../../../../lib/infrastructure/repositories/pix-plus-droit-maitre-certification-result-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
const { PIX_DROIT_MAITRE_CERTIF } = require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repositories | pix-plus-droit-maitre-certification-result-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no pix plus droit maitre certification result for a given certification id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a not_taken result', async function () {
        // given
        const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
        await databaseBuilder.commit();

        // when
        const pixPlusCertificationResult = await pixPlusDroitMaitreCertificationResultRepository.get({
          certificationCourseId,
        });

        // then
        const expectedPixPlusCertificationResult = domainBuilder.buildPixPlusDroitCertificationResult.maitre.notTaken();
        expect(pixPlusCertificationResult).to.deepEqualInstance(expectedPixPlusCertificationResult);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when there is a acquired pix plus droit maitre certification result for a given certification id',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a acquired result', async function () {
          // given
          databaseBuilder.factory.buildBadge({ key: PIX_DROIT_MAITRE_CERTIF });
          const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
          databaseBuilder.factory.buildComplementaryCertificationCourse({ id: 998, certificationCourseId });
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            complementaryCertificationCourseId: 998,
            partnerKey: PIX_DROIT_MAITRE_CERTIF,
            acquired: true,
          });
          await databaseBuilder.commit();

          // when
          const pixPlusCertificationResult = await pixPlusDroitMaitreCertificationResultRepository.get({
            certificationCourseId,
          });

          // then
          const expectedPixPlusCertificationResult =
            domainBuilder.buildPixPlusDroitCertificationResult.maitre.acquired();
          expect(pixPlusCertificationResult).to.deepEqualInstance(expectedPixPlusCertificationResult);
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when there is a rejected pix plus droit maitre certification result for a given certification id',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a rejected result', async function () {
          // given
          databaseBuilder.factory.buildBadge({ key: PIX_DROIT_MAITRE_CERTIF });
          const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
          databaseBuilder.factory.buildComplementaryCertificationCourse({ id: 998, certificationCourseId });
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            complementaryCertificationCourseId: 998,
            partnerKey: PIX_DROIT_MAITRE_CERTIF,
            acquired: false,
          });
          await databaseBuilder.commit();

          // when
          const pixPlusCertificationResult = await pixPlusDroitMaitreCertificationResultRepository.get({
            certificationCourseId,
          });

          // then
          const expectedPixPlusCertificationResult =
            domainBuilder.buildPixPlusDroitCertificationResult.maitre.rejected();
          expect(pixPlusCertificationResult).to.deepEqualInstance(expectedPixPlusCertificationResult);
        });
      }
    );
  });
});
