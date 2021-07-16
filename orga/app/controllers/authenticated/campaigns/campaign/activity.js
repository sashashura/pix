import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ActivityController extends Controller {
  @service intl;

  queryParams = ['pageNumber', 'pageSize'];
  @tracked pageNumber = 1;
  @tracked pageSize = 25;
  @tracked divisions = [];
  @tracked status = [];

  get statusOptions() {
    if (this.model.campaign.isTypeAssessment) {
      return [
        { label: this.intl.t('pages.campaign-activity.status-filter.started-assessment'), value: 'started' },
        { label: this.intl.t('pages.campaign-activity.status-filter.completed-assessment'), value: 'completed' },
        { label: this.intl.t('pages.campaign-activity.status-filter.shared-assessment'), value: 'shared' },
      ];
    } else {
      return [
        { label: this.intl.t('pages.campaign-activity.status-filter.completed-profile'), value: 'completed' },
        { label: this.intl.t('pages.campaign-activity.status-filter.shared-profile'), value: 'shared' },
      ];
    }
  }

  @action
  goToParticipantPage(campaignId, participationId) {
    this.transitionToRoute('authenticated.campaigns.assessment', campaignId, participationId);
  }

  @action
  triggerFiltering(filters) {
    this.pageNumber = null;
    this.divisions = filters.divisions;
    this.status = filters.status;
  }

  @action
  resetFiltering() {
    this.pageNumber = null;
    this.divisions = [];
    this.status = [];
  }
}
