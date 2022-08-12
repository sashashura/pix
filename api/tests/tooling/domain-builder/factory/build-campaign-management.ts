// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignMa... Remove this comment to see the full error message
const CampaignManagement = require('../../../../lib/domain/read-models/CampaignManagement');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCampaignManagement({
  id = 1,
  name = 'Un nom de campagne',
  code = 'AZERTY123',
  createdAt = new Date(),
  archivedAt = null,
  type = CampaignTypes.ASSESSMENT,
  creatorId = 2,
  creatorFirstName = 'Un prénom',
  creatorLastName = 'Un nom',
  ownerId = 3,
  ownerFirstName = 'Alain',
  ownerLastName = 'Provist',
} = {}) {
  return new CampaignManagement({
    id,
    name,
    code,
    createdAt,
    archivedAt,
    type,
    creatorId,
    creatorFirstName,
    creatorLastName,
    ownerId,
    ownerFirstName,
    ownerLastName,
  });
};
