import { module, test } from 'qunit';
import { click, currentURL, visit, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from '../helpers/test-init';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setFlatpickrDate } from 'ember-flatpickr/test-support/helpers';

module('Acceptance | Session creation', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it should not be accessible by an unauthenticated user', async function (assert) {
    // when
    await visit('/sessions/creation');

    // then
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line qunit/no-assert-equal
    assert.equal(currentURL(), '/connexion');
  });

  module('when the user is authenticated', (hooks) => {
    let allowedCertificationCenterAccess;
    let certificationPointOfContact;

    hooks.beforeEach(async function () {
      allowedCertificationCenterAccess = server.create('allowed-certification-center-access', {
        isAccessBlockedCollege: false,
        isAccessBlockedLycee: false,
        isAccessBlockedAEFE: false,
        isAccessBlockedAgri: false,
      });
      certificationPointOfContact = server.create('certification-point-of-contact', {
        firstName: 'Buffy',
        lastName: 'Summers',
        pixCertifTermsOfServiceAccepted: true,
        allowedCertificationCenterAccesses: [allowedCertificationCenterAccess],
      });
      await authenticateSession(certificationPointOfContact.id);
    });

    module('when current certification center is blocked', function () {
      test('should redirect to espace-ferme URL', async function (assert) {
        // given
        allowedCertificationCenterAccess.update({ isAccessBlockedCollege: true });

        // when
        await visit('/sessions/creation');

        // then
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line qunit/no-assert-equal
        assert.equal(currentURL(), '/espace-ferme');
      });
    });

    test('it should create a session and redirect to session details', async function (assert) {
      // given
      const sessionDate = '2029-12-25';
      const sessionFormattedTime = '02/02/2019 13:45';
      const sessionTime = new Date(sessionFormattedTime);

      await visit('/sessions/creation');
      assert.dom('#session-address').exists();
      assert.dom('#session-room').exists();
      assert.dom('#session-date').exists();
      assert.dom('#session-time').exists();
      assert.dom('#session-examiner').exists();
      assert.dom('#session-description').exists();
      assert.dom('[data-test-id="session-form__submit-button"]').exists();
      assert.dom('#session-description').hasAttribute('maxLength', '350');

      await fillIn('#session-address', 'My address');
      await fillIn('#session-room', 'My room');
      await fillIn('#session-examiner', 'My examiner');
      await fillIn('#session-description', 'My description');
      await setFlatpickrDate('#session-date', sessionDate);
      await setFlatpickrDate('#session-time', sessionTime);
      await click('[data-test-id="session-form__submit-button"]');

      // then
      const session = server.schema.sessions.findBy({ date: sessionDate });
      assert.strictEqual(session.address, 'My address');
      assert.strictEqual(session.room, 'My room');
      assert.strictEqual(session.examiner, 'My examiner');
      assert.strictEqual(session.description, 'My description');
      assert.strictEqual(session.date, sessionDate);
      assert.strictEqual(session.time, '13:45');
      assert.strictEqual(currentURL(), `/sessions/${session.id}`);
    });

    test('it should go back to sessions list on cancel without creating any sessions', async function (assert) {
      // given
      const previousSessionsCount = server.schema.sessions.all().length;
      await visit('/sessions/creation');

      // when
      await click('[data-test-id="session-form__cancel-button"]');

      // then
      const actualSessionsCount = server.schema.sessions.all().length;
      assert.strictEqual(currentURL(), '/sessions/liste');
      assert.strictEqual(previousSessionsCount, actualSessionsCount);
    });
  });
});
