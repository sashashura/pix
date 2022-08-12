// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const complementaryCertificationHabilitationRepository = require('../../../../lib/infrastructure/repositories/complementary-certification-habilitation-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../lib/infrastructure/bookshelf');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | complementary-certification-habilitation-repository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#save', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('complementary-certification-habilitations').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create the complementary certitification habilitation', async function () {
      // given
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const complementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification().id;
      await databaseBuilder.commit();

      // when
      await complementaryCertificationHabilitationRepository.save({
        certificationCenterId,
        complementaryCertificationId,
      });

      // then
      const complementaryCertificationHabilitation = await knex
        .select('*')
        .from('complementary-certification-habilitations')
        .where({ certificationCenterId, complementaryCertificationId })
        .first();
      expect(complementaryCertificationHabilitation).to.not.be.null;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#deleteByCertificationCenterId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete all complementary certitification habilitations for a given certification center id', async function () {
      // given
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const otherCertificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const complementaryCertification1Id = databaseBuilder.factory.buildComplementaryCertification().id;
      const complementaryCertification2Id = databaseBuilder.factory.buildComplementaryCertification().id;
      const otherComplementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification().id;
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId,
        complementaryCertificationId: complementaryCertification1Id,
      });
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId,
        complementaryCertificationId: complementaryCertification2Id,
      });
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId: otherCertificationCenterId,
        complementaryCertificationId: otherComplementaryCertificationId,
      });
      await databaseBuilder.commit();

      // when
      await complementaryCertificationHabilitationRepository.deleteByCertificationCenterId(certificationCenterId);

      // then
      const complementaryCertificationHabilitationsForCertificationCenterId = await knex
        .select('*')
        .from('complementary-certification-habilitations')
        .where({ certificationCenterId });
      expect(complementaryCertificationHabilitationsForCertificationCenterId.length).to.equal(0);
      const complementaryCertificationHabilitationThatShouldHaveBeenDeleted = await knex
        .select('*')
        .from('complementary-certification-habilitations')
        .where({ certificationCenterId: otherCertificationCenterId });
      expect(complementaryCertificationHabilitationThatShouldHaveBeenDeleted.length).to.equal(1);
    });
  });
});
