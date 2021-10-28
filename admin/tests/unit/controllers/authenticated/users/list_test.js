import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module.only('Unit | Controller | authenticated/users/list', function (hooks) {
  setupTest(hooks);
  let controller;

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:authenticated.users.list');
  });

  module('#updateFilters', function () {
    module('updating firstName', function () {
      test('it should update controller firstName field', async function (assert) {
        // given
        controller.firstName = 'someFirstName';
        controller.firstNameForm = 'someOtherFirstName';
        const expectedValue = 'someOtherFirstName';
        const event = {
          preventDefault: () => {},
          target: { value: expectedValue },
        };
        // when
        await controller.refreshModel(event);

        // then
        assert.equal(controller.firstName, expectedValue);
      });
    });

    module('updating lastName', function () {
      test('it should update controller lastName field', async function (assert) {
        // given
        controller.lastName = 'someLastName';
        const expectedValue = 'someOtherLastName';

        const event = {
          preventDefault: () => {},
          target: { value: expectedValue },
        };
        // when
        await controller.refreshModel(event);

        // then
        assert.equal(controller.lastName, expectedValue);
      });
    });

    module('updating email', function () {
      test('it should update controller email field', async function (assert) {
        // given
        controller.email = 'someEmail';
        const expectedValue = 'someOtherEmail';

        const event = {
          preventDefault: () => {},
          target: { value: expectedValue },
        };
        // when
        await controller.refreshModel(event);

        // then
        assert.equal(controller.email, expectedValue);
      });
    });
  });
});
