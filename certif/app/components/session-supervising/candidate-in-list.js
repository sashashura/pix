import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CandidateInList extends Component {
  @service notifications;

  @tracked isMenuOpen = false;
  @tracked isConfirmationModalDisplayed = false;
  @tracked isEndTestConfirmationModalDisplayed = false;
  @tracked modalDescriptionText;
  @tracked modalCancelText;
  @tracked modalConfirmationText;
  @tracked modalInstructionText;
  @tracked actionOnConfirmation;

  @action
  async toggleCandidate(candidate) {
    await this.args.toggleCandidate(candidate);
  }

  @action
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @action
  closeMenu() {
    this.isMenuOpen = false;
  }

  @action
  askUserToConfirmTestResume() {
    this.isConfirmationModalDisplayed = true;
  }

  @action
  askUserToConfirmTestEnd() {
    this.modalDescriptionText = 'Attention : cette action entraine la fin de son test de certification et est irréversible.';
    this.modalInstructionText = `Terminer le test de ${this.args.candidate.firstName} ${this.args.candidate.lastName} ?`;
    this.isEndTestConfirmationModalDisplayed = true;
  }

  @action
  closeConfirmationModal() {
    this.isConfirmationModalDisplayed = false;
    this.isEndTestConfirmationModalDisplayed = false;
  }

  @action
  async authorizeTestResume() {
    this.closeConfirmationModal();
    try {
      await this.args.onCandidateTestResumeAuthorization(this.args.candidate);
      this.notifications.success(
        `Succès ! ${this.args.candidate.firstName} ${this.args.candidate.lastName} peut reprendre son test de certification.`,
      );
    } catch (error) {
      this.notifications.error(
        `Une erreur est survenue, ${this.args.candidate.firstName} ${this.args.candidate.lastName} n'a a pu être autorisé à reprendre son test.`,
      );
    }
  }

  @action
  async endTestForCandidate() {
    this.closeConfirmationModal();
    try {
      await this.args.onSupervisorEndTest(this.args.candidate);
      this.notifications.success(
        `Succès ! Le test de  ${this.args.candidate.firstName} ${this.args.candidate.lastName} est terminé.`,
      );
    } catch (error) {
      this.notifications.error(
        `Une erreur est survenue, le test de ${this.args.candidate.firstName} ${this.args.candidate.lastName} n'a pas pu être terminé`,
      );
    }
  }

  get actionMethod() {
    return this.actionOnConfirmation;
  }
}
