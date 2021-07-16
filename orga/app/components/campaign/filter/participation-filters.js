import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ParticipationFilters extends Component {
  @service currentUser;

  get displayFilters() {
    return this.displayStagesFilter || this.displayBadgesFilter || this.displayDivisionFilter || this.displayStatusFilter;
  }

  get displayStagesFilter() {
    const { isTypeAssessment, hasStages } = this.args.campaign;

    return isTypeAssessment && hasStages && !this.args.isStagesHidden;
  }

  get displayStatusFilter() {
    return !!this.args.statusOptions;
  }

  get displayBadgesFilter() {
    const { isTypeAssessment, hasBadges } = this.args.campaign;

    return isTypeAssessment && hasBadges && !this.args.isBadgesHidden;
  }

  get displayDivisionFilter() {
    return this.isDivisionsLoaded && this.currentUser.isSCOManagingStudents;
  }

  get stageOptions() {
    return this.args.campaign.stages.map(({ id, threshold }) => ({ value: id, threshold }));
  }

  get badgeOptions() {
    return this.args.campaign.badges.map(({ id, title }) => ({ value: id, label: title }));
  }

  get isDivisionsLoaded() {
    return this.args.campaign.divisions.content.length > 0;
  }

  get divisionOptions() {
    return this.args.campaign.divisions.map(({ name }) => ({ value: name, label: name }));
  }

  @action
  onSelectStage(stages) {
    this.args.onTriggerFiltering({ stages });
  }

  @action
  onSelectBadge(badges) {
    this.args.onTriggerFiltering({ badges });
  }

  @action
  onSelectDivision(divisions) {
    this.args.onTriggerFiltering({ divisions });
  }

  @action
  onSelectStatus(status) {
    this.args.onTriggerFiltering({ status });
  }
}
