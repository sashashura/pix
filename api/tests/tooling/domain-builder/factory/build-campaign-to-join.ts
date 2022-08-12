// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTo... Remove this comment to see the full error message
const CampaignToJoin = require('../../../../lib/domain/read-models/CampaignToJoin');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'types'.
const { types } = require('../../../../lib/domain/models/Organization');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCampaignToJoin({
  id = 1,
  code = 'AZERTY123',
  title = 'Un titre de campagne',
  idPixLabel = 'Un id pix label',
  customLandingPageText = 'Une custom landing page',
  externalIdHelpImageUrl = 'baseCodeExternalIdImage',
  alternativeTextToExternalIdHelpImage = 'Une aide pour id externe',
  archivedAt = null,
  type = CampaignTypes.ASSESSMENT,
  isForAbsoluteNovice = false,
  organizationId = 2,
  organizationName = 'NomOrga',
  organizationType = types.PRO,
  organizationLogoUrl = 'baseCodeOrgaLogoImage',
  organizationIsManagingStudents = false,
  identityProvider = null,
  organizationShowNPS = true,
  organizationFormNPSUrl = 'https://pix.fr/nps-pix-emploi/',
  targetProfileName = 'Le profil cible',
  targetProfileImageUrl = 'targetProfileImageUrl',
  multipleSendings = false,
  assessmentMethod = 'SMART_RANDOM',
} = {}) {
  return new CampaignToJoin({
    id,
    code,
    title,
    idPixLabel,
    customLandingPageText,
    externalIdHelpImageUrl,
    alternativeTextToExternalIdHelpImage,
    archivedAt,
    type,
    isForAbsoluteNovice,
    organizationId,
    organizationName,
    organizationType,
    organizationLogoUrl,
    organizationIsManagingStudents,
    identityProvider,
    organizationShowNPS,
    organizationFormNPSUrl,
    targetProfileName,
    targetProfileImageUrl,
    multipleSendings,
    assessmentMethod,
  });
};
