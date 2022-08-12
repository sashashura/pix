// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../domain/models/Skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(skillData: $TSFixMe) {
  return new Skill({
    id: skillData.id,
    name: skillData.name,
    pixValue: skillData.pixValue,
    competenceId: skillData.competenceId,
    tutorialIds: skillData.tutorialIds,
    tubeId: skillData.tubeId,
    version: skillData.version,
    level: skillData.level,
    learningMoreTutorialIds: skillData.learningMoreTutorialIds,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: $TSFixMe) {
    try {
      return _toDomain(await skillDatasource.get(id));
    } catch (e) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError('Erreur, compétence introuvable');
    }
  },

  async list() {
    const skillDatas = await skillDatasource.list();
    return skillDatas.map(_toDomain);
  },

  async findActiveByTubeId(tubeId: $TSFixMe) {
    const skillDatas = await skillDatasource.findActiveByTubeId(tubeId);
    return skillDatas.map(_toDomain);
  },

  async findActiveByCompetenceId(competenceId: $TSFixMe) {
    const skillDatas = await skillDatasource.findActiveByCompetenceId(competenceId);
    return skillDatas.map(_toDomain);
  },

  async findOperativeByCompetenceId(competenceId: $TSFixMe) {
    const skillDatas = await skillDatasource.findOperativeByCompetenceId(competenceId);
    return skillDatas.map(_toDomain);
  },

  async findOperativeByIds(skillIds: $TSFixMe) {
    const skillDatas = await skillDatasource.findOperativeByRecordIds(skillIds);
    return skillDatas.map(_toDomain);
  },
};
