import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { expect } from 'chai';

module('Unit | Component | chai', function (hooks) {
  setupTest(hooks);

  test('it should pass when true is true', async function (assert) {
    expect(true).to.equal(true);
    assert.true(true);
  });

  test('it should not pass when true is false', async function () {
    expect(true).to.equal(false);
  });

  test('it should mix assertions (native and chai)', async function (assert) {
    // then
    assert.true(true);

    expect(true).to.equal(true);
  });
});
