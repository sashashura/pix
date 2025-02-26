import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, selectByLabelAndOption } from '@1024pix/ember-testing-library';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | routes/authenticated/sessions | list-items', function (hooks) {
  setupRenderingTest(hooks);

  test('it should display sessions list', async function (assert) {
    // given
    const date = new Date();
    const finalizedAt = new Date('2020-08-14T00:00:00Z');
    const publishedAt = new Date('2020-06-14T00:00:00Z');
    const resultsSentToPrescriberAt = new Date('2020-08-15T00:00:00Z');
    const displayStatus = 'SomeStatus';
    const sessions = [
      {
        id: 1,
        certificationCenterName: 'Centre A',
        certificationCenterExternalId: 'EXTIDA',
        certificationCenterType: 'SUP',
        date,
        time: '14:00:00',
        displayStatus,
        finalizedAt: '',
        publishedAt: '',
        resultsSentToPrescriberAt: '',
      },
      {
        id: 2,
        certificationCenterName: 'Centre B',
        certificationCenterExternalId: 'EXTIDB',
        certificationCenterType: null,
        date,
        time: '14:00:00',
        displayStatus,
        finalizedAt,
        publishedAt,
        resultsSentToPrescriberAt,
      },
    ];
    const displayedDate = date.toLocaleString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' });
    const displayedFinalizedAt = finalizedAt.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const displayedPublishedAt = publishedAt.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const displayedResultsSentToPrescriberAt = resultsSentToPrescriberAt.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });

    sessions.meta = { rowCount: 2 };
    this.set('sessions', sessions);

    // when
    await render(hbs`<Sessions::ListItems @sessions={{this.sessions}} @triggerFiltering={{this.triggerFiltering}} />`);

    // then
    assert.dom('table tbody tr').exists({ count: sessions.length });
    for (let i = 0; i < sessions.length; ++i) {
      assert.dom(`table tbody tr:nth-child(${i + 1}) td:first-child`).hasText(sessions[i].id.toString());
      assert.dom(`table tbody tr:nth-child(${i + 1}) td:nth-child(2)`).hasText(sessions[i].certificationCenterName);
      assert
        .dom(`table tbody tr:nth-child(${i + 1}) td:nth-child(5)`)
        .hasText(displayedDate + ' à ' + sessions[i].time);
      assert.dom(`table tbody tr:nth-child(${i + 1}) td:nth-child(6)`).hasText(sessions[i].displayStatus);
      assert
        .dom(`table tbody tr:nth-child(${i + 1}) td:nth-child(7)`)
        .hasText(sessions[i].finalizedAt ? displayedFinalizedAt : sessions[i].finalizedAt);
      assert
        .dom(`table tbody tr:nth-child(${i + 1}) td:nth-child(8)`)
        .hasText(sessions[i].publishedAt ? displayedPublishedAt : sessions[i].publishedAt);
      assert
        .dom(`table tbody tr:nth-child(${i + 1}) td:nth-child(9)`)
        .hasText(
          sessions[i].resultsSentToPrescriberAt
            ? displayedResultsSentToPrescriberAt
            : sessions[i].resultsSentToPrescriberAt
        );
    }
    // Colonne : Centre de certification
    assert.dom('table tbody tr:nth-child(1) td:nth-child(3)').hasText(sessions[0].certificationCenterExternalId);
    assert.dom('table tbody tr:nth-child(1) td:nth-child(4)').hasText(sessions[0].certificationCenterType);
    assert.dom('table tbody tr:nth-child(2) td:nth-child(4)').hasText('-');
  });

  module('Input field for id filtering', function () {
    test('it should render a input field to filter on id', async function (assert) {
      // when
      const screen = await render(hbs`<Sessions::ListItems @triggerFiltering={{this.triggerFiltering}} />`);

      // then
      assert.dom(screen.getByRole('textbox', { name: 'Filtrer les sessions avec un id' })).exists();
    });
  });

  module('Input field for certificationCenterName filtering', function () {
    test('it should render a input field to filter on certificationCenterName', async function (assert) {
      // when
      const screen = await render(hbs`<Sessions::ListItems @triggerFiltering={{this.triggerFiltering}} />`);

      // then
      assert
        .dom(screen.getByRole('textbox', { name: "Filtrer les sessions avec le nom d'un centre de certification" }))
        .exists();
    });
  });

  module('Dropdown menu for certification center type filtering', function () {
    test('it should render a dropdown menu to filter sessions on their certification center type', async function (assert) {
      // given
      const expectedLabels = { allType: 'Tous', scoType: 'Sco', supType: 'Sup', proType: 'Pro' };

      // when
      const screen = await render(hbs`<Sessions::ListItems />`);

      // then
      assert
        .dom(
          screen.getByRole('combobox', {
            name: 'Filtrer les sessions en sélectionnant un type de centre de certification',
          })
        )
        .hasText(
          `${expectedLabels.allType} ${expectedLabels.scoType} ${expectedLabels.supType} ${expectedLabels.proType}`
        );
    });

    test('it should filter sessions on certification center type when it has changed', async function (assert) {
      // given
      this.set('certificationCenterType', 'SCO');
      this.set('updateCertificationCenterTypeFilter', (newValue) => this.set('certificationCenterType', newValue));
      await render(
        hbs`<Sessions::ListItems @certificationCenterType={{this.certificationCenterType}} @onChangeCertificationCenterType={{this.updateCertificationCenterTypeFilter}}/>`
      );

      // when
      await selectByLabelAndOption('Filtrer les sessions en sélectionnant un type de centre de certification', 'PRO');

      // then
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(this.certificationCenterType, 'PRO');
    });
  });

  module('Dropdown menu for status filtering', function () {
    test('it should render a dropdown menu to filter sessions on their status', async function (assert) {
      // given
      const expectedLabels = {
        allStatus: 'Tous',
        createdStatus: 'Créée',
        finalizedStatus: 'Finalisée',
        inProcessStatus: 'En cours de traitement',
        processedStatus: 'Résultats transmis par Pix',
      };

      // when
      const screen = await render(hbs`<Sessions::ListItems />`);

      // then
      assert
        .dom(
          screen.getByRole('combobox', {
            name: 'Filtrer les sessions en sélectionnant un statut',
          })
        )
        .hasText(
          `${expectedLabels.allStatus} ${expectedLabels.createdStatus} ${expectedLabels.finalizedStatus} ${expectedLabels.inProcessStatus} ${expectedLabels.processedStatus}`
        );
    });

    test('it should filter sessions on (session) "status" when it has changed', async function (assert) {
      // given
      this.set('status', 'finalized');
      this.set('updateSessionStatusFilter', (newValue) => this.set('status', newValue));
      await render(
        hbs`<Sessions::ListItems @status={{this.status}} @onChangeSessionStatus={{this.updateSessionStatusFilter}}/>`
      );

      // when
      await selectByLabelAndOption('Filtrer les sessions en sélectionnant un statut', 'created');

      // then
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(this.status, 'created');
    });
  });

  module('Dropdown menu for resultsSentToPrescriberAt filtering', function () {
    test('it should render a dropdown menu to filter sessions on their results sending', async function (assert) {
      // given
      const expectedLabels = {
        all: 'Tous',
        resultsSent: 'Résultats diffusés',
        resultsNotSent: 'Résultats non diffusés',
      };

      // when
      const screen = await render(hbs`<Sessions::ListItems />`);

      // then
      assert
        .dom(
          screen.getByRole('combobox', {
            name: 'Filtrer les sessions par leurs résultats diffusés ou non diffusés',
          })
        )
        .hasText(`${expectedLabels.all} ${expectedLabels.resultsSent} ${expectedLabels.resultsNotSent}`);
    });

    test('it should filter sessions on results sending status when it has changed', async function (assert) {
      // given
      this.set('resultsSentToPrescriberAt', 'true');
      this.set('updateSessionResultsSentToPrescriberFilter', (newValue) =>
        this.set('resultsSentToPrescriberAt', newValue)
      );
      await render(
        hbs`<Sessions::ListItems @resultsSentToPrescriberAt={{this.resultsSentToPrescriberAt}} @onChangeSessionResultsSent={{this.updateSessionResultsSentToPrescriberFilter}}/>`
      );

      // when
      await selectByLabelAndOption('Filtrer les sessions par leurs résultats diffusés ou non diffusés', 'false');

      // then
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(this.resultsSentToPrescriberAt, 'false');
    });
  });
});
