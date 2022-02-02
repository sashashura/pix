import { World } from '@cucumber/cucumber';
export default class extends World {
  userId = null;
  campaignId = null;
  assessmentId = null;

  constructor(options) {
    super(options);
  }

  set userId(id) {
    this.userId = id;
  }

  get userId() {
    return this.userId;
  }

  set campaignId(id) {
    this.campaignId = id;
  }

  get campaignId() {
    return this.campaignId;
  }

  set assessmentId(id) {
    this.assessmentId = id;
  }

  get assessmentId() {
    return this.assessmentId;
  }
}
