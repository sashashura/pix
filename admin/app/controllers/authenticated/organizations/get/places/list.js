import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class List extends Controller {
  @service store;

  @tracked displayModal = false;
  @tracked message = null;
  @tracked organizationPlace = null;

  @action
  async toggleDisplayModal(placeLot) {
    this.displayModal = !this.displayModal;

    if (this.displayModal) {
      this.organizationPlace = placeLot;

      this.message = `Etes-vous sûr de vouloir supprimer ce lot de place : ${this.organizationPlace.reference} ?`;
    } else {
      this.message = null;
      this.organizationPlace = null;
    }
  }

  @action
  async deleteOrganizationPlaceLot() {
    await this.organizationPlace.deleteRecord();
    await this.organizationPlace.save({ adapterOptions: { organizationId: this.model.organization.id } });

    this.displayModal = !this.displayModal;
  }
}
