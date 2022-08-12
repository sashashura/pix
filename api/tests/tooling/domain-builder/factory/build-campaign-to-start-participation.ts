// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTo... Remove this comment to see the full error message
const CampaignToStartParticipation = require('../../../../lib/domain/models/CampaignToStartParticipation');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCampaignToStartParticipation({
  id = 1,
  idPixLabel = 'Un id pix label',
  archivedAt = null,
  type = CampaignTypes.ASSESSMENT,
  isRestricted = false,
  multipleSendings = false,
  assessmentMethod = 'SMART_RANDOM',
  skillCount = 1,
  organizationId
}: $TSFixMe = {}) {
  return new CampaignToStartParticipation({
    id,
    idPixLabel,
    archivedAt,
    type,
    isRestricted,
    multipleSendings,
    assessmentMethod,
    skillCount: type === CampaignTypes.ASSESSMENT ? skillCount : null,
    organizationId,
  });
};
