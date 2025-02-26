import sinon from 'sinon';
import { module, test } from 'qunit';
import { render, find } from '@ember/test-helpers';
import Service from '@ember/service';
import EmberObject from '@ember/object';
import { fillByLabel, clickByText } from '@1024pix/ember-testing-library';
import hbs from 'htmlbars-inline-precompile';
import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Campaign::Activity::ParticipantsList', function (hooks) {
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('noop', sinon.stub());
  });

  test('it should display participations details', async function (assert) {
    class CurrentUserStub extends Service {
      isAdminInOrganization = true;
    }
    this.owner.register('service:current-user', CurrentUserStub);

    this.set('campaign', { idPixLabel: 'id', type: 'ASSESSMENT' });

    this.set('participations', [
      {
        firstName: 'Joe',
        lastName: 'La frite',
        status: 'TO_SHARE',
        participantExternalId: 'patate',
      },
    ]);

    await render(hbs`<Campaign::Activity::ParticipantsList
        @campaign={{this.campaign}}
        @participations={{this.participations}}
        @onClickParticipant={{noop}}
        @onFilter={{noop}}
      />`);

    assert.contains('Joe');
    assert.contains('La frite');
    assert.contains('patate');
    assert.contains("En attente d'envoi");
  });

  module('#deleteParticipation', function () {
    module('when the user is admin', function () {
      test('it should display the trash to delete the participation', async function (assert) {
        class CurrentUserStub extends Service {
          isAdminInOrganization = true;
        }
        this.owner.register('service:current-user', CurrentUserStub);

        this.campaign = { idPixLabel: 'id', type: 'ASSESSMENT' };
        this.participations = [
          {
            firstName: 'Joe',
            lastName: 'La frite',
            status: 'TO_SHARE',
            participantExternalId: 'patate',
          },
        ];

        await render(hbs`<Campaign::Activity::ParticipantsList
            @campaign={{this.campaign}}
            @participations={{this.participations}}
            @onClickParticipant={{noop}}
            @onFilter={{noop}}
          />`);

        assert.dom('[aria-label="Supprimer la participation"]').exists();
      });
    });

    module('when the user is the owner of the campaign', function () {
      test('it displays the trash to delete the participation', async function (assert) {
        class CurrentUserStub extends Service {
          isAdminInOrganization = false;
          prescriber = EmberObject.create({ id: 109 });
        }
        this.owner.register('service:current-user', CurrentUserStub);

        this.campaign = { idPixLabel: 'id', type: 'ASSESSMENT', ownerId: 109 };
        this.participations = [
          {
            firstName: 'Joe',
            lastName: 'La frite',
            status: 'TO_SHARE',
            participantExternalId: 'patate',
          },
        ];

        await render(hbs`<Campaign::Activity::ParticipantsList
            @campaign={{this.campaign}}
            @participations={{this.participations}}
            @onClickParticipant={{noop}}
            @onFilter={{noop}}
          />`);

        assert.dom('[aria-label="Supprimer la participation"]').exists();
      });
    });

    module('when the user is neither an admin nor the owner of the campaign', function () {
      test('it should not display the trash to delete the participation', async function (assert) {
        class CurrentUserStub extends Service {
          isAdminInOrganization = false;
          prescriber = EmberObject.create({ id: 109 });
        }
        this.owner.register('service:current-user', CurrentUserStub);

        this.campaign = { idPixLabel: 'id', type: 'ASSESSMENT', ownerId: 1 };
        this.participations = [
          {
            firstName: 'Joe',
            lastName: 'La frite',
            status: 'TO_SHARE',
            participantExternalId: 'patate',
          },
        ];

        await render(hbs`<Campaign::Activity::ParticipantsList
            @campaign={{this.campaign}}
            @participations={{this.participations}}
            @onClickParticipant={{noop}}
            @onFilter={{noop}}
          />`);

        assert.dom('[aria-label="Supprimer la participation"]').doesNotExist();
      });
    });
  });

  module('status filter', function () {
    test('should set default', async function (assert) {
      class CurrentUserStub extends Service {
        isAdminInOrganization = false;
        prescriber = 1;
      }
      this.owner.register('service:current-user', CurrentUserStub);
      this.campaign = { type: 'ASSESSMENT' };
      this.participations = [];
      this.selectedStatus = 'TO_SHARE';

      await render(hbs`<Campaign::Activity::ParticipantsList
        @campaign={{this.campaign}}
        @participations={{this.participations}}
        @selectedStatus={{selectedStatus}}
        @onClickParticipant={{noop}}
        @onFilter={{noop}}
      />`);

      assert.strictEqual(find('[aria-label="Statut"]').selectedOptions[0].value, 'TO_SHARE');
    });

    test('should filter on participations status', async function (assert) {
      class CurrentUserStub extends Service {
        isAdminInOrganization = false;
        prescriber = 1;
      }
      this.owner.register('service:current-user', CurrentUserStub);
      this.campaign = { type: 'ASSESSMENT' };
      this.participations = [];
      this.onFilter = sinon.stub();

      await render(hbs`<Campaign::Activity::ParticipantsList
          @campaign={{this.campaign}}
          @participations={{this.participations}}
          @onClickParticipant={{noop}}
          @onFilter={{onFilter}}
        />`);

      await fillByLabel('Statut', 'SHARED');

      assert.ok(this.onFilter.calledWith('status', 'SHARED'));
    });
  });

  module('division filter', function () {
    class CurrentUserStub extends Service {
      organization = { isSco: true };
      isSCOManagingStudents = true;
    }

    test('it should filter on participation divisions', async function (assert) {
      // given
      this.owner.register('service:current-user', CurrentUserStub);

      this.campaign = { idPixLabel: 'id', divisions: [{ name: '3B' }, { name: '3A' }] };
      this.participations = [];
      this.onFilter = sinon.stub();

      await render(hbs`<Campaign::Activity::ParticipantsList
          @campaign={{campaign}}
          @participations={{participations}}
          @onClickParticipant={{noop}}
          @onFilter={{onFilter}}
        />`);

      await clickByText('Classes');
      await clickByText('3A');

      assert.ok(this.onFilter.calledWith('divisions', ['3A']));
    });
  });

  module('group filter', function () {
    class CurrentUserStub extends Service {
      organization = { isSup: true };
      isSUPManagingStudents = true;
    }
    test('it should filter on participants groups', async function (assert) {
      // given
      this.owner.register('service:current-user', CurrentUserStub);

      this.campaign = { idPixLabel: 'id', groups: [{ name: 'M1' }, { name: 'M2' }] };
      this.participations = [];
      this.onFilter = sinon.stub();

      await render(hbs`<Campaign::Activity::ParticipantsList
          @campaign={{campaign}}
          @participations={{participations}}
          @onClickParticipant={{noop}}
          @onFilter={{onFilter}}
        />`);

      await clickByText('Groupes');
      await clickByText('M2');

      assert.ok(this.onFilter.calledWith('groups', ['M2']));
    });
  });

  module('search filter', function () {
    test('it should filter participants by names', async function (assert) {
      this.campaign = { idPixLabel: 'id' };
      this.participations = [];
      this.onFilter = sinon.stub();

      await render(hbs`<Campaign::Activity::ParticipantsList
          @campaign={{campaign}}
          @participations={{participations}}
          @onClickParticipant={{noop}}
          @onFilter={{onFilter}}
        />`);

      await fillByLabel('Recherche sur le nom et prénom', 'Jean');

      assert.ok(this.onFilter.calledWith('search', 'Jean'));
    });
  });
});
