// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'datasource... Remove this comment to see the full error message
const datasource = require('./datasource');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ACTIVE_STA... Remove this comment to see the full error message
const ACTIVE_STATUS = 'actif';
const OPERATIVE_STATUSES = ['actif', 'archivé'];

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = datasource.extend({
  modelName: 'skills',

  async findActive() {
    const skills = await this.list();
    return _.filter(skills, { status: ACTIVE_STATUS });
  },

  async findOperative() {
    const skills = await this.list();
    return _.filter(skills, (skill: $TSFixMe) => _.includes(OPERATIVE_STATUSES, skill.status));
  },

  async findByRecordIds(skillIds: $TSFixMe) {
    const skills = await this.list();
    return skills.filter((skillData: $TSFixMe) => _.includes(skillIds, skillData.id));
  },

  async findOperativeByRecordIds(skillIds: $TSFixMe) {
    const skills = await this.list();
    return skills.filter(
      (skillData: $TSFixMe) => _.includes(OPERATIVE_STATUSES, skillData.status) && _.includes(skillIds, skillData.id)
    );
  },

  async findActiveByTubeId(tubeId: $TSFixMe) {
    const skills = await this.list();
    return _.filter(skills, { status: ACTIVE_STATUS, tubeId });
  },

  async findActiveByCompetenceId(competenceId: $TSFixMe) {
    const skills = await this.list();
    return _.filter(skills, { status: ACTIVE_STATUS, competenceId });
  },

  async findOperativeByCompetenceId(competenceId: $TSFixMe) {
    const skills = await this.list();
    return _.filter(
      skills,
      (skill: $TSFixMe) => skill.competenceId === competenceId && _.includes(OPERATIVE_STATUSES, skill.status)
    );
  },
});
