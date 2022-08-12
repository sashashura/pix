// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForUpdate = require('../../../../lib/domain/models/TargetProfileForUpdate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('../../../../lib/domain/models/TargetProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | TargetProfileForUpdate', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#update', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update attributes', function () {
      const targetProfile = new TargetProfileForUpdate({
        name: 'name',
        description: 'description',
        comment: 'commment',
        category: TargetProfile.categories.OTHER,
      });

      targetProfile.update({
        name: 'changedName',
        description: 'changedDescription',
        comment: 'changedComment',
        category: TargetProfile.categories.COMPETENCES,
      });

      expect(targetProfile.name).to.eq('changedName');
      expect(targetProfile.description).to.eq('changedDescription');
      expect(targetProfile.comment).to.eq('changedComment');
      expect(targetProfile.category).to.eq(TargetProfile.categories.COMPETENCES);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw error when name is null', async function () {
      const targetProfile = new TargetProfileForUpdate({ name: 'name', category: TargetProfile.categories.OTHER });
      const error = await catchErr(
        targetProfile.update,
        targetProfile
      )({
        name: null,
        category: TargetProfile.categories.OTHER,
      });

      expect(error).to.be.an.instanceOf(EntityValidationError);
      expect((error as $TSFixMe).invalidAttributes[0].attribute).to.eq('name');
      expect((error as $TSFixMe).invalidAttributes[0].message).to.eq('NAME_IS_REQUIRED');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw error when category no match', async function () {
      const targetProfile = new TargetProfileForUpdate({ name: 'name', category: TargetProfile.categories.OTHER });
      const error = await catchErr(
        targetProfile.update,
        targetProfile
      )({
        name: 'Godzilla',
        category: null,
      });

      expect(error).to.be.an.instanceOf(EntityValidationError);
      expect((error as $TSFixMe).invalidAttributes[0].attribute).to.eq('category');
      expect((error as $TSFixMe).invalidAttributes[0].message).to.eq('CATEGORY_IS_REQUIRED');
    });
  });
});
