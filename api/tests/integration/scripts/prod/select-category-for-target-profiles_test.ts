// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, catchErr } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'setCategor... Remove this comment to see the full error message
  setCategoriesToTargetProfiles,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'setCategor... Remove this comment to see the full error message
  setCategoryToTargetProfiles,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../scripts/prod/select-category-for-target-profiles');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const { categories } = require('../../../../lib/domain/models/TargetProfile');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | select-category-for-target-profiles.js', function () {
  let firstTargetProfileId: $TSFixMe;
  let secondTargetProfileId: $TSFixMe;
  let otherTargetProfileId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    firstTargetProfileId = databaseBuilder.factory.buildTargetProfile({ category: null }).id;
    secondTargetProfileId = databaseBuilder.factory.buildTargetProfile({ category: null }).id;
    otherTargetProfileId = databaseBuilder.factory.buildTargetProfile({ category: null }).id;
    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('target-profiles').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#setCategoryToTargetProfiles', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should set category on target profiles', async function () {
      const targetProfilesId = [firstTargetProfileId, secondTargetProfileId];

      await setCategoryToTargetProfiles(categories.COMPETENCES, targetProfilesId);

      const targetProfilesCategories = await knex('target-profiles')
        .select('category')
        .whereIn('id', targetProfilesId)
        .distinct('category');
      expect(targetProfilesCategories).to.deep.equal([{ category: categories.COMPETENCES }]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not set category on other target profiles', async function () {
      const targetProfilesId = [firstTargetProfileId, secondTargetProfileId];

      await setCategoryToTargetProfiles(categories.COMPETENCES, targetProfilesId);

      const { category } = await knex('target-profiles').where({ id: otherTargetProfileId }).first();
      expect(category).equal(null);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should skip non existing ids', async function () {
      const targetProfilesId = [456];

      await expect(setCategoryToTargetProfiles(categories.COMPETENCES, targetProfilesId)).to.be.fulfilled;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#setCategoriesToTargetProfiles', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return categories that are not supported', async function () {
      const { invalidCategories } = await setCategoriesToTargetProfiles(`targetProfileId,category
1,WRONG
2,BAD`);

      expect(invalidCategories).deep.equal(['WRONG', 'BAD']);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return target profiles that are not valid', async function () {
      const { invalidTargetProfiles } = await setCategoriesToTargetProfiles(`targetProfileId,category
,COMPETENCES
yolo,COMPETENCES`);

      expect(invalidTargetProfiles).deep.equal(['', 'yolo']);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not set categories that are not supported', async function () {
      await setCategoriesToTargetProfiles(`targetProfileId,category
${firstTargetProfileId},WRONG`);

      const { category } = await knex('target-profiles').where({ id: firstTargetProfileId }).first();
      expect(category).equal(null);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the category column is missing', async function () {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(setCategoriesToTargetProfiles)(`targetProfileId,missing
1,COMPETENCES`);

      expect((error as $TSFixMe).message).equal('Les colonnes "category" et "targetProfileId" sont obligatoires');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the target profile id column is missing', async function () {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(setCategoriesToTargetProfiles)(`missing,category
1,COMPETENCES`);

      expect((error as $TSFixMe).message).equal('Les colonnes "category" et "targetProfileId" sont obligatoires');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update target profiles with different categories', async function () {
      const csvData = `targetProfileId,category
${firstTargetProfileId},DISCIPLINE
${secondTargetProfileId},COMPETENCES`;

      await setCategoriesToTargetProfiles(csvData);

      const targetProfiles = await knex('target-profiles').select(['id', 'category']).whereNotNull('category');
      expect(targetProfiles).to.deep.have.members([
        { id: firstTargetProfileId, category: categories.DISCIPLINE },
        { id: secondTargetProfileId, category: categories.COMPETENCES },
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return total updated rows', async function () {
      const csvData = `targetProfileId,category
${firstTargetProfileId},DISCIPLINE
${secondTargetProfileId},DISCIPLINE`;

      const { totalUpdatedRows } = await setCategoriesToTargetProfiles(csvData);

      expect(totalUpdatedRows).equal(2);
    });
  });
});
