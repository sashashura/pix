/* eslint ember/no-computed-properties-in-native-classes: 0 */

import Model, { belongsTo, attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export const ACQUIRED = 'acquired';

const professionalizingDate = new Date('2022-01-01');

export default class Certification extends Model {
  @service url;

  static PARTNER_KEY_CLEA = 'PIX_EMPLOI_CLEA';
  // attributes
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('date-only') birthdate;
  @attr('string') birthplace;
  @attr('date') date;
  @attr('date') deliveredAt;
  @attr('boolean') isPublished;
  @attr('string') certificationCenter;
  @attr('string') commentForCandidate;
  @attr('number') pixScore;
  @attr('string') status;
  @attr('string') verificationCode;
  @attr() cleaCertificationStatus;
  @attr() certifiedBadgeImages;
  @attr('number') maxReachableLevelOnCertificationDate;

  // includes
  @belongsTo('resultCompetenceTree') resultCompetenceTree;
  @belongsTo('user') user;

  @computed('cleaCertificationStatus')
  get hasCleaCertif() {
    return this.cleaCertificationStatus === ACQUIRED;
  }

  @computed('certifiedBadgeImages.length', 'hasCleaCertif')
  get hasAcquiredComplementaryCertifications() {
    return this.hasCleaCertif || this.certifiedBadgeImages.length > 0;
  }

  @computed('firstName', 'lastName')
  get fullName() {
    return this.firstName + ' ' + this.lastName;
  }

  get shouldDisplayProfessionalizingWarning() {
    return this.url.isFrenchDomainExtension && new Date(this.deliveredAt).getTime() >= professionalizingDate.getTime();
  }

  get maxReachablePixCountOnCertificationDate() {
    return this.maxReachableLevelOnCertificationDate * 8 * 16;
  }
}
