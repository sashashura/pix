// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certifiabl... Remove this comment to see the full error message
const certifiableProfileForLearningContentRepository = require('../../../../lib/infrastructure/repositories/certifiable-profile-for-learning-content-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certifiabl... Remove this comment to see the full error message
const CertifiableProfileForLearningContent = require('../../../../lib/domain/models/CertifiableProfileForLearningContent');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | certifiable-profile-for-learning-content', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return user profile', async function () {
      // given
      const skill1 = domainBuilder.buildTargetedSkill({
        id: 'skill1_id',
        name: 'skill1_name',
        tubeId: 'tube1_id',
      });
      const skill2 = domainBuilder.buildTargetedSkill({
        id: 'skill2_id',
        name: 'skill2_name',
        tubeId: 'tube1_id',
      });
      const tube = domainBuilder.buildTargetedTube({
        id: 'tube1_id',
        competenceId: 'competence1_id',
        skills: [skill1, skill2],
      });
      const competence = domainBuilder.buildTargetedCompetence({
        id: 'competence1_id',
        areaId: 'area1_id',
        tubes: [tube],
      });
      const area = domainBuilder.buildTargetedArea({
        id: 'area1_id',
        competences: [competence],
      });
      const targetProfileWithLearningContent = domainBuilder.buildTargetProfileWithLearningContent({
        skills: [skill1, skill2],
        tubes: [tube],
        competences: [competence],
        areas: [area],
      });

      const userId = databaseBuilder.factory.buildUser().id;
      const profileDate = new Date('2021-01-01');
      const answer1 = databaseBuilder.factory.buildAnswer({
        challengeId: 'challenge1',
      });
      const knowledgeElement1 = databaseBuilder.factory.buildKnowledgeElement({
        userId,
        createdAt: new Date('2020-01-01'),
        source: KnowledgeElement.SourceType.DIRECT,
        status: KnowledgeElement.StatusType.VALIDATED,
        earnedPix: 2,
        skillId: skill1.id,
        answerId: answer1.id,
      });
      const answer2 = databaseBuilder.factory.buildAnswer({
        challengeId: 'challenge2',
      });
      const knowledgeElement2 = databaseBuilder.factory.buildKnowledgeElement({
        userId,
        createdAt: new Date('2020-01-01'),
        source: KnowledgeElement.SourceType.INFERRED,
        status: KnowledgeElement.StatusType.INVALIDATED,
        earnedPix: 0,
        skillId: skill2.id,
        answerId: answer2.id,
      });
      const expectedCertifiableProfileForLearningContent = domainBuilder.buildCertifiableProfileForLearningContent({
        userId,
        profileDate,
        targetProfileWithLearningContent,
        knowledgeElements: [knowledgeElement1, knowledgeElement2],
        answerAndChallengeIdsByAnswerId: {
          [answer1.id]: { id: answer1.id, challengeId: 'challenge1' },
          [answer2.id]: { id: answer2.id, challengeId: 'challenge2' },
        },
      });
      await databaseBuilder.commit();

      // when
      const userProfile = await certifiableProfileForLearningContentRepository.get({
        id: userId,
        profileDate,
        targetProfileWithLearningContent,
      });

      // then
      expect(userProfile).to.be.instanceOf(CertifiableProfileForLearningContent);
      expect(userProfile).to.deep.equal(expectedCertifiableProfileForLearningContent);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should include user skill that are in the target profile only', async function () {
      // given
      const skill = domainBuilder.buildTargetedSkill({
        id: 'skill1_id',
        name: 'skill1_name',
        tubeId: 'tube1_id',
      });
      const tube = domainBuilder.buildTargetedTube({
        id: 'tube1_id',
        competenceId: 'competence1_id',
        skills: [skill],
      });
      const competence = domainBuilder.buildTargetedCompetence({
        id: 'competence1_id',
        areaId: 'area1_id',
        tubes: [tube],
      });
      const area = domainBuilder.buildTargetedArea({
        id: 'area1_id',
        competences: [competence],
      });
      const targetProfileWithLearningContent = domainBuilder.buildTargetProfileWithLearningContent({
        skills: [skill],
        tubes: [tube],
        competences: [competence],
        areas: [area],
      });

      const userId = databaseBuilder.factory.buildUser().id;
      const profileDate = new Date('2021-01-01');
      const answer1 = databaseBuilder.factory.buildAnswer({
        challengeId: 'challenge1',
      });
      const knowledgeElement1 = databaseBuilder.factory.buildKnowledgeElement({
        userId,
        createdAt: new Date('2020-01-01'),
        source: KnowledgeElement.SourceType.DIRECT,
        status: KnowledgeElement.StatusType.VALIDATED,
        earnedPix: 2,
        skillId: skill.id,
        answerId: answer1.id,
      });
      const answer2 = databaseBuilder.factory.buildAnswer({
        challengeId: 'challenge2',
      });
      databaseBuilder.factory.buildKnowledgeElement({
        userId,
        createdAt: new Date('2020-01-01'),
        source: KnowledgeElement.SourceType.INFERRED,
        status: KnowledgeElement.StatusType.INVALIDATED,
        earnedPix: 0,
        skillId: 'someOtherSkill',
        answerId: answer2.id,
      });
      const expectedCertifiableProfileForLearningContent = domainBuilder.buildCertifiableProfileForLearningContent({
        userId,
        profileDate,
        targetProfileWithLearningContent,
        knowledgeElements: [knowledgeElement1],
        answerAndChallengeIdsByAnswerId: { [answer1.id]: { id: answer1.id, challengeId: 'challenge1' } },
      });
      await databaseBuilder.commit();

      // when
      const userProfile = await certifiableProfileForLearningContentRepository.get({
        id: userId,
        profileDate,
        targetProfileWithLearningContent,
      });

      // then
      expect(userProfile).to.be.instanceOf(CertifiableProfileForLearningContent);
      expect(userProfile).to.deep.equal(expectedCertifiableProfileForLearningContent);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should include user skill that are within the profile date only', async function () {
      // given
      const skill1 = domainBuilder.buildTargetedSkill({
        id: 'skill1_id',
        name: 'skill1_name',
        tubeId: 'tube1_id',
      });
      const skill2 = domainBuilder.buildTargetedSkill({
        id: 'skill2_id',
        name: 'skill2_name',
        tubeId: 'tube1_id',
      });
      const tube = domainBuilder.buildTargetedTube({
        id: 'tube1_id',
        competenceId: 'competence1_id',
        skills: [skill1, skill2],
      });
      const competence = domainBuilder.buildTargetedCompetence({
        id: 'competence1_id',
        areaId: 'area1_id',
        tubes: [tube],
      });
      const area = domainBuilder.buildTargetedArea({
        id: 'area1_id',
        competences: [competence],
      });
      const targetProfileWithLearningContent = domainBuilder.buildTargetProfileWithLearningContent({
        skills: [skill1, skill2],
        tubes: [tube],
        competences: [competence],
        areas: [area],
      });

      const userId = databaseBuilder.factory.buildUser().id;
      const profileDate = new Date('2021-01-01');
      const answer1 = databaseBuilder.factory.buildAnswer({
        challengeId: 'challenge1',
      });
      const knowledgeElement1 = databaseBuilder.factory.buildKnowledgeElement({
        userId,
        createdAt: new Date('2020-01-01'),
        source: KnowledgeElement.SourceType.DIRECT,
        status: KnowledgeElement.StatusType.VALIDATED,
        earnedPix: 2,
        skillId: skill1.id,
        answerId: answer1.id,
      });
      const answer2 = databaseBuilder.factory.buildAnswer({
        challengeId: 'challenge2',
      });
      databaseBuilder.factory.buildKnowledgeElement({
        userId,
        createdAt: new Date('2022-01-01'),
        source: KnowledgeElement.SourceType.INFERRED,
        status: KnowledgeElement.StatusType.INVALIDATED,
        earnedPix: 0,
        skillId: skill2.id,
        answerId: answer2.id,
      });
      const expectedCertifiableProfileForLearningContent = domainBuilder.buildCertifiableProfileForLearningContent({
        userId,
        profileDate,
        targetProfileWithLearningContent,
        knowledgeElements: [knowledgeElement1],
        answerAndChallengeIdsByAnswerId: { [answer1.id]: { id: answer1.id, challengeId: 'challenge1' } },
      });
      await databaseBuilder.commit();

      // when
      const userProfile = await certifiableProfileForLearningContentRepository.get({
        id: userId,
        profileDate,
        targetProfileWithLearningContent,
      });

      // then
      expect(userProfile).to.be.instanceOf(CertifiableProfileForLearningContent);
      expect(userProfile).to.deep.equal(expectedCertifiableProfileForLearningContent);
    });
  });
});
