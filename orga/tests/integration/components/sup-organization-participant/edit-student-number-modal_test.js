import { module, test } from 'qunit';
import sinon from 'sinon';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { render } from '@ember/test-helpers';
import { fillByLabel, clickByName } from '@1024pix/ember-testing-library';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | ScoOrganizationParticipant::EditStudentNumberModal', function (hooks) {
  setupIntlRenderingTest(hooks);
  let closeStub;
  let notificationsStub;
  let onSaveStudentNumberStub;

  hooks.beforeEach(function () {
    this.student = EmberObject.create({
      id: '123',
      firstName: 'Lyanna',
      lastName: 'Mormont',
      studentNumber: '1234',
    });

    onSaveStudentNumberStub = sinon.stub();

    notificationsStub = this.owner.lookup('service:notifications');

    closeStub = sinon.stub();

    sinon.stub(notificationsStub, 'sendSuccess');

    this.set('display', true);
    this.set('close', closeStub);
    this.set('onSaveStudentNumber', onSaveStudentNumberStub);

    return render(
      hbs`<SupOrganizationParticipant::EditStudentNumberModal @display={{display}} @onClose={{close}} @student={{this.student}} @onSubmit={{onSaveStudentNumber}}/>`
    );
  });

  module('when the edit student number modal is open', function () {
    module('when there is student number', function () {
      test('should render component with student number text', async function (assert) {
        assert.contains(`Numéro étudiant actuel de ${this.student.firstName} ${this.student.lastName} est :`);
        assert.contains(this.student.studentNumber);
      });
    });

    module('when there is no student number yet', function () {
      test('should not render component with student number text', async function (assert) {
        this.student.set('studentNumber', null);
        render(
          hbs`<SupOrganizationParticipant::EditStudentNumberModal @display={{display}} @onClose={{close}} @student={{this.student}} @onSubmit={{onSaveStudentNumber}}/>`
        );

        assert.notContains(
          `Numéro étudiant actuel de ${this.student.firstName} ${this.student.lastName} est : ${this.student.studentNumber}`
        );
      });
    });

    module('When a student number is entered', function () {
      test('should have the update button enable', async function (assert) {
        // when
        await fillByLabel('Nouveau numéro étudiant', this.student.studentNumber);

        // then
        assert.dom('button[type=submit]').doesNotHaveAttribute('disabled');
      });
    });

    module('when a student number is not entered yet', function () {
      test('should have the update button disable', async function (assert) {
        // when
        await fillByLabel('Nouveau numéro étudiant', '');
        await clickByName('Mettre à jour');

        // then
        assert.dom('button[type=submit]').exists();
        assert.dom('button[type=submit]').hasAttribute('disabled');
      });
    });

    module('when the update button is clicked and a good student number is entered', function () {
      test('it display success notification', async function (assert) {
        // given
        onSaveStudentNumberStub.withArgs(123456).resolves();

        // when
        await fillByLabel('Nouveau numéro étudiant', '123456');
        await clickByName('Mettre à jour');

        // then
        assert.dom('.error-message').hasText('');
        sinon.assert.calledOnce(closeStub);
        assert.ok(
          notificationsStub.sendSuccess.calledWith(
            `La modification du numéro étudiant de ${this.student.firstName} ${this.student.lastName} a bien été effectué.`
          )
        );
      });
    });

    module('when the update button is clicked and a wrong student number is entered', function () {
      test('it display error message', async function (assert) {
        // when
        await fillByLabel('Nouveau numéro étudiant', ' ');
        await clickByName('Mettre à jour');

        // then
        assert.dom('.error-message').hasText('Le numéro étudiant ne doit pas être vide.');
      });
    });

    module(
      'when the update button is clicked with the student number and this student number already exist',
      function () {
        test('it display an error under student number input', async function (assert) {
          // given
          const error = {
            errors: [
              {
                status: '412',
                detail: 'STUDENT_NUMBER_EXISTS',
              },
            ],
          };
          onSaveStudentNumberStub.rejects(error);

          // when
          await fillByLabel('Nouveau numéro étudiant', '77107');
          await clickByName('Mettre à jour');

          // then
          assert.contains(
            `Le numéro étudiant saisi est déjà utilisé par l’étudiant ${this.student.firstName} ${this.student.lastName}`
          );
        });

        test('it remove errors when submitting is a success', async function (assert) {
          // given
          const error = {
            errors: [
              {
                status: '412',
                detail: 'STUDENT_NUMBER_EXISTS',
              },
            ],
          };
          onSaveStudentNumberStub.onFirstCall().rejects(error).onSecondCall().resolves();

          // when
          await fillByLabel('Nouveau numéro étudiant', '77107');
          await clickByName('Mettre à jour');
          await fillByLabel('Nouveau numéro étudiant', '65432');
          await clickByName('Mettre à jour');

          // then
          assert.notContains(
            `Le numéro étudiant saisi est déjà utilisé par l’étudiant ${this.student.firstName} ${this.student.lastName}`
          );
        });
      }
    );

    module('when the close button is clicked', function () {
      test('it remove errors and student number value', async function (assert) {
        // given
        const error = {
          errors: [
            {
              status: '412',
              detail: 'Error occured',
            },
          ],
        };

        // when
        onSaveStudentNumberStub.rejects(error);
        await clickByName(this.intl.t('common.actions.close'));

        // then
        assert.dom('button[type=submit]').hasValue('');
        assert.dom('.error-message').hasText('');
        sinon.assert.calledOnce(closeStub);
      });
    });

    module('when the cancel button is clicked', function () {
      test('it remove errors and student number value too', async function (assert) {
        // given
        const error = {
          errors: [
            {
              status: '412',
              detail: 'Error occured',
            },
          ],
        };

        // when
        onSaveStudentNumberStub.rejects(error);
        await clickByName('Annuler');

        // then
        assert.dom('button[type=submit]').hasValue('');
        assert.dom('.error-message').hasText('');
        sinon.assert.calledOnce(closeStub);
      });
    });
  });

  module('when the edit student number modal is not open', function () {
    test('should not render component', async function (assert) {
      // given
      this.set('display', false);
      render(
        hbs`<SupOrganizationParticipant::EditStudentNumberModal @display={{display}} @onClose={{close}} @student={{this.student}}/>`
      );

      // then
      assert.dom('[aria-modal="true"]').doesNotExist();
    });
  });
});
