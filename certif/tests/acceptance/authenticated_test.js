import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import {
  createCertificationPointOfContactWithTermsOfServiceAccepted,
  createScoIsManagingStudentsCertificationPointOfContactWithTermsOfServiceAccepted,
  authenticateSession,
} from '../helpers/test-init';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { visit as visitScreen } from '../helpers/testing-library';

module('Acceptance | authenticated', function(hooks) {

  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('When user clicks the sidebar logo', function() {

    test('it should redirect to the sessions list page', async function(assert) {
      // given
      const certificationPointOfContact = createCertificationPointOfContactWithTermsOfServiceAccepted();
      const session = server.create('session', { certificationCenterId: parseInt(certificationPointOfContact.allowedCertificationCenterAccessIds[0]) });
      await authenticateSession(certificationPointOfContact.id);

      // when
      await visit(`/sessions/${session.id}`);
      await click('.sidebar__logo a');

      // then
      assert.equal(currentURL(), '/sessions/liste');
    });
  });

  module('When user clicks the sessions sidebar menu entry', function() {

    test('it should also redirect to the sessions list page', async function(assert) {
      // given
      const certificationPointOfContact = createCertificationPointOfContactWithTermsOfServiceAccepted();
      const session = server.create('session', { certificationCenterId: parseInt(certificationPointOfContact.allowedCertificationCenterAccessIds[0]) });
      await authenticateSession(certificationPointOfContact.id);

      // when
      await visit(`/sessions/${session.id}`);
      await click('.sidebar-menu ul li a:first-child');

      // then
      assert.equal(currentURL(), '/sessions/liste');
    });
  });

  module('SCO temporary banner', function() {

    test('it should display the banner when User is SCO isManagingStudent', async function(assert) {
      // given
      const certificationPointOfContact = createScoIsManagingStudentsCertificationPointOfContactWithTermsOfServiceAccepted();
      await authenticateSession(certificationPointOfContact.id);

      // when
      await visit('/sessions/liste');

      // then
      assert.dom('.pix-banner--information').exists();
      assert.dom('.pix-banner--information').hasText('La certification Pix se déroulera du 29/11/21 au 04/03/22 pour les lycées et du 07/03/22 au 20/05/22 pour les collèges. Les sessions passées hors période ne seront pas traitées. En savoir plus');
    });

    test('it should not display the banner when User is NOT SCO isManagingStudent', async function(assert) {
      // given
      const certificationPointOfContact = createCertificationPointOfContactWithTermsOfServiceAccepted();
      await authenticateSession(certificationPointOfContact.id);

      // when
      await visit('/sessions/liste');

      // then
      assert.dom('.pix-banner--information').doesNotExist();
    });
  });

  module('When user changes current certification center', function() {

    test('should display the new current certification center in the logged menu', async function(assert) {
      // given
      const currentAllowedCertificationCenterAccess = server.create('allowed-certification-center-access', {
        name: 'Bibiche',
        externalId: 'ABC123',
      });
      const anotherAllowedCertificationCenterAccess = server.create('allowed-certification-center-access', {
        name: 'Poupoune',
        externalId: 'DEF456',
      });
      const certificationPointOfContact = server.create('certification-point-of-contact', {
        firstName: 'Buffy',
        lastName: 'Summers',
        pixCertifTermsOfServiceAccepted: true,
        allowedCertificationCenterAccesses: [currentAllowedCertificationCenterAccess, anotherAllowedCertificationCenterAccess],
      });
      await authenticateSession(certificationPointOfContact.id);

      // when
      const screen = await visitScreen('/');
      await click(screen.getByRole('link', { name: 'Buffy Summers Bibiche (ABC123)' }));
      await click(screen.getByRole('button', { name: 'Poupoune' }));

      // then
      assert.contains('Poupoune (DEF456)');
    });

    test('should redirect to sessions/liste URL when changing the current certification center', async function(assert) {
      // given
      const currentAllowedCertificationCenterAccess = server.create('allowed-certification-center-access', {
        id: 123,
        name: 'Bibiche',
        externalId: 'ABC123',
      });
      const anotherAllowedCertificationCenterAccess = server.create('allowed-certification-center-access', {
        id: 456,
        name: 'Poupoune',
        externalId: 'DEF456',
      });
      const certificationPointOfContact = server.create('certification-point-of-contact', {
        firstName: 'Buffy',
        lastName: 'Summers',
        pixCertifTermsOfServiceAccepted: true,
        allowedCertificationCenterAccesses: [currentAllowedCertificationCenterAccess, anotherAllowedCertificationCenterAccess],
      });
      server.create('session', {
        id: 555,
        certificationCenterId: 123,
      });
      await authenticateSession(certificationPointOfContact.id);

      // when
      const screen = await visitScreen('/sessions/555');
      await click(screen.getByRole('link', { name: 'Buffy Summers Bibiche (ABC123)' }));
      await click(screen.getByRole('button', { name: 'Poupoune' }));

      // then
      assert.equal(currentURL(), '/sessions/liste');
    });

    test('should redirect to espace-ferme URL when changing the current certification center to a blocked one', async function(assert) {
      // given
      const currentAllowedCertificationCenterAccess = server.create('allowed-certification-center-access', {
        id: 123,
        name: 'Bibiche',
        externalId: 'ABC123',
      });
      const anotherAllowedCertificationCenterAccess = server.create('allowed-certification-center-access', {
        id: 456,
        name: 'Poupoune',
        externalId: 'DEF456',
        isAccessBlockedCollege: true,
      });
      const certificationPointOfContact = server.create('certification-point-of-contact', {
        firstName: 'Buffy',
        lastName: 'Summers',
        pixCertifTermsOfServiceAccepted: true,
        allowedCertificationCenterAccesses: [currentAllowedCertificationCenterAccess, anotherAllowedCertificationCenterAccess],
      });
      server.create('session', {
        id: 555,
        certificationCenterId: 123,
      });
      await authenticateSession(certificationPointOfContact.id);

      // when
      const screen = await visitScreen('/sessions/555');
      await click(screen.getByRole('link', { name: 'Buffy Summers Bibiche (ABC123)' }));
      await click(screen.getByRole('button', { name: 'Poupoune' }));

      // then
      assert.equal(currentURL(), '/espace-ferme');
    });

    test('should redirect to sessions/liste URL when changing from a blocked certification center to a not blocked one', async function(assert) {
      // given
      const currentAllowedCertificationCenterAccess = server.create('allowed-certification-center-access', {
        id: 123,
        name: 'Bibiche',
        externalId: 'ABC123',
        isAccessBlockedCollege: true,
      });
      const anotherAllowedCertificationCenterAccess = server.create('allowed-certification-center-access', {
        id: 456,
        name: 'Poupoune',
        externalId: 'DEF456',
      });
      const certificationPointOfContact = server.create('certification-point-of-contact', {
        firstName: 'Buffy',
        lastName: 'Summers',
        pixCertifTermsOfServiceAccepted: true,
        allowedCertificationCenterAccesses: [currentAllowedCertificationCenterAccess, anotherAllowedCertificationCenterAccess],
      });
      server.create('session', {
        id: 555,
        certificationCenterId: 123,
      });
      await authenticateSession(certificationPointOfContact.id);

      // when
      const screen = await visitScreen('/');
      await click(screen.getByRole('link', { name: 'Buffy Summers Bibiche (ABC123)' }));
      await click(screen.getByRole('button', { name: 'Poupoune' }));

      // then
      assert.equal(currentURL(), '/sessions/liste');
    });
  });
});
