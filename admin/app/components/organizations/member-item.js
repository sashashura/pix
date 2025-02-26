import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

const options = [
  { value: 'ADMIN', label: 'Administrateur' },
  { value: 'MEMBER', label: 'Membre' },
];

export default class MemberItem extends Component {
  @service notifications;
  @service accessControl;

  @tracked organizationRoles = null;
  @tracked isEditionMode = false;
  @tracked selectedNewRole = null;
  @tracked displayConfirm = false;

  constructor() {
    super(...arguments);
    this.organizationRoles = options;
  }

  @action
  setRoleSelection(event) {
    this.selectedNewRole = event.target.value;
    this.isEditionMode = true;
  }

  @action
  updateRoleOfMember() {
    this.isEditionMode = false;
    if (!this.selectedNewRole) return false;
    this.args.membership.organizationRole = this.selectedNewRole;
    return this.args.updateMembership(this.args.membership);
  }

  @action
  cancelUpdateRoleOfMember() {
    this.isEditionMode = false;
    this.selectedNewRole = null;
  }

  @action
  editRoleOfMember() {
    this.isEditionMode = true;
    this.selectedNewRole = null;
  }

  @action
  toggleDisplayConfirm() {
    this.displayConfirm = !this.displayConfirm;
  }

  @action
  disableMembership() {
    this.toggleDisplayConfirm();
    return this.args.disableMembership(this.args.membership);
  }
}
