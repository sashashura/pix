// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Campaign'.
const Campaign = require('../../../../lib/domain/models/Campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetProfile = require('./build-target-profile');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildUser = require('./build-user');

function buildCampaign({
  id = 1,
  name = 'name',
  code = 'AZERTY123',
  title = 'title',
  idPixLabel = 'idPixLabel',
  externalIdHelpImageUrl = null,
  alternativeTextToExternalIdHelpImage = null,
  customLandingPageText = 'landing page text',
  archivedAt = null,
  type = CampaignTypes.ASSESSMENT,
  isForAbsoluteNovice = false,
  createdAt = new Date('2020-01-01'),
  creator = buildUser(),
  ownerId = buildUser().id,
  organization = buildOrganization(),
  targetProfile = buildTargetProfile(),
  customResultPageButtonText = null,
  customResultPageButtonUrl = null,
  customResultPageText = null,
  multipleSendings = false,
} = {}) {
  return new Campaign({
    id,
    name,
    code,
    title,
    idPixLabel,
    externalIdHelpImageUrl,
    alternativeTextToExternalIdHelpImage,
    customLandingPageText,
    archivedAt,
    type,
    isForAbsoluteNovice,
    createdAt,
    creator,
    ownerId,
    organization,
    targetProfile,
    customResultPageButtonText,
    customResultPageButtonUrl,
    customResultPageText,
    multipleSendings,
  });
}

buildCampaign.ofTypeAssessment = function ({
  id = 1,
  name = 'name',
  code = 'AZERTY123',
  title = 'title',
  idPixLabel = 'idPixLabel',
  externalIdHelpImageUrl = null,
  alternativeTextToExternalIdHelpImage = null,
  customLandingPageText = 'landing page text',
  archivedAt = null,
  type = CampaignTypes.ASSESSMENT,
  isForAbsoluteNovice = false,
  createdAt = new Date('2020-01-01'),
  creator = buildUser(),
  ownerId = buildUser().id,
  organization = buildOrganization(),
  targetProfile = buildTargetProfile(),
  customResultPageButtonText = null,
  customResultPageButtonUrl = null,
  customResultPageText = null,
  multipleSendings = false,
} = {}) {
  return new Campaign({
    id,
    name,
    code,
    title,
    idPixLabel,
    externalIdHelpImageUrl,
    alternativeTextToExternalIdHelpImage,
    customLandingPageText,
    archivedAt,
    type,
    isForAbsoluteNovice,
    createdAt,
    creator,
    ownerId,
    organization,
    targetProfile,
    customResultPageButtonText,
    customResultPageButtonUrl,
    customResultPageText,
    multipleSendings,
  });
};

buildCampaign.ofTypeProfilesCollection = function ({
  id = 1,
  name = 'name',
  code = 'AZERTY123',
  idPixLabel = 'idPixLabel',
  externalIdHelpImageUrl = null,
  alternativeTextToExternalIdHelpImage = null,
  customLandingPageText = 'landing page text',
  archivedAt = null,
  type = CampaignTypes.PROFILES_COLLECTION,
  isForAbsoluteNovice = false,
  createdAt = new Date('2020-01-01'),
  creator = buildUser(),
  ownerId = buildUser().id,
  organization = buildOrganization(),
  customResultPageButtonText = null,
  customResultPageButtonUrl = null,
  customResultPageText = null,
  multipleSendings = false,
} = {}) {
  return new Campaign({
    id,
    name,
    code,
    idPixLabel,
    externalIdHelpImageUrl,
    alternativeTextToExternalIdHelpImage,
    customLandingPageText,
    archivedAt,
    type,
    isForAbsoluteNovice,
    title: null,
    createdAt,
    creator,
    ownerId,
    organization,
    targetProfile: null,
    customResultPageButtonText,
    customResultPageButtonUrl,
    customResultPageText,
    multipleSendings,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCampaign;
