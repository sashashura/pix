// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const pickChallengeService = require('../../../../lib/domain/services/pick-challenge-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ENGLISH_SP... Remove this comment to see the full error message
const { ENGLISH_SPOKEN, FRENCH_FRANCE, FRENCH_SPOKEN } = require('../../../../lib/domain/constants').LOCALE;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | PickChallengeService', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#pickChallenge', function () {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const englishSpokenChallenge = domainBuilder.buildChallenge({ locales: [ENGLISH_SPOKEN] });
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const frenchSpokenChallenge = domainBuilder.buildChallenge({ locales: [FRENCH_SPOKEN] });
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const otherFrenchSpokenChallenge = domainBuilder.buildChallenge({ locales: [FRENCH_SPOKEN] });
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const frenchChallenge = domainBuilder.buildChallenge({ locales: [FRENCH_FRANCE] });
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const validatedChallenge = domainBuilder.buildChallenge({ status: 'validé' });
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const archivedChallenge = domainBuilder.buildChallenge({ status: 'archivé' });

    const randomSeed = 'some-random-seed';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when challenge in selected locale exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return challenge in selected locale', function () {
        // given
        const skills = [{ challenges: [frenchChallenge, frenchSpokenChallenge, englishSpokenChallenge] }];

        // when
        const challenge = pickChallengeService.pickChallenge({
          skills,
          randomSeed,
          locale: ENGLISH_SPOKEN,
        });

        // then
        expect(challenge).to.equal(englishSpokenChallenge);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should always return the same challenge in selected locale', function () {
        // given
        const skills = [{ challenges: [frenchChallenge, frenchSpokenChallenge, otherFrenchSpokenChallenge] }];

        // when
        const challenges = _.times(5, () =>
          pickChallengeService.pickChallenge({
            skills,
            randomSeed,
            locale: FRENCH_SPOKEN,
          })
        );

        // then
        expect(challenges).to.contains(frenchSpokenChallenge);
        expect(challenges).to.not.contains(otherFrenchSpokenChallenge);
        expect(challenges).to.not.contains(frenchChallenge);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no skills', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', function () {
        // given
        const skills: $TSFixMe = [];

        // when
        const challenge = pickChallengeService.pickChallenge({
          skills,
          randomSeed,
          locale: FRENCH_SPOKEN,
        });

        // then
        expect(challenge).to.be.null;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when skills have validated and archived challenges', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return validated challenge', function () {
        // given
        const skills = [{ challenges: [archivedChallenge, validatedChallenge] }];

        // when
        const challenge = pickChallengeService.pickChallenge({
          skills,
          randomSeed,
          locale: FRENCH_SPOKEN,
        });

        // then
        expect(challenge).to.equal(validatedChallenge);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when skills only have archived challenges', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return archived challenge', function () {
        // given
        const skills = [{ challenges: [archivedChallenge] }];

        // when
        const challenge = pickChallengeService.pickChallenge({
          skills,
          randomSeed,
          locale: FRENCH_SPOKEN,
        });

        // then
        expect(challenge).to.equal(archivedChallenge);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when picking a lot of challenges', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return all challenges propose', function () {
        // given
        const challengeOneForSkillOne = domainBuilder.buildChallenge();
        const challengeTwoForSkillOne = domainBuilder.buildChallenge();
        const challengeOneForSkillTwo = domainBuilder.buildChallenge();
        const challengeTwoForSkillTwo = domainBuilder.buildChallenge();
        const skillOne = { challenges: [challengeOneForSkillOne, challengeTwoForSkillOne] };
        const skillTwo = { challenges: [challengeOneForSkillTwo, challengeTwoForSkillTwo] };
        const skills = [skillOne, skillTwo];

        const challenges = _.times(50, (time: $TSFixMe) => pickChallengeService.pickChallenge({
          skills,
          randomSeed: time,
          locale: FRENCH_SPOKEN,
        })
        );

        // then
        expect(challenges).to.contains(challengeOneForSkillOne);
        expect(challenges).to.contains(challengeTwoForSkillOne);
        expect(challenges).to.contains(challengeOneForSkillTwo);
        expect(challenges).to.contains(challengeTwoForSkillTwo);
      });
    });
  });
});
