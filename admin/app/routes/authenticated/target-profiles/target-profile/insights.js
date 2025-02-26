import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TargetProfileInsightsRoute extends Route {
  @service accessControl;

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin', 'isSupport', 'isMetier'], 'authenticated');
  }

  async model() {
    const targetProfile = this.modelFor('authenticated.target-profiles.target-profile');
    const badges = await targetProfile.hasMany('badges').reload();
    const stages = await targetProfile.hasMany('stages').reload();
    return {
      badges,
      stages,
      targetProfile,
    };
  }
}
