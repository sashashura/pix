// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Challenge'... Remove this comment to see the full error message
const Challenge = require('../../../../lib/domain/models/Challenge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../../../lib/domain/models/Skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Validator'... Remove this comment to see the full error message
const Validator = require('../../../../lib/domain/models/Validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQCM = require('../../../../lib/domain/models/ValidatorQCM');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQCU = require('../../../../lib/domain/models/ValidatorQCU');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQROC = require('../../../../lib/domain/models/ValidatorQROC');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQROCMDep = require('../../../../lib/domain/models/ValidatorQROCMDep');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQROCMInd = require('../../../../lib/domain/models/ValidatorQROCMInd');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Challenge', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should construct a model Challenge from attributes', function () {
      // given
      const challengeRawData = {
        id: 'recwWzTquPlvIl4So',
        type: 'QCM',
        instruction:
          "Les moteurs de recherche affichent certains liens en raison d'un accord commercial.\n\nDans quels encadrés se trouvent ces liens ?",
        proposals: '- 1\n- 2\n- 3\n- 4\n- 5',
        timer: 1234,
        illustrationUrl: 'https://dl.airtable.com/2MGErxGTQl2g2KiqlYgV_venise4.png',
        attachments: [
          'https://dl.airtable.com/nHWKNZZ7SQeOKsOvVykV_navigationdiaporama5.pptx',
          'https://dl.airtable.com/rsXNJrSPuepuJQDByFVA_navigationdiaporama5.odp',
        ],
        embedUrl: 'https://github.page.io/pages/mon-epreuve.html',
        embedTitle: 'Epreuve de selection d’imprimante',
        embedHeight: 400,
        status: 'validé',
        answer: [],
        skill: new Skill('recUDrCWD76fp5MsE'),
        validator: undefined,
        competenceId: 'recsvLz0W2ShyfD63',
        illustrationAlt: "Texte alternatif à l'image",
        format: 'phrase',
        locales: ['fr'],
        autoReply: true,
        alternativeInstruction: 'Pour aider les personnes ne pouvant voir ou afficher les instructions',
        focused: false,
        discriminant: 0.75,
        difficulty: -0.23,
        responsive: 'Smartphone',
        genealogy: 'Prototype 1',
      };

      // when
      const challengeDataObject = new Challenge(challengeRawData);

      // then
      expect(challengeDataObject).to.be.an.instanceof(Challenge);
      expect(challengeDataObject).to.deep.equal(challengeRawData);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('static#createValidatorForChallengeType', function () {
    const challengeTypeAndValidators = {
      QCM: ValidatorQCM,
      QCU: ValidatorQCU,
      QROC: ValidatorQROC,
      'QROCM-dep': ValidatorQROCMDep,
      'QROCM-ind': ValidatorQROCMInd,
      other: Validator,
    };

    // eslint-disable-next-line mocha/no-setup-in-describe
    Object.entries(challengeTypeAndValidators).forEach(([challengeType, associatedValidatorClass]) => {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context(`when challenge of type: ${challengeType} exists`, function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the associated validator class', function () {
          // when
          const solution = 'some solution';
          const validator = Challenge.createValidatorForChallengeType({ challengeType, solution });

          // then
          expect(validator).to.be.instanceOf(associatedValidatorClass);
          expect(validator.solution).to.equal(solution);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasIllustration', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when has illustration', function () {
      // given
      const challenge = domainBuilder.buildChallenge({ illustrationUrl: 'A_LINK' });

      // when then
      expect(challenge.hasIllustration()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when does not have illustration', function () {
      // given
      const challenge = domainBuilder.buildChallenge({ illustrationUrl: null });

      // when then
      expect(challenge.hasIllustration()).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasEmbed', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when has embed', function () {
      // given
      const challenge = domainBuilder.buildChallenge({ embedUrl: 'A_LINK' });

      // when then
      expect(challenge.hasEmbed()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when does not have embed', function () {
      // given
      const challenge = domainBuilder.buildChallenge({ embedUrl: null });

      // when then
      expect(challenge.hasEmbed()).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasAtLeastOneAttachment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when attachments is not empty', function () {
      // given
      const challenge = domainBuilder.buildChallenge({
        attachments: ['some/attachment/url'],
      });

      // when then
      expect(challenge.hasAtLeastOneAttachment()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when attachment is empty', function () {
      // given
      const challenge = domainBuilder.buildChallenge({
        attachments: [],
      });
      // when then
      expect(challenge.hasAtLeastOneAttachment()).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when attachment is not an array (null, undefined, ...)', function () {
      // given
      const challenge = domainBuilder.buildChallenge({
        attachments: 'not an array',
      });
      // when then
      expect(challenge.hasAtLeastOneAttachment()).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isFocused', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when focused is true', function () {
      // given
      const challenge = domainBuilder.buildChallenge({ focused: true });

      // when then
      expect(challenge.isFocused()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when focused is false', function () {
      // given
      const challenge = domainBuilder.buildChallenge({ focused: false });

      // when then
      expect(challenge.isFocused()).to.be.false;
    });
  });
});
