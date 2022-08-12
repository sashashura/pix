// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, catchErr, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForUpdate = require('../../../../lib/domain/models/TargetProfileForUpdate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const { categories } = require('../../../../lib/domain/models/TargetProfile');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const targetProfileForUpdateRepository = require('../../../../lib/infrastructure/repositories/target-profile-for-update-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Target-profile-for-update', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let targetProfileForUpdate: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      targetProfileForUpdate = new TargetProfileForUpdate({
        id: 4,
        name: 'name',
        description: 'description',
        comment: 'comment',
        category: categories.OTHER,
      });
      databaseBuilder.factory.buildTargetProfile(targetProfileForUpdate);
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the target profile', async function () {
      // when
      const result = await targetProfileForUpdateRepository.get(targetProfileForUpdate.id);

      expect(result).to.deep.eq(targetProfileForUpdate);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the targetProfile does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(targetProfileForUpdateRepository.get)(1);

        expect(error).to.be.an.instanceOf(NotFoundError);
        expect((error as $TSFixMe).message).to.have.string("Le profil cible avec l'id 1 n'existe pas");
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#update', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the target profile name', async function () {
      // given
      const targetProfileForUpdate = new TargetProfileForUpdate({
        id: 4,
        name: 'name',
        description: 'description',
        comment: 'comment',
        categories: categories.OTHER,
      });
      databaseBuilder.factory.buildTargetProfile(targetProfileForUpdate);
      await databaseBuilder.commit();

      // when
      targetProfileForUpdate.name = 'Karam';
      await targetProfileForUpdateRepository.update(targetProfileForUpdate);

      // then
      const { name } = await knex('target-profiles').select('name').where('id', targetProfileForUpdate.id).first();
      expect(name).to.equal(targetProfileForUpdate.name);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the target profile description', async function () {
      // given
      const targetProfileForUpdate = new TargetProfileForUpdate({
        id: 4,
        name: 'name',
        description: 'description',
        comment: 'comment',
        categories: categories.OTHER,
      });
      databaseBuilder.factory.buildTargetProfile(targetProfileForUpdate);
      await databaseBuilder.commit();

      // when
      targetProfileForUpdate.description = 'Je change la description';
      await targetProfileForUpdateRepository.update(targetProfileForUpdate);

      // then
      const { description } = await knex('target-profiles')
        .select('description')
        .where('id', targetProfileForUpdate.id)
        .first();
      expect(description).to.equal(targetProfileForUpdate.description);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the target profile comment', async function () {
      // given
      const targetProfileForUpdate = new TargetProfileForUpdate({
        id: 4,
        name: 'name',
        description: 'description',
        comment: 'comment',
        categories: categories.OTHER,
      });
      databaseBuilder.factory.buildTargetProfile(targetProfileForUpdate);
      await databaseBuilder.commit();

      // when
      targetProfileForUpdate.comment = 'Je change le commentaire';
      await targetProfileForUpdateRepository.update(targetProfileForUpdate);

      // then
      const { comment } = await knex('target-profiles')
        .select('comment')
        .where('id', targetProfileForUpdate.id)
        .first();
      expect(comment).to.equal(targetProfileForUpdate.comment);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the target profile category', async function () {
      // given
      const targetProfileForUpdate = new TargetProfileForUpdate({
        id: 4,
        name: 'name',
        description: 'description',
        comment: 'comment',
        categories: categories.OTHER,
      });
      databaseBuilder.factory.buildTargetProfile(targetProfileForUpdate);
      await databaseBuilder.commit();

      // when
      targetProfileForUpdate.category = categories.PREDEFINED;
      await targetProfileForUpdateRepository.update(targetProfileForUpdate);

      // then
      const { category } = await knex('target-profiles')
        .select('category')
        .where('id', targetProfileForUpdate.id)
        .first();
      expect(category).to.equal(targetProfileForUpdate.category);
    });
  });
});
