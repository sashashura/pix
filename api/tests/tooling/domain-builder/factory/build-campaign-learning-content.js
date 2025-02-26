const CampaignLearningContent = require('../../../../lib/domain/models/CampaignLearningContent');
const buildLearningContent = require('./build-learning-content');

function buildCampaignLearningContent(learningContent = buildLearningContent()) {
  return new CampaignLearningContent(learningContent);
}

buildCampaignLearningContent.fromAreas = (areas) => {
  const learningContent = buildLearningContent(areas);
  return buildCampaignLearningContent(learningContent);
};

buildCampaignLearningContent.withSimpleContent = () => {
  const simpleLearningContent = buildLearningContent.withSimpleContent();
  return buildCampaignLearningContent(simpleLearningContent);
};

module.exports = buildCampaignLearningContent;
