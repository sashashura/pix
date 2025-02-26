import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click, find, fillIn } from '@ember/test-helpers';
import { visit as visitScreen } from '@1024pix/ember-testing-library';
import { authenticateSession } from '../helpers/test-init';
import sinon from 'sinon';
import { later } from '@ember/runloop';
import ENV from 'pix-certif/config/environment';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | Session supervising', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    sinon.stub(ENV.APP, 'sessionSupervisingPollingRate').value(10000);
    const certificationPointOfContact = server.create('certification-point-of-contact', {
      firstName: 'Buffy',
      lastName: 'Summers',
      pixCertifTermsOfServiceAccepted: true,
      allowedCertificationCenterAccesses: [],
    });
    await authenticateSession(certificationPointOfContact.id);
  });

  module('When there are candidates on the session', function () {
    test('it should display candidates entries', async function (assert) {
      // given
      const sessionId = 12345;
      this.sessionForSupervising = server.create('session-for-supervising', {
        id: sessionId,
        certificationCandidates: [
          server.create('certification-candidate-for-supervising', {
            id: 123,
            firstName: 'John',
            lastName: 'Doe',
            birthdate: '1984-05-28',
            extraTimePercentage: '8',
            authorizedToStart: true,
          }),
          server.create('certification-candidate-for-supervising', {
            id: 456,
            firstName: 'Star',
            lastName: 'Lord',
            birthdate: '1983-06-28',
            extraTimePercentage: '12',
            authorizedToStart: false,
          }),
        ],
      });

      const screen = await visitScreen('/connexion-espace-surveillant');
      await fillIn(screen.getByRole('spinbutton', { name: 'Numéro de la session' }), '12345');
      await fillIn(screen.getByLabelText('Mot de passe de la session Exemple : C-12345'), '6789');

      // when
      await click(screen.getByRole('button', { name: 'Surveiller la session' }));

      // then
      assert.dom(screen.getByRole('checkbox', { name: 'Doe John' })).exists();
      assert.dom(screen.getByRole('checkbox', { name: 'Lord Star' })).exists();
    });

    test('should refresh the candidate list periodically', async function (assert) {
      // given
      sinon.stub(ENV.APP, 'sessionSupervisingPollingRate').value(100);

      const sessionForSupervising = server.create('session-for-supervising', {
        id: 12345,
        certificationCandidates: [
          server.create('certification-candidate-for-supervising', {
            id: 123,
            firstName: 'John',
            lastName: 'Doe',
            birthdate: '1984-05-28',
            extraTimePercentage: '8',
            authorizedToStart: true,
          }),
          server.create('certification-candidate-for-supervising', {
            id: 456,
            firstName: 'Star',
            lastName: 'Lord',
            birthdate: '1983-06-28',
            extraTimePercentage: '12',
            authorizedToStart: false,
          }),
        ],
      });

      let getSessionForSupervisingCount = 0;
      server.get('/sessions/:id/supervising', () => {
        getSessionForSupervisingCount++;
        return sessionForSupervising;
      });

      // when
      const screen = await visitScreen('/connexion-espace-surveillant');
      await fillIn(screen.getByRole('spinbutton', { name: 'Numéro de la session' }), '12345');
      await fillIn(screen.getByLabelText('Mot de passe de la session Exemple : C-12345'), '6789');
      await click(screen.getByRole('button', { name: 'Surveiller la session' }));

      // then
      assert.expect(1);
      later(() => {
        assert.deepEqual(getSessionForSupervisingCount, 4);
      }, 300);
    });
  });

  test('when supervisor checks the candidate, it should update authorizedToStart', async function (assert) {
    // given
    const sessionId = 12345;
    this.sessionForSupervising = server.create('session-for-supervising', {
      id: sessionId,
      certificationCandidates: [
        server.create('certification-candidate-for-supervising', {
          id: 123,
          firstName: 'John',
          lastName: 'Doe',
          birthdate: '1984-05-28',
          extraTimePercentage: '8',
          authorizedToStart: false,
        }),
      ],
    });

    const firstVisit = await visitScreen('/connexion-espace-surveillant');
    await fillIn(firstVisit.getByRole('spinbutton', { name: 'Numéro de la session' }), '12345');
    await fillIn(firstVisit.getByLabelText('Mot de passe de la session Exemple : C-12345'), '6789');
    await click(firstVisit.getByRole('button', { name: 'Surveiller la session' }));

    // when
    await click(firstVisit.getByRole('checkbox', { name: 'Doe John' }));

    // then
    const secondVisit = await visitScreen('/connexion-espace-surveillant');
    await fillIn(secondVisit.getByRole('spinbutton', { name: 'Numéro de la session' }), '12345');
    await fillIn(secondVisit.getByLabelText('Mot de passe de la session Exemple : C-12345'), '6789');
    await click(secondVisit.getByRole('button', { name: 'Surveiller la session' }));
    assert.true(find('input[type="checkbox"]').checked);
  });

  test('when supervisor checks and unchecks the candidate, it should update authorizedToStart', async function (assert) {
    // given
    const sessionId = 12345;
    this.sessionForSupervising = server.create('session-for-supervising', {
      id: sessionId,
      certificationCandidates: [
        server.create('certification-candidate-for-supervising', {
          id: 123,
          firstName: 'John',
          lastName: 'Doe',
          birthdate: '1984-05-28',
          extraTimePercentage: '8',
          authorizedToStart: false,
        }),
      ],
    });

    const firstVisit = await visitScreen('/connexion-espace-surveillant');
    await fillIn(firstVisit.getByRole('spinbutton', { name: 'Numéro de la session' }), '12345');
    await fillIn(firstVisit.getByLabelText('Mot de passe de la session Exemple : C-12345'), '6789');
    await click(firstVisit.getByRole('button', { name: 'Surveiller la session' }));

    // when
    await click(firstVisit.getByRole('checkbox', { name: 'Doe John' }));
    await click(firstVisit.getByRole('checkbox', { name: 'Doe John' }));

    // then
    assert.false(server.schema.certificationCandidateForSupervisings.find(123).authorizedToStart);
  });

  test('when supervisor allow to resume test, it should display a success notification', async function (assert) {
    // given
    const sessionId = 12345;
    this.sessionForSupervising = server.create('session-for-supervising', {
      id: sessionId,
      certificationCandidates: [
        server.create('certification-candidate-for-supervising', {
          id: 123,
          firstName: 'John',
          lastName: 'Doe',
          birthdate: '1984-05-28',
          extraTimePercentage: null,
          authorizedToStart: true,
          assessmentStatus: 'started',
        }),
      ],
    });

    const firstVisit = await visitScreen('/connexion-espace-surveillant');
    await fillIn(firstVisit.getByRole('spinbutton', { name: 'Numéro de la session' }), '12345');
    await fillIn(firstVisit.getByLabelText('Mot de passe de la session Exemple : C-12345'), '6789');
    await click(firstVisit.getByRole('button', { name: 'Surveiller la session' }));

    // when
    await click(firstVisit.getByRole('button', { name: 'Afficher les options du candidat' }));
    await click(firstVisit.getByRole('button', { name: 'Autoriser la reprise du test' }));
    await click(firstVisit.getByRole('button', { name: "Je confirme l'autorisation" }));

    // then
    assert.contains('Succès ! John Doe peut reprendre son test de certification.');
  });
});
