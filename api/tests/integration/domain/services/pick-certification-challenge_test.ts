// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'placementP... Remove this comment to see the full error message
const placementProfileService = require('../../../../lib/domain/services/placement-profile-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationChallengesService = require('../../../../lib/domain/services/certification-challenges-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_COUNT_... Remove this comment to see the full error message
const { PIX_COUNT_BY_LEVEL } = require('../../../../lib/domain/constants');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | CertificationChallengeService | pickCertificationChallenge', function () {
  const placementDate = new Date('2020-01-01T00:00:00Z');
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const certificationDate = _addOneDayToDate(placementDate);
  const sufficientPixValueToBeCertifiableOnCompetence = PIX_COUNT_BY_LEVEL;
  const unsufficientPixValueToBeCertifiableOnCompetence = 1;
  const locale = 'fr-fr';
  let certifiableUserId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certifiableUserId = databaseBuilder.factory.buildUser().id;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('picks only operative challenges', async function () {
    // given
    const learningContent = {
      areas: [{ id: 'recArea1', competenceIds: ['recArea1_Competence1'] }],
      competences: [
        {
          id: 'recArea1_Competence1',
          areaId: 'recArea1',
          skillIds: ['recArea1_Competence1_Tube1_Skill1', 'recArea1_Competence1_Tube1_Skill2'],
          origin: 'Pix',
        },
      ],
      tubes: [
        {
          id: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
      ],
      skills: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1',
          name: '@recArea1_Competence1_Tube1_Skill1',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill2',
          name: '@recArea1_Competence1_Tube1_Skill2',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
      ],
      challenges: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
          skillId: 'recArea1_Competence1_Tube1_Skill1',
          competenceId: 'recArea1_Competence1',
          status: '', // unoperative
          locales: ['fr-fr'],
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill2_Challenge1',
          skillId: 'recArea1_Competence1_Tube1_Skill2',
          status: 'validé', // operative
          competenceId: 'recArea1_Competence1',
          locales: ['fr-fr'],
        },
      ],
    };

    mockLearningContent(learningContent);

    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill1',
      challengeId: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill2',
      challengeId: 'recArea1_Competence1_Tube1_Skill2_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    const placementProfile = await placementProfileService.getPlacementProfile({
      userId: certifiableUserId,
      limitDate: certificationDate,
    });

    // when
    const challenges = await certificationChallengesService.pickCertificationChallenges(placementProfile, locale);

    //then
    expect(challenges.map((challenge: $TSFixMe) => challenge.challengeId)).to.deep.equal([
      'recArea1_Competence1_Tube1_Skill2_Challenge1',
    ]);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('picks only fr-fr challenges', async function () {
    // given
    const learningContent = {
      areas: [{ id: 'recArea1', competenceIds: ['recArea1_Competence1'] }],
      competences: [
        {
          id: 'recArea1_Competence1',
          areaId: 'recArea1',
          skillIds: ['recArea1_Competence1_Tube1_Skill1', 'recArea1_Competence1_Tube1_Skill2'],
          origin: 'Pix',
        },
      ],
      tubes: [
        {
          id: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
      ],
      skills: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1',
          name: '@recArea1_Competence1_Tube1_Skill1',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill2',
          name: '@recArea1_Competence1_Tube1_Skill2',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
      ],
      challenges: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
          skillId: 'recArea1_Competence1_Tube1_Skill1',
          competenceId: 'recArea1_Competence1',
          status: 'validé',
          locales: ['fr', 'en'],
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill2_Challenge1',
          skillId: 'recArea1_Competence1_Tube1_Skill2',
          status: 'validé',
          competenceId: 'recArea1_Competence1',
          locales: ['fr-fr'],
        },
      ],
    };

    mockLearningContent(learningContent);

    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill1',
      challengeId: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill2',
      challengeId: 'recArea1_Competence1_Tube1_Skill2_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    await databaseBuilder.commit();
    const placementProfile = await placementProfileService.getPlacementProfile({
      userId: certifiableUserId,
      limitDate: certificationDate,
    });

    // when
    const challenges = await certificationChallengesService.pickCertificationChallenges(placementProfile, locale);

    //then
    expect(challenges.map((challenge: $TSFixMe) => challenge.challengeId)).to.deep.equal([
      'recArea1_Competence1_Tube1_Skill2_Challenge1',
    ]);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('picks challenges on certifiable competences only', async function () {
    // given
    const learningContent = {
      areas: [{ id: 'recArea1', competenceIds: ['recArea1_Competence1', 'recArea1_Competence2'] }],
      competences: [
        {
          id: 'recArea1_Competence1',
          areaId: 'recArea1',
          skillIds: ['recArea1_Competence1_Tube1_Skill1'],
          origin: 'Pix',
        },
        {
          id: 'recArea1_Competence2',
          areaId: 'recArea1',
          skillIds: ['recArea1_Competence2_Tube1_Skill1'],
          origin: 'Pix',
        },
      ],
      tubes: [
        {
          id: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
        {
          id: 'recArea1_Competence2_Tube1',
          competenceId: 'recArea1_Competence2',
        },
      ],
      skills: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1',
          name: '@recArea1_Competence1_Tube1_Skill1',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
        {
          id: 'recArea1_Competence2_Tube1_Skill1',
          name: '@recArea1_Competence2_Tube1_Skill1',
          status: 'actif',
          tubeId: 'recArea1_Competence2_Tube1',
          competenceId: 'recArea1_Competence2',
        },
      ],
      challenges: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
          skillId: 'recArea1_Competence1_Tube1_Skill1',
          competenceId: 'recArea1_Competence1',
          status: 'validé',
          locales: ['fr-fr'],
        },
        {
          id: 'recArea1_Competence2_Tube1_Skill1_Challenge1',
          skillId: 'recArea1_Competence2_Tube1_Skill1',
          status: 'validé',
          competenceId: 'recArea1_Competence2',
          locales: ['fr-fr'],
        },
      ],
    };

    mockLearningContent(learningContent);

    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill1',
      challengeId: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
      pixValue: unsufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence2',
      skillId: 'recArea1_Competence2_Tube1_Skill1',
      challengeId: 'recArea1_Competence2_Tube1_Skill1_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    const placementProfile = await placementProfileService.getPlacementProfile({
      userId: certifiableUserId,
      limitDate: certificationDate,
    });

    // when
    const challenges = await certificationChallengesService.pickCertificationChallenges(placementProfile, locale);

    //then
    expect(challenges.map((challenge: $TSFixMe) => challenge.challengeId)).to.deep.equal([
      'recArea1_Competence2_Tube1_Skill1_Challenge1',
    ]);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('picks challenges on Pix competences only', async function () {
    // given
    const learningContent = {
      areas: [{ id: 'recArea1', competenceIds: ['recArea1_Competence1', 'recArea1_Competence2'] }],
      competences: [
        {
          id: 'recArea1_Competence1',
          areaId: 'recArea1',
          skillIds: ['recArea1_Competence1_Tube1_Skill1'],
          origin: 'Pix+', // Non-pix
        },
        {
          id: 'recArea1_Competence2',
          areaId: 'recArea1',
          skillIds: ['recArea1_Competence2_Tube1_Skill1'],
          origin: 'Pix',
        },
      ],
      tubes: [
        {
          id: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
        {
          id: 'recArea1_Competence2_Tube1',
          competenceId: 'recArea1_Competence2',
        },
      ],
      skills: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1',
          name: '@recArea1_Competence1_Tube1_Skill1',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
        {
          id: 'recArea1_Competence2_Tube1_Skill1',
          name: '@recArea1_Competence2_Tube1_Skill1',
          status: 'actif',
          tubeId: 'recArea1_Competence2_Tube1',
          competenceId: 'recArea1_Competence2',
        },
      ],
      challenges: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
          skillId: 'recArea1_Competence1_Tube1_Skill1',
          competenceId: 'recArea1_Competence1',
          status: 'validé',
          locales: ['fr-fr'],
        },
        {
          id: 'recArea1_Competence2_Tube1_Skill1_Challenge1',
          skillId: 'recArea1_Competence2_Tube1_Skill1',
          status: 'validé',
          competenceId: 'recArea1_Competence2',
          locales: ['fr-fr'],
        },
      ],
    };

    mockLearningContent(learningContent);

    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill1',
      challengeId: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence2',
      skillId: 'recArea1_Competence2_Tube1_Skill1',
      challengeId: 'recArea1_Competence2_Tube1_Skill1_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    const placementProfile = await placementProfileService.getPlacementProfile({
      userId: certifiableUserId,
      limitDate: certificationDate,
    });

    // when
    const challenges = await certificationChallengesService.pickCertificationChallenges(placementProfile, locale);

    //then
    expect(challenges.map((challenge: $TSFixMe) => challenge.challengeId)).to.deep.equal([
      'recArea1_Competence2_Tube1_Skill1_Challenge1',
    ]);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('picks one skill-related challenge, starting by unanswered challenges first', async function () {
    // given
    const learningContent = {
      areas: [{ id: 'recArea1', competenceIds: ['recArea1_Competence1'] }],
      competences: [
        {
          id: 'recArea1_Competence1',
          areaId: 'recArea1',
          skillIds: ['recArea1_Competence1_Tube1_Skill1'],
          origin: 'Pix',
        },
      ],
      tubes: [
        {
          id: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
      ],
      skills: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1',
          name: '@recArea1_Competence1_Tube1_Skill1',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
      ],
      challenges: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
          skillId: 'recArea1_Competence1_Tube1_Skill1',
          competenceId: 'recArea1_Competence1',
          status: 'validé',
          locales: ['fr-fr'],
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill1_Challenge2',
          skillId: 'recArea1_Competence1_Tube1_Skill1',
          status: 'validé',
          competenceId: 'recArea1_Competence1',
          locales: ['fr-fr'],
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill1_Challenge3',
          skillId: 'recArea1_Competence1_Tube1_Skill1',
          status: 'validé',
          competenceId: 'recArea1_Competence1',
          locales: ['fr-fr'],
        },
      ],
    };

    mockLearningContent(learningContent);

    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill1',
      challengeId: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    const placementProfile = await placementProfileService.getPlacementProfile({
      userId: certifiableUserId,
      limitDate: certificationDate,
    });

    // when
    const challenges = await certificationChallengesService.pickCertificationChallenges(placementProfile, locale);
    expect(challenges.length).to.equal(1);
    expect(challenges[0].challengeId).to.be.oneOf([
      'recArea1_Competence1_Tube1_Skill1_Challenge2',
      'recArea1_Competence1_Tube1_Skill1_Challenge3',
    ]);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('picks one skill-related challenge, falling back on already answered challenges if no unanswered one is available', async function () {
    // given
    const learningContent = {
      areas: [{ id: 'recArea1', competenceIds: ['recArea1_Competence1'] }],
      competences: [
        {
          id: 'recArea1_Competence1',
          areaId: 'recArea1',
          skillIds: ['recArea1_Competence1_Tube1_Skill1'],
          origin: 'Pix',
        },
      ],
      tubes: [
        {
          id: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
      ],
      skills: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1',
          name: '@recArea1_Competence1_Tube1_Skill1',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
      ],
      challenges: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
          skillId: 'recArea1_Competence1_Tube1_Skill1',
          competenceId: 'recArea1_Competence1',
          status: 'validé',
          locales: ['fr-fr'],
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill1_Challenge2',
          skillId: 'recArea1_Competence1_Tube1_Skill1',
          status: 'validé',
          competenceId: 'recArea1_Competence1',
          locales: ['fr-fr'],
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill1_Challenge3',
          skillId: 'recArea1_Competence1_Tube1_Skill1',
          status: 'validé',
          competenceId: 'recArea1_Competence1',
          locales: ['fr-fr'],
        },
      ],
    };

    mockLearningContent(learningContent);

    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill1',
      challengeId: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill2',
      challengeId: 'recArea1_Competence1_Tube1_Skill1_Challenge2',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill3',
      challengeId: 'recArea1_Competence1_Tube1_Skill1_Challenge3',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });

    const placementProfile = await placementProfileService.getPlacementProfile({
      userId: certifiableUserId,
      limitDate: certificationDate,
    });

    // when
    const challenges = await certificationChallengesService.pickCertificationChallenges(placementProfile, locale);
    expect(challenges.length).to.equal(1);
    expect([
      'recArea1_Competence1_Tube1_Skill1_Challenge1',
      'recArea1_Competence1_Tube1_Skill1_Challenge2',
      'recArea1_Competence1_Tube1_Skill1_Challenge3',
    ]).to.include(challenges[0].challengeId);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('picks one challenge by skill to a maximum of 3 challenges by competence starting by most difficult skills', async function () {
    // given
    const learningContent = {
      areas: [{ id: 'recArea1', competenceIds: ['recArea1_Competence1'] }],
      competences: [
        {
          id: 'recArea1_Competence1',
          areaId: 'recArea1',
          skillIds: ['recArea1_Competence1_Tube1_Skill1'],
          origin: 'Pix',
        },
      ],
      tubes: [
        {
          id: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
      ],
      skills: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1',
          name: '@recArea1_Competence1_Tube1_Skill1',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill2',
          name: '@recArea1_Competence1_Tube1_Skill2',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill3',
          name: '@recArea1_Competence1_Tube1_Skill3',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill4',
          name: '@recArea1_Competence1_Tube1_Skill4',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
        },
      ],
      challenges: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
          skillId: 'recArea1_Competence1_Tube1_Skill1',
          competenceId: 'recArea1_Competence1',
          status: 'validé',
          locales: ['fr-fr'],
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill2_Challenge1',
          skillId: 'recArea1_Competence1_Tube1_Skill2',
          status: 'validé',
          competenceId: 'recArea1_Competence1',
          locales: ['fr-fr'],
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill3_Challenge1',
          skillId: 'recArea1_Competence1_Tube1_Skill3',
          status: 'validé',
          competenceId: 'recArea1_Competence1',
          locales: ['fr-fr'],
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill4_Challenge1',
          skillId: 'recArea1_Competence1_Tube1_Skill4',
          status: 'validé',
          competenceId: 'recArea1_Competence1',
          locales: ['fr-fr'],
        },
      ],
    };

    mockLearningContent(learningContent);

    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill1',
      challengeId: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill2',
      challengeId: 'recArea1_Competence1_Tube1_Skill2_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill3',
      challengeId: 'recArea1_Competence1_Tube1_Skill3_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    await _buildCorrectAnswerAndKnowledgeElement({
      userId: certifiableUserId,
      competenceId: 'recArea1_Competence1',
      skillId: 'recArea1_Competence1_Tube1_Skill4',
      challengeId: 'recArea1_Competence1_Tube1_Skill4_Challenge1',
      pixValue: sufficientPixValueToBeCertifiableOnCompetence,
      acquisitionDate: placementDate,
    });
    await databaseBuilder.commit();
    const placementProfile = await placementProfileService.getPlacementProfile({
      userId: certifiableUserId,
      limitDate: certificationDate,
    });

    // when
    const challenges = await certificationChallengesService.pickCertificationChallenges(placementProfile, locale);
    expect(challenges.length).to.equal(3);
    expect(challenges.map((challenge: $TSFixMe) => challenge.challengeId)).to.deep.equal([
      'recArea1_Competence1_Tube1_Skill4_Challenge1',
      'recArea1_Competence1_Tube1_Skill3_Challenge1',
      'recArea1_Competence1_Tube1_Skill2_Challenge1',
    ]);
  });
});

async function _buildCorrectAnswerAndKnowledgeElement({
  userId,
  competenceId,
  challengeId,
  pixValue,
  acquisitionDate,
  skillId
}: $TSFixMe) {
  const assessmentId = databaseBuilder.factory.buildAssessment({ userId }).id;
  const answerId = databaseBuilder.factory.buildAnswer({
    assessmentId,
    challengeId,
  }).id;
  databaseBuilder.factory.buildKnowledgeElement({
    userId,
    assessmentId,
    earnedPix: pixValue,
    competenceId,
    answerId,
    createdAt: acquisitionDate,
    skillId,
  });
  await databaseBuilder.commit();
}

function _addOneDayToDate(date: $TSFixMe) {
  return moment(date).add(1, 'day').toDate();
}
