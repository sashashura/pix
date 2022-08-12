// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const complementaryCertificationSubscriptionRepository = require('../../../../lib/infrastructure/repositories/complementary-certification-subscription-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../lib/infrastructure/bookshelf');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | complementary-certification-subscription-repository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#save', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('complementary-certification-subscriptions').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a complementary certification subscription', async function () {
      // given
      const certificationCandidateId = databaseBuilder.factory.buildCertificationCandidate().id;
      const complementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification().id;
      await databaseBuilder.commit();

      // when
      await complementaryCertificationSubscriptionRepository.save({
        certificationCandidateId,
        complementaryCertificationId,
      });

      // then
      const complementaryCertificationRegistration = await knex
        .select('*')
        .from('complementary-certification-subscriptions')
        .where({ certificationCandidateId, complementaryCertificationId })
        .first();
      expect(complementaryCertificationRegistration).to.not.be.null;
    });
  });
});
