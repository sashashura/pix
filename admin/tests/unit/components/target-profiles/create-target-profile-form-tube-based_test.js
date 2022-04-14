import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import createComponent from '../../../helpers/create-glimmer-component';

module('Unit | Component | target-profiles/create-target-profile-form-tube-based', function (hooks) {
  setupTest(hooks);

  let component;

  hooks.beforeEach(function () {});

  module('#frameworkOptions', function () {
    test('it should return a framework list as multiselect option data', function (assert) {
      component = createComponent('component:target-profiles/create-target-profile-form-tube-based', {
        frameworks: [
          { name: 'framework1', id: 'id1' },
          { name: 'framework2', id: 'id2' },
        ],
      });

      // when
      const result = component.frameworkOptions;

      assert.deepEqual(result, [
        { label: 'framework1', value: 'id1' },
        { label: 'framework2', value: 'id2' },
      ]);
    });
  });

  module('#selectedFrameworks', function () {
    test('it should select Pix framework by default', function (assert) {
      component = createComponent('component:target-profiles/create-target-profile-form-tube-based', {
        frameworks: [
          { name: 'Test', id: 'id1' },
          { name: 'Pix', id: 'id2' },
        ],
      });

      // when
      const result = component.selectedFrameworks;

      assert.deepEqual(result, [{ name: 'Pix', id: 'id2' }]);
    });
  });
});
