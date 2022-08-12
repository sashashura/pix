// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'hashInt'.
const hashInt = require('hash-int');
const NON_EXISTING_ITEM = null;
const VALIDATED_STATUS = 'validé';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  pickChallenge({
    skills,
    randomSeed,
    locale
  }: $TSFixMe) {
    if (skills.length === 0) {
      return NON_EXISTING_ITEM;
    }
    const keyForSkill = Math.abs(hashInt(randomSeed));
    const keyForChallenge = Math.abs(hashInt(randomSeed + 1));
    const chosenSkill = skills[keyForSkill % skills.length];

    return _pickLocaleChallengeAtIndex(chosenSkill.challenges, locale, keyForChallenge);
  },
};

function _pickLocaleChallengeAtIndex(challenges: $TSFixMe, locale: $TSFixMe, index: $TSFixMe) {
  const localeChallenges = _.filter(challenges, (challenge: $TSFixMe) => _.includes(challenge.locales, locale));
  const possibleChallenges = _findPreferablyValidatedChallenges(localeChallenges);
  return _.isEmpty(possibleChallenges) ? null : _pickChallengeAtIndex(possibleChallenges, index);
}

function _pickChallengeAtIndex(challenges: $TSFixMe, index: $TSFixMe) {
  return challenges[index % challenges.length];
}

function _findPreferablyValidatedChallenges(localeChallenges: $TSFixMe) {
  const validatedChallenges = _.filter(localeChallenges, (challenge: $TSFixMe) => challenge.status === VALIDATED_STATUS);
  return validatedChallenges.length > 0 ? validatedChallenges : localeChallenges;
}
