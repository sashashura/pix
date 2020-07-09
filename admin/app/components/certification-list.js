import Component from '@ember/component';
import { action } from '@ember/object';

export default class CertificationList extends Component {

  @action
  selectStatus(event) {
    return this.selectStatusForSearch(event.target.value || null);
  }
}
