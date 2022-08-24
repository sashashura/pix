import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class DeleteModal extends Component {
  get message() {
    return `Êtes-vous sûr de vouloir supprimer ce lot de place: ${this.args.organizationPlacesLot.reference} ?`;
  }

  @action
  async deleteOrganizationPlaceLot() {
    await this.args.organizationPlacesLot.deleteRecord();
    await this.args.organizationPlacesLot.save({ adapterOptions: { organizationId: this.args.organizationId } });

    this.args.toggle();
  }
}
