import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import Service from '@ember/service';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ScoOrganizationParticipant::HeaderActions', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should show title with participant count', async function (assert) {
    //given
    this.set('participantCount', 10);

    // when
    await render(hbs`<ScoOrganizationParticipant::HeaderActions @participantCount={{participantCount}} />`);

    // then
    assert.contains(this.intl.t('pages.sco-organization-participants.title', { count: 10 }));
  });

  module('user rights', () => {
    module('when user is admin in organization', () => {
      module('when organization is SCO', (hooks) => {
        hooks.beforeEach(function () {
          class CurrentUserStub extends Service {
            isAdminInOrganization = true;
          }
          this.owner.register('service:current-user', CurrentUserStub);
          this.set('importStudentsSpy', () => {});
          return render(hbs`<ScoOrganizationParticipant::HeaderActions @onImportStudents={{importStudentsSpy}} />`);
        });

        test('it should display import XML file button', async function (assert) {
          assert.contains('Importer (.xml ou .zip)');
        });
      });

      module('when organization is SCO and tagged as Agriculture and CFA', (hooks) => {
        hooks.beforeEach(function () {
          class CurrentUserStub extends Service {
            isAdminInOrganization = true;
            isAgriculture = true;
            organization = {};
            prescriber = {
              lang: 'fr',
            };
          }

          this.set('importStudentsSpy', () => {});
          this.owner.register('service:current-user', CurrentUserStub);
          return render(hbs`<ScoOrganizationParticipant::HeaderActions @onImportStudents={{importStudentsSpy}} />`);
        });

        test('it should still display import CSV file button', async function (assert) {
          assert.contains('Importer (.csv)');
        });
      });
    });

    module('when user is not admin in organization', (hooks) => {
      hooks.beforeEach(function () {
        class CurrentUserStub extends Service {
          isAdminInOrganization = false;
        }
        this.owner.register('service:current-user', CurrentUserStub);
        return render(hbs`<ScoOrganizationParticipant::HeaderActions />`);
      });

      test('it should not display import button', async function (assert) {
        assert.notContains('Importer (.xml)');
        assert.notContains('Importer (.csv)');
      });
    });
  });
});
