import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | organization-membership', function (hooks) {
  setupTest(hooks);

  module('#roleLabel', function () {
    test('it should return the label corresponding to the role', function (assert) {
      // given
      const store = this.owner.lookup('service:store');

      // when
      const model1 = store.createRecord('organization-membership', { role: 'MEMBER' });
      const model2 = store.createRecord('organization-membership', { role: 'ADMIN' });

      // then
      assert.strictEqual(model1.roleLabel, 'Membre');
      assert.strictEqual(model2.roleLabel, 'Administrateur');
    });
  });
});
