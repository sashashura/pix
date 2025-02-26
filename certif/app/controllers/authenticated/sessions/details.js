import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
/* eslint-disable ember/no-computed-properties-in-native-classes*/
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
/* eslint-enable ember/no-computed-properties-in-native-classes*/

export default class SessionsDetailsController extends Controller {
  @service currentUser;
  @service featureToggles;

  @alias('model.session') session;
  @alias('model.certificationCandidates') certificationCandidates;

  get pageTitle() {
    return `Détails | Session ${this.session.id} | Pix Certif`;
  }

  get shouldDisplaySupervisorKitButton() {
    return this.currentUser.currentAllowedCertificationCenterAccess.isEndTestScreenRemovalEnabled;
  }

  @computed('certificationCandidates.length')
  get certificationCandidatesCount() {
    const certificationCandidatesCount = this.certificationCandidates.length;
    return certificationCandidatesCount > 0 ? `(${certificationCandidatesCount})` : '';
  }

  @computed('certificationCandidates.length')
  get hasOneOrMoreCandidates() {
    const certificationCandidatesCount = this.certificationCandidates.length;
    return certificationCandidatesCount > 0;
  }

  @computed('hasOneOrMoreCandidates')
  get shouldDisplayDownloadButton() {
    return this.hasOneOrMoreCandidates;
  }

  get shouldDisplayPrescriptionScoStudentRegistrationFeature() {
    return this.currentUser.currentAllowedCertificationCenterAccess.isScoManagingStudents;
  }
}
