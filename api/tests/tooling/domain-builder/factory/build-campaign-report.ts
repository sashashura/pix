// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignRe... Remove this comment to see the full error message
const CampaignReport = require('../../../../lib/domain/read-models/CampaignReport');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCampaignReport({
  id = 1,
  name = 'Un nom de campagne',
  code = 'AZERTY123',
  title = 'Un titre de campagne',
  idPixLabel = 'Un id pix label',
  createdAt = new Date(),
  customLandingPageText = 'Une custom landing page',
  archivedAt = null,
  type = CampaignTypes.ASSESSMENT,
  creatorFirstName = 'Un prénom',
  creatorLastName = 'Un nom',
  ownerId = 2,
  ownerFirstName = 'Un prénom',
  ownerLastName = 'Un nom',
  targetProfileId = 3,
  targetProfileForSpecifier = {
    name: 'target profile',
    description: 'description',
    tubeCount: 3,
    thematicResultCount: 2,
    hasStage: false,
  },
  participationsCount = 5,
  sharedParticipationsCount = 2,
  averageResult = 0.4,
  badges = [],
  stages = [],
  multiplesendings = false,
} = {}) {
  return new CampaignReport({
    id,
    name,
    code,
    title,
    idPixLabel,
    createdAt,
    customLandingPageText,
    archivedAt,
    type,
    creatorFirstName,
    creatorLastName,
    ownerId,
    ownerFirstName,
    ownerLastName,
    targetProfileId,
    targetProfileForSpecifier,
    participationsCount,
    sharedParticipationsCount,
    averageResult,
    badges,
    stages,
    multiplesendings,
  });
};
