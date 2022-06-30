import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { render as renderScreen } from '@1024pix/ember-testing-library';

module('Integration | Component |  users/user-detail-personal-information/user-profile', function(hooks) {
  setupRenderingTest(hooks);

  test('replace this by your real test', async function(assert) {
    // given

    //  when
    await renderScreen(hbs`<UsersUserDetailPersonalInformationUserProfile />`);

    // then
    assert.ok(true);
  });
});
