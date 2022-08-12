// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'datasource... Remove this comment to see the full error message
const datasource = require('./datasource');

const VALIDATED_CHALLENGE = 'validé';
const OPERATIVE_CHALLENGES = [VALIDATED_CHALLENGE, 'archivé'];
const PROTOTYPE_CHALLENGE = 'Prototype 1';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = datasource.extend({
  modelName: 'challenges',

  async findOperativeBySkillIds(skillIds: $TSFixMe) {
    const foundInSkillIds = (skillId: $TSFixMe) => _.includes(skillIds, skillId);
    const challenges = await this.findOperative();
    return challenges.filter((challengeData: $TSFixMe) => foundInSkillIds(challengeData.skillId));
  },

  async findValidatedByCompetenceId(competenceId: $TSFixMe) {
    const challenges = await this.findValidated();
    return challenges.filter(
      (challengeData: $TSFixMe) => !_.isEmpty(challengeData.skillId) && _.includes(challengeData.competenceId, competenceId)
    );
  },

  async findOperative() {
    const challenges = await this.list();
    return challenges.filter((challengeData: $TSFixMe) => _.includes(OPERATIVE_CHALLENGES, challengeData.status));
  },

  async findOperativeHavingLocale(locale: $TSFixMe) {
    const operativeChallenges = await this.findOperative();
    return operativeChallenges.filter((challenge: $TSFixMe) => _.includes(challenge.locales, locale));
  },

  async findValidated() {
    const challenges = await this.list();
    return challenges.filter((challengeData: $TSFixMe) => challengeData.status === VALIDATED_CHALLENGE);
  },

  async findValidatedBySkillId(id: $TSFixMe) {
    const validatedChallenges = await this.findValidated();
    return validatedChallenges.filter((challenge: $TSFixMe) => challenge.skillId === id);
  },

  async findValidatedPrototype() {
    const validatedChallenges = await this.findValidated();
    return validatedChallenges.filter((challenge: $TSFixMe) => challenge.genealogy === PROTOTYPE_CHALLENGE);
  },

  async findFlashCompatible(locale: $TSFixMe) {
    const challenges = await this.list();
    return challenges.filter(
      (challengeData: $TSFixMe) => challengeData.status === VALIDATED_CHALLENGE &&
      challengeData.skillId &&
      _.includes(challengeData.locales, locale) &&
      challengeData.alpha != null &&
      challengeData.delta != null
    );
  },
});
