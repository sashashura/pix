// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TARGET_PRO... Remove this comment to see the full error message
const { TARGET_PROFILE_STAGES_BADGES_ID, TARGET_PROFILE_ONE_COMPETENCE_ID } = require('./target-profiles-builder');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function stagesBuilder({
  databaseBuilder
}: $TSFixMe) {
  _buildStagesForTargetProfileId(databaseBuilder, TARGET_PROFILE_ONE_COMPETENCE_ID);
  _buildStagesForTargetProfileId(databaseBuilder, TARGET_PROFILE_STAGES_BADGES_ID);
};

function _buildStagesForTargetProfileId(databaseBuilder: $TSFixMe, targetProfileId: $TSFixMe) {
  const stages = [
    { title: 'Bravo !', message: 'Tu as le palier 1', threshold: 0, targetProfileId },
    { title: 'Félicitations !', message: 'Tu as le palier 2', prescriberTitle: 'palier 2', prescriberDescription: 'Maîtrise partielle', threshold: 5, targetProfileId },
    { title: 'Bien joué !', message: 'Tu as le palier 3', prescriberTitle: 'palier 3', prescriberDescription: 'Maîtrise complète', threshold: 15, targetProfileId },
    { title: 'Trop fort(e) !', message: 'Tu as le palier 4', prescriberTitle: 'palier 4', threshold: 60, targetProfileId },
    { title: 'Quel(le) expert(e) !', message: 'Tu as le palier 5', prescriberDescription: 'Maîtrise absolue', threshold: 80, targetProfileId },
  ];

  stages.forEach((stage) => databaseBuilder.factory.buildStage(stage));
}
