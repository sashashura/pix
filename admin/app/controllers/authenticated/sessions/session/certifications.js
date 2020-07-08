import _ from 'lodash';

import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { debounce } from '@ember/runloop';
import config from 'pix-admin/config/environment';

const DEFAULT_PAGE_NUMBER = 1;

export default class ListController extends Controller {
  queryParams = ['pageNumber', 'pageSize', 'id', 'firstName', 'lastName', 'pixScore'];
  DEBOUNCE_MS = config.pagination.debounce;

  @service notifications;

  @tracked displayConfirm = false;
  @tracked confirmMessage = null;

  @tracked pageNumber = DEFAULT_PAGE_NUMBER;
  @tracked pageSize = 10;
  @tracked id = null;
  @tracked firstName = null;
  @tracked lastName = null;
  @tracked pixScore = null;
  pendingFilters = {};

  @computed('model.juryCertificationSummaries.@each.status')
  get canPublish() {
    return !(_.some(
      this.model.juryCertificationSummaries.toArray(),
      (certif) => ['error', 'started'].includes(certif.status)
    ));
  }

  @action
  triggerFiltering(fieldName, event) {
    const value = event.target.value;
    this.pendingFilters[fieldName] = value;
    debounce(this, this.updateFilters, this.DEBOUNCE_MS);
  }

  @action
  displayCertificationStatusUpdateConfirmationModal() {
    const sessionIsPublished = this.model.isPublished;

    if (!this.canPublish && !sessionIsPublished) return;

    const text = sessionIsPublished
      ? 'Souhaitez-vous dépublier la session ?'
      : 'Souhaitez-vous publier la session ?';

    this.confirmMessage = text;
    this.displayConfirm = true;
  }

  @action
  async toggleSessionPublication() {
    const toPublish = !this.model.isPublished;
    const successText = toPublish
      ? 'Les certifications ont été correctement publiées.'
      : 'Les certifications ont été correctement dépubliées.';

    try {
      await this.model.save({ adapterOptions: { updatePublishedCertifications: true, toPublish } });
      this.model.juryCertificationSummaries.reload();
      this.model.isPublished = toPublish;
      this.notifications.success(successText);
    } catch (error) {
      this.notifications.error(error);
    }
    this.displayConfirm = false;
  }

  @action
  onCancelConfirm() {
    this.displayConfirm = false;
  }

  updateFilters() {
    this.setProperties(this.pendingFilters);
    this.pendingFilters = {};
    this.pageNumber = DEFAULT_PAGE_NUMBER;
  }
}
