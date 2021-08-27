import { module, test } from 'qunit';
import sinon from 'sinon';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import clickByLabel from '../../../../helpers/extended-ember-test-helpers/click-by-label';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | Student::Sco::DissociateUserModal', function(hooks) {

  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('display', true);
    this.set('onSubmit', sinon.stub());
    this.set('close', sinon.stub());

    return render(hbs`<Student::Sco::DissociateUserModal @onSubmit={{onSubmit}} @display={{display}} @onClose={{close}} @student={{student}}/>`);
  });

  module('when the user is authenticated with an email', function() {

    test('it displays a message for user authentified by email', function(assert) {
      this.set('student', { hasEmail: true, email: 'rocky.balboa@example.net', firstName: 'Rocky', lastName: 'Balboa' });

      assert.contains('Souhaitez-vous dissocier le compte Pix de l\'élève Rocky Balboa ?');
    });
  });

  module('when the user is authenticated with an username', function() {

    test('it displays a message for user authentified by username', function(assert) {
      this.set('student', { hasUsername: true, username: 'appolo.creed', firstName: 'Appolo', lastName: 'Creed' });

      assert.contains('Souhaitez-vous dissocier le compte Pix de l\'élève Appolo Creed ?');
    });
  });

  module('when the user is authenticated with GAR', function() {

    test('it displays a message for user authentified with GAR', function(assert) {
      this.set('student', { hasEmail: false, hasUsername: false, firstName: 'Ivan', lastName: 'Drago' });

      assert.contains('Souhaitez-vous dissocier le compte Pix de l\'élève Ivan Drago ?');
    });
  });

  module('dissociate button', function(hooks) {
    let studentAdapter;
    let notifications;

    hooks.beforeEach(function() {
      const store = this.owner.lookup('service:store');
      notifications = this.owner.lookup('service:notifications');
      studentAdapter = store.adapterFor('student');
      sinon.stub(studentAdapter, 'dissociateUser');
      sinon.stub(notifications, 'sendSuccess');
      sinon.stub(notifications, 'sendError');
    });

    hooks.afterEach(function() {
      studentAdapter.dissociateUser.restore();
    });

    test('it dissociate user form student on click', async function(assert) {
      const student = { id: 12345 };
      this.set('student', student);
      await clickByLabel('Oui, dissocier le compte');

      assert.ok(studentAdapter.dissociateUser.calledWith(student));
    });

    test('it should display a successful notification', async function(assert) {
      const student = { id: 12345, lastName: 'Dupont', firstName: 'Jean' };
      this.set('student', student);

      await clickByLabel('Oui, dissocier le compte');

      assert.ok(notifications.sendSuccess.calledWith('La dissociation du compte de l’élève Dupont Jean est réussie.'));
    });

    test('it should display an error notification', async function(assert) {
      studentAdapter.dissociateUser.rejects();
      const student = { id: 12345, lastName: 'Dupont', firstName: 'Jean' };
      this.set('student', student);

      await clickByLabel('Oui, dissocier le compte');

      assert.ok(notifications.sendError.calledWith('La dissociation du compte de l’élève Dupont Jean a échoué. Veuillez réessayer.'));
    });
  });

});
