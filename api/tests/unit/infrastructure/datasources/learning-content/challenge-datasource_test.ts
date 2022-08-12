// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../../../../lib/infrastructure/lcms');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeD... Remove this comment to see the full error message
const challengeDatasource = require('../../../../../lib/infrastructure/datasources/learning-content/challenge-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../../../../../lib/infrastructure/caches/learning-content-cache');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Datasource | Learning Content | ChallengeDatasource', function () {
  let competence1: $TSFixMe,
    competence2,
    web1,
    web2,
    web3,
    challenge_competence1: $TSFixMe,
    challenge_competence1_noSkills: $TSFixMe,
    challenge_competence1_notValidated: $TSFixMe,
    challenge_competence2: $TSFixMe,
    challenge_web1: $TSFixMe,
    challenge_web1_notValidated: $TSFixMe,
    challenge_web1_archived: $TSFixMe,
    challenge_web2_en: $TSFixMe,
    challenge_web3: $TSFixMe,
    challenge_web3_archived: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    competence1 = { id: 'competence1' };
    competence2 = { id: 'competence2' };
    web1 = { id: 'skill-web1' };
    web2 = { id: 'skill-web2' };
    web3 = { id: 'skill-web3' };
    challenge_competence1 = {
      id: 'challenge-competence1',
      competenceId: competence1.id,
      skillId: web1.id,
      status: 'validé',
      locales: ['fr', 'fr-fr'],
      alpha: 2.11,
      delta: -3.56,
      genealogy: 'Declinaison 1',
    };
    challenge_competence1_noSkills = {
      id: 'challenge-competence1-noSkills',
      competenceId: competence1.id,
      skillId: undefined,
      status: 'validé',
      locales: ['fr', 'fr-fr'],
      alpha: 8.11,
      delta: 0.95,
      genealogy: 'Declinaison 1',
    };
    challenge_competence1_notValidated = {
      id: 'challenge-competence1-notValidated',
      competenceId: competence1.id,
      skillId: web1.id,
      locales: ['fr', 'fr-fr'],
      status: 'proposé',
      alpha: -0,
      delta: 0,
      genealogy: 'Prototype 1',
    };
    challenge_competence2 = {
      id: 'challenge-competence2',
      competenceId: competence2.id,
      skillId: web1.id,
      status: 'validé',
      locales: ['fr', 'fr-fr'],
      alpha: 8.21,
      delta: -4.23,
      genealogy: 'Declinaison 1',
    };
    challenge_web1 = {
      id: 'challenge-web1',
      skillId: web1.id,
      locales: ['fr', 'fr-fr'],
      status: 'validé',
      genealogy: 'Prototype 1',
    };
    challenge_web1_notValidated = {
      id: 'challenge-web1-notValidated',
      skillId: web1.id,
      status: 'proposé',
      locales: ['fr', 'fr-fr'],
      alpha: -1.9,
      delta: 2.34,
      genealogy: 'Declinaison 1',
    };
    challenge_web1_archived = {
      id: 'challenge_web1_archived',
      skillId: web1.id,
      status: 'archivé',
      locales: ['fr', 'fr-fr'],
      alpha: -1.9,
      delta: 2.34,
      genealogy: 'Declinaison 1',
    };
    challenge_web2_en = {
      id: 'challenge-web2',
      skillId: web2.id,
      locales: ['en'],
      status: 'validé',
      alpha: 1,
      delta: -2,
      genealogy: 'Declinaison 1',
    };
    challenge_web3 = {
      id: 'challenge-web3',
      skillId: web3.id,
      status: 'validé',
      locales: ['fr', 'fr-fr'],
      alpha: 1.83,
      delta: 0.27,
      genealogy: 'Declinaison 1',
    };
    challenge_web3_archived = {
      id: 'challenge-web3-archived',
      skillId: web3.id,
      status: 'archivé',
      locales: ['fr-fr'],
      alpha: -8.1,
      delta: 0,
      genealogy: 'Declinaison 1',
    };

    sinon.stub(cache, 'get').callsFake((generator: $TSFixMe) => generator());
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOperativeBySkillIds', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon
        .stub(lcms, 'getLatestRelease')
        .resolves({ challenges: [challenge_web1, challenge_web1_notValidated, challenge_web2_en, challenge_web3] });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve an array of matching Challenges from learning content', async function () {
      // given
      const skillIds = ['skill-web1', 'skill-web2'];

      // when
      const result = await challengeDatasource.findOperativeBySkillIds(skillIds);

      // then
      expect(lcms.getLatestRelease).to.have.been.called;
      expect(_.map(result, 'id')).to.deep.equal(['challenge-web1', 'challenge-web2']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findValidatedByCompetenceId', function () {
    let result: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      sinon.stub(lcms, 'getLatestRelease').resolves({
        challenges: [
          challenge_competence1,
          challenge_competence1_noSkills,
          challenge_competence1_notValidated,
          challenge_competence2,
        ],
      });

      // when
      result = await challengeDatasource.findValidatedByCompetenceId(competence1.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve to an array of matching Challenges from learning content', function () {
      // then
      expect(lcms.getLatestRelease).to.have.been.called;
      expect(_.map(result, 'id')).to.deep.equal(['challenge-competence1']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOperative', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(lcms, 'getLatestRelease').resolves({
        challenges: [challenge_web1, challenge_web1_notValidated, challenge_web2_en, challenge_web3_archived],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve an array of matching Challenges from learning content', async function () {
      // when
      const result = await challengeDatasource.findOperative();

      // then
      expect(lcms.getLatestRelease).to.have.been.called;
      expect(_.map(result, 'id')).to.deep.equal(['challenge-web1', 'challenge-web2', 'challenge-web3-archived']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOperativeHavingLocale', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve the operative Challenges of given locale only', async function () {
      // given
      const locale = 'fr-fr';
      sinon.stub(lcms, 'getLatestRelease').resolves({
        challenges: [challenge_web1, challenge_web1_notValidated, challenge_web2_en, challenge_web3_archived],
      });

      // when
      const result = await challengeDatasource.findOperativeHavingLocale(locale);

      // then
      expect(_.map(result, 'id')).to.deep.equal(['challenge-web1', 'challenge-web3-archived']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findValidated', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(lcms, 'getLatestRelease').resolves({
        challenges: [challenge_web1, challenge_web1_notValidated, challenge_web2_en, challenge_web3_archived],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve an array of matching Challenges from learning content', async function () {
      // when
      const result = await challengeDatasource.findValidated();

      // then
      expect(lcms.getLatestRelease).to.have.been.called;
      expect(_.map(result, 'id')).to.deep.equal(['challenge-web1', 'challenge-web2']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findFlashCompatible', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(lcms, 'getLatestRelease').resolves({
        challenges: [
          challenge_competence1,
          challenge_competence1_noSkills,
          challenge_competence2,
          challenge_web1,
          challenge_web1_notValidated,
          challenge_web2_en,
          challenge_web3,
          challenge_web3_archived,
        ],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve an array of matching Challenges from learning content', async function () {
      // when
      const locale = 'fr-fr';
      const result = await challengeDatasource.findFlashCompatible(locale);

      // then
      expect(lcms.getLatestRelease).to.have.been.called;
      expect(_.map(result, 'id')).to.deep.equal(['challenge-competence1', 'challenge-competence2', 'challenge-web3']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findValidatedBySkillId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(lcms, 'getLatestRelease').resolves({
        challenges: [challenge_web1, challenge_web1_notValidated, challenge_web1_archived, challenge_competence2],
      });
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve an array of validated challenge of a skill from learning content ', async function () {
      // when
      const result = await challengeDatasource.findValidatedBySkillId('skill-web1');

      // then
      expect(lcms.getLatestRelease).to.have.been.called;
      expect(result).to.deep.equal([challenge_web1, challenge_competence2]);
    });
  });
});
