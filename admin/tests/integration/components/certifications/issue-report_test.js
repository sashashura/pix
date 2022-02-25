import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { render as renderScreen } from '@1024pix/ember-testing-library';
import EmberObject from '@ember/object';

module('Integration | Component | certifications/issue-report', function (hooks) {
  setupRenderingTest(hooks);

  module('when the issue is impactful and not resolved', function () {
    test('it should display resolve button', async function (assert) {
      // Given
      const issueReport = EmberObject.create({ isImpactful: true });
      this.set('issueReport', issueReport);

      // When
      const screen = await renderScreen(hbs`<Certifications::IssueReport @issueReport={{this.issueReport}}/>`);

      // Then
      assert.dom(screen.getByRole('button', { name: 'Résoudre' })).exists();
    });
  });

  module('when the issue is not impactful and not resolved', function () {
    test('it should not display resolve button', async function (assert) {
      // Given
      const issueReport = EmberObject.create({ isImpactful: false });
      this.set('issueReport', issueReport);

      // When
      const screen = await renderScreen(hbs`<Certifications::IssueReport @issueReport={{this.issueReport}}/>`);

      // Then
      assert.dom(screen.queryByText('Résoudre')).doesNotExist();
    });
  });
});
