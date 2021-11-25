const { expect, catchErr } = require('../../../test-helper');
const TargetProfileForUpdate = require('../../../../lib/domain/models/TargetProfileForUpdate');
const { EntityValidationError } = require('../../../../lib/domain/errors');

describe('Unit | Domain | Models | TargetProfileForUpdate', function () {
  describe('#update', function () {
    it('should update attributes', function () {
      const targetProfile = new TargetProfileForUpdate('name', 'description', 'commment');
      targetProfile.update({ name: 'changedName', description: 'changedDescription', comment: 'changedComment' });

      expect(targetProfile.name).to.eq('changedName');
      expect(targetProfile.description).to.eq('changedDescription');
      expect(targetProfile.comment).to.eq('changedComment');
    });

    it('should throw error when name is null', async function () {
      const targetProfile = new TargetProfileForUpdate('name', 'description', 'commment');
      const error = await catchErr(targetProfile.update)({
        name: null,
        description: 'changedDescription',
        comment: 'changedComment',
      });
      expect(error).to.be.an.instanceOf(EntityValidationError);
      expect(error.invalidAttributes.attribute).to.eq('name');
      expect(error.invalidAttributes.message).to.eq('The name can not be empty');
    });
  });
});
