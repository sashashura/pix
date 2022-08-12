// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'complement... Remove this comment to see the full error message
const complementaryCertificationRepository = require('../../../../lib/infrastructure/repositories/complementary-certification-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | complementary-certification-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findAll', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there are complementary certifications', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return all complementary certifications ordered by id', async function () {
        // given
        databaseBuilder.factory.buildComplementaryCertification({
          id: 1,
          key: 'EDU_1ER_DEGRE',
          label: 'Pix+ Édu 1er degré',
        });
        databaseBuilder.factory.buildComplementaryCertification({
          id: 2,
          key: 'EDU_2ND_DEGRE',
          label: 'Pix+ Édu 2nd degré',
        });
        databaseBuilder.factory.buildComplementaryCertification({
          id: 3,
          key: 'DROIT',
          label: 'Pix+ Droit',
        });
        databaseBuilder.factory.buildComplementaryCertification({
          id: 4,
          key: 'CLEA',
          label: 'CléA Numérique',
        });

        await databaseBuilder.commit();

        // when
        const complementaryCertifications = await complementaryCertificationRepository.findAll();

        // then
        const expectedComplementaryCertifications = [
          domainBuilder.buildComplementaryCertification({
            id: 1,
            key: 'EDU_1ER_DEGRE',
            label: 'Pix+ Édu 1er degré',
          }),
          domainBuilder.buildComplementaryCertification({
            id: 2,
            key: 'EDU_2ND_DEGRE',
            label: 'Pix+ Édu 2nd degré',
          }),
          domainBuilder.buildComplementaryCertification({
            id: 3,
            key: 'DROIT',
            label: 'Pix+ Droit',
          }),
          domainBuilder.buildComplementaryCertification({
            id: 4,
            key: 'CLEA',
            label: 'CléA Numérique',
          }),
        ];

        expect(complementaryCertifications).to.deepEqualArray(expectedComplementaryCertifications);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there are no complementary certifications', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        // given when
        const complementaryCertifications = await complementaryCertificationRepository.findAll();

        // then
        expect(complementaryCertifications).to.be.empty;
      });
    });
  });
});
