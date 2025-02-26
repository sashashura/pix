import { module, test } from 'qunit';
import { click, currentURL } from '@ember/test-helpers';
import { clickByName, fillByLabel, visit } from '@1024pix/ember-testing-library';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { createAuthenticateSession } from 'pix-admin/tests/helpers/test-init';

module('Acceptance | authenticated/users/get', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  async function buildAndAuthenticateUser(server, { email, username }) {
    const organizationLearner = server.create('organization-learner', { firstName: 'John' });
    const pixAuthenticationMethod = server.create('authentication-method', { identityProvider: 'PIX' });
    const garAuthenticationMethod = server.create('authentication-method', { identityProvider: 'GAR' });
    const user = server.create('user', {
      'first-name': 'john',
      'last-name': 'harry',
      email,
      username,
      'is-authenticated-from-gar': false,
    });
    user.organizationLearners = [organizationLearner];
    user.authenticationMethods = [pixAuthenticationMethod, garAuthenticationMethod];
    user.save();
    server.create('admin-member', {
      userId: user.id,
      isSuperAdmin: true,
    });
    await createAuthenticateSession({ userId: user.id });

    return user;
  }

  test('should access on user details page by URL /users/:id', async function (assert) {
    // when
    const user = await buildAndAuthenticateUser(this.server, { email: 'john.harry@example.net', username: null });
    await visit(`/users/${user.id}`);

    // then
    assert.deepEqual(currentURL(), `/users/${user.id}`);
  });

  test('should redirect to list users page when click page title', async function (assert) {
    // given
    const user = await buildAndAuthenticateUser(this.server, { email: 'john.harry@example.net', username: null });
    await visit(`/users/${user.id}`);

    // when
    await clickByName('Tous les utilisateurs');

    // then
    assert.strictEqual(currentURL(), '/users/list');
  });

  module('when administrator click to edit users details', function () {
    test('should update user firstName, lastName and email', async function (assert) {
      // given
      const user = await buildAndAuthenticateUser(this.server, { email: 'john.harry@example.net', username: null });
      const screen = await visit(`/users/${user.id}`);
      await clickByName('Modifier');

      // when
      await fillByLabel('* Prénom :', 'john');
      await fillByLabel('* Nom :', 'doe');
      await fillByLabel('* Adresse e-mail :', 'john.doe@example.net');

      await clickByName('Editer');

      // then
      assert.dom(screen.getByText('john')).exists();
      assert.dom(screen.getByText('doe')).exists();
      assert.dom(screen.getByText('john.doe@example.net')).exists();
    });

    test('should update user firstName, lastName and username', async function (assert) {
      // given
      const user = await buildAndAuthenticateUser(this.server, { email: null, username: 'john.harry0101' });
      const screen = await visit(`/users/${user.id}`);
      await clickByName('Modifier');

      // when
      await fillByLabel('* Prénom :', 'john');
      await fillByLabel('* Nom :', 'doe');
      await fillByLabel('* Identifiant :', 'john.doe0101');

      await clickByName('Editer');

      // then
      assert.dom(screen.getByText('john')).exists();
      assert.dom(screen.getByText('doe')).exists();
      assert.dom(screen.getByText('john.doe0101')).exists();
    });
  });

  module('when administrator click on anonymize button and confirm modal', function () {
    test('should anonymize the user and remove all authentication methods', async function (assert) {
      // given
      await buildAndAuthenticateUser(this.server, {
        email: 'john.harry@example.net',
        username: 'john.harry121297',
      });

      const pixAuthenticationMethod = server.create('authentication-method', { identityProvider: 'PIX' });
      const garAuthenticationMethod = server.create('authentication-method', { identityProvider: 'GAR' });
      const userToAnonymise = server.create('user', {
        firstName: 'Jane',
        lastName: 'Harry',
        email: 'jane.harry@example.net',
        username: 'jane.harry050697',
        isAuthenticatedFromGar: false,
        authenticationMethods: [pixAuthenticationMethod, garAuthenticationMethod],
      });

      const screen = await visit(`/users/${userToAnonymise.id}`);
      await clickByName('Anonymiser cet utilisateur');

      // when
      await clickByName('Confirmer');

      // then
      assert.dom(screen.getByText(`prenom_${userToAnonymise.id}`)).exists();
      assert.dom(screen.getByText(`nom_${userToAnonymise.id}`)).exists();
      assert.dom(screen.getByText(`email_${userToAnonymise.id}@example.net`)).exists();

      assert.dom(screen.getByLabelText("L'utilisateur n'a pas de méthode de connexion avec identifiant")).exists();
      assert.dom(screen.getByLabelText("L'utilisateur n'a pas de méthode de connexion avec adresse e-mail")).exists();
      assert.dom(screen.getByLabelText("L'utilisateur n'a pas de méthode de connexion Médiacentre")).exists();
      assert.dom(screen.getByLabelText("L'utilisateur n'a pas de méthode de connexion Pôle Emploi")).exists();
    });
  });

  module('when administrator click on dissociate button', function () {
    test('should not display registration any more', async function (assert) {
      // given
      const user = await buildAndAuthenticateUser(this.server, { email: 'john.harry@example.net', username: null });
      const organizationName = 'Organisation_to_dissociate_of';
      const organizationLearnerToDissociate = this.server.create('organization-learner', {
        id: 10,
        organizationName,
        canBeDissociated: true,
      });
      user.organizationLearners.models.push(organizationLearnerToDissociate);
      user.save();

      const screen = await visit(`/users/${user.id}`);
      await click(screen.getByRole('button', { name: 'Dissocier' }));

      // when
      await clickByName('Oui, je dissocie');

      // then
      assert.deepEqual(currentURL(), `/users/${user.id}`);
      assert.dom(screen.queryByText('Organisation_to_dissociate_of')).doesNotExist();
    });
  });

  module('when administrator click on remove authentication method button', function () {
    test('should not display remove link and display unchecked icon', async function (assert) {
      // given
      const user = await buildAndAuthenticateUser(this.server, { email: 'john.harry@example.net', username: null });
      const screen = await visit(`/users/${user.id}`);

      // when
      await click(screen.getAllByRole('button', { name: 'Supprimer' })[0]);
      await clickByName('Oui, je supprime');

      // then
      assert.dom(screen.getByLabelText("L'utilisateur n'a pas de méthode de connexion avec adresse e-mail")).exists();
      assert.dom(screen.queryByText('Supprimer')).doesNotExist();
    });
  });

  module('when administrator click on delete participation button', function () {
    test('should mark participation as deleted', async function (assert) {
      // given
      const userParticipation = this.server.create('user-participation', { deletedAt: null });
      const user = server.create('user');
      user.participations = [userParticipation];
      user.save();
      this.server.create('admin-member', {
        userId: user.id,
        isSuperAdmin: true,
      });
      await createAuthenticateSession({ userId: user.id });

      const screen = await visit(`/users/${user.id}/participations`);

      // when
      await click(screen.getByRole('button', { name: 'Supprimer' }));
      await clickByName('Oui, je supprime');

      // then
      assert.dom(screen.getByText('La participation du prescrit a été supprimée avec succès.')).exists();
      assert.dom(screen.getByText('12/12/2012 par')).exists();
      assert.dom(screen.getByRole('link', { name: 'Terry Dicule' })).exists();
    });
  });

  module('when administrator clicks on organizations tab', function () {
    test('should display user’s organizations', async function (assert) {
      // given
      const organizationMembership1 = this.server.create('organization-membership', {
        role: 'MEMBER',
        organizationId: 100025,
        organizationName: 'Dragon & Co',
        organizationType: 'PRO',
      });

      const organizationMembership2 = this.server.create('organization-membership', {
        role: 'MEMBER',
        organizationId: 100095,
        organizationName: 'Collège The Night Watch',
        organizationType: 'SCO',
        organizationExternalId: '1237457A',
      });

      const user = server.create('user', {
        email: 'john.harry@example.net',
        organizationMemberships: [organizationMembership1, organizationMembership2],
      });

      this.server.create('admin-member', {
        userId: user.id,
        isSuperAdmin: true,
      });
      await createAuthenticateSession({ userId: user.id });

      const screen = await visit(`/users/${user.id}`);

      // when
      await click(screen.getByRole('link', { name: 'Organisations de l’utilisateur' }));

      // then
      assert.deepEqual(currentURL(), `/users/${user.id}/organizations`);
      assert.dom(screen.getByText('Collège The Night Watch')).exists();
      assert.dom(screen.getByText('Dragon & Co')).exists();
    });
  });
});
