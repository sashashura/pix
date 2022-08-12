// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileShareRepository = require('../../../../lib/infrastructure/repositories/target-profile-share-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Target-profile-share', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#addTargetProfilesToOrganization', function () {
    let organizationId: $TSFixMe;
    let targetProfileIdA: $TSFixMe;
    let targetProfileIdB: $TSFixMe;
    let targetProfileIdC: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('target-profile-shares').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      organizationId = databaseBuilder.factory.buildOrganization().id;
      targetProfileIdA = databaseBuilder.factory.buildTargetProfile().id;
      targetProfileIdB = databaseBuilder.factory.buildTargetProfile().id;
      targetProfileIdC = databaseBuilder.factory.buildTargetProfile().id;
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save all the target profile shares for the organization', async function () {
      // given
      const targetProfileIdList = [targetProfileIdA, targetProfileIdB, targetProfileIdC];

      // when
      await targetProfileShareRepository.addTargetProfilesToOrganization({ organizationId, targetProfileIdList });

      // then
      const targetProfileShares = await knex('target-profile-shares').where({ organizationId });
      expect(targetProfileShares).to.have.lengthOf(3);
      expect(_.map(targetProfileShares, 'targetProfileId')).exactlyContain([
        targetProfileIdA,
        targetProfileIdB,
        targetProfileIdC,
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not create another target profile share nor throw an error when it already exists', async function () {
      // given
      databaseBuilder.factory.buildTargetProfileShare({ organizationId, targetProfileId: targetProfileIdA });
      const targetProfileIdList = [targetProfileIdA, targetProfileIdB, targetProfileIdC];

      // when
      await targetProfileShareRepository.addTargetProfilesToOrganization({ organizationId, targetProfileIdList });

      // then
      const targetProfileShares = await knex('target-profile-shares').where({ organizationId });
      expect(targetProfileShares).to.have.lengthOf(3);
      expect(_.map(targetProfileShares, 'targetProfileId')).to.have.members([
        targetProfileIdA,
        targetProfileIdB,
        targetProfileIdC,
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not erase old target profil share', async function () {
      // given
      databaseBuilder.factory.buildTargetProfileShare({ organizationId, targetProfileId: targetProfileIdA });
      await databaseBuilder.commit();
      const targetProfileIdList = [targetProfileIdB, targetProfileIdC];

      // when
      await targetProfileShareRepository.addTargetProfilesToOrganization({ organizationId, targetProfileIdList });

      // then
      const targetProfileShares = await knex('target-profile-shares').where({ organizationId });
      expect(targetProfileShares).to.have.lengthOf(3);
      expect(_.map(targetProfileShares, 'targetProfileId')).exactlyContain([
        targetProfileIdA,
        targetProfileIdB,
        targetProfileIdC,
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return attached target profile ids', async function () {
      // given
      const targetProfileIdList = [targetProfileIdA, targetProfileIdB, targetProfileIdC];

      // when
      const { attachedIds } = await targetProfileShareRepository.addTargetProfilesToOrganization({
        organizationId,
        targetProfileIdList,
      });

      // then
      expect(attachedIds).exactlyContain([targetProfileIdA, targetProfileIdB, targetProfileIdC]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return duplicated target profile ids', async function () {
      // given
      databaseBuilder.factory.buildTargetProfileShare({ organizationId, targetProfileId: targetProfileIdA });
      await databaseBuilder.commit();
      const targetProfileIdList = [targetProfileIdA, targetProfileIdB, targetProfileIdC];

      // when
      const { duplicatedIds } = await targetProfileShareRepository.addTargetProfilesToOrganization({
        organizationId,
        targetProfileIdList,
      });

      // then
      expect(duplicatedIds).exactlyContain([targetProfileIdA]);
    });
  });
});
