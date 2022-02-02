const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert").strict;
const { mockLearningContent,  domainBuilder, databaseBuilder } = require('../../test-helper');
const usecases = require('../../../lib/domain/usecases');
const DomainTransaction = require('../../infrastructure/DomainTransaction');
const assessmentRepository = require('../../infrastructure/repositories/assessment-repository');
const _ = require('lodash');

Given("/^le référentiel suivant$/", function (table) {
  const learningContent = {
    areas: [],
    competences: [],
    tubes: [],
    skills: [],
    challenge: [],
  }
  table.rows().forEach((row) =>  {
    const [areaId, competenceId, tubeId,  skillId] = row;
    learningContent.areas.push(domainBuilder.buildArea({ id: areaId }));
    learningContent.competences.push(domainBuilder.buildCompetence({ id: competenceId, areaId }));
    learningContent.tube.push(domainBuilder.buildTube({ id: tubeId, competenceId }));

    const skill = domainBuilder.buildSkill({ id: skillId });
    learningContent.skills.push(domainBuilder.buildSkill({ id: skillId }));

    learningContent.challenge.push(domainBuilder.buildChallenge({ skills:[skill], competenceId, solution: 1 }));
  });

  mockLearningContent(learningContent);
});

Given("/^il y a une campagne d'évaluation pour les acquis$/", async function (table) {
  const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile();
  table.rows().forEach(([skillId]) => {
    databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId });
  });
  const { id: campaignId } = databaseBuilder.factory.buildCampaign({ type: 'ASSESSMENT', idPixLabel: null });
  await  databaseBuilder.commit();
  this.campaignId = campaignId;
});

Given("je participe à la campagne", async function (number) {
  const { campaignParticipation }  = await DomainTransaction.execute(
    async (domainTransaction) => {
      await usecases.startCampaignParticipation({
        campaignParticipation: {
          campaignId: this.campaignId,
        },
        userId,
        domainTransaction
      })
    });

  this.assessmentId = campaignParticipation.assessmentId;
});

When("je répond correctement aux questions sur les acquis", async function (table) {
  const assessment = await assessmentRepository.get(this.assessmentId);

  let challenge = await usecases.getNextChallengeForCampaignAssessment({ assessment });

  while(challenge) {
    console.log('answer challenge', challengeSkillIds);
    const challengeSkillIds = challenge.skills.map(({ id }) =>  id);
    const value = _.intersection(table.rows(),challengeSkillIds) ? 1 : 0;
    const answer = domainBuilder.buildAnswer({
      assessmentId: this.assessmentId,
      challengeId: challenge.id,
      value,
    });

    await usecases.correctAnswerThenUpdateAssessment({ answer, userId: this.userId });
    challenge = await usecases.getNextChallengeForCampaignAssessment({ assessment });
  }
});

Then("/^je maitrise { int }% des acquis de la campagne$/", async function (value) {
    const results = await usecases.getUserCampaignAssessmentResult({
      userId: this.userId,
      campaignId: this.campaignId,
    });

    assert.equal(results.masteryRate, value);
});
