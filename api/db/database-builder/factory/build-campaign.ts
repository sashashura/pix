// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetProfile = require('./build-target-profile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCampaign({
  id = databaseBuffer.getNextId(),
  name = 'Name',
  code = 'ABC456TTY',
  title = 'Title',
  idPixLabel = 'IdPixLabel',
  externalIdHelpImageUrl = null,
  alternativeTextToExternalIdHelpImage = null,
  customLandingPageText = 'Some landing page text ',
  isForAbsoluteNovice = false,
  archivedAt = null,
  type = 'ASSESSMENT',
  createdAt = new Date('2020-01-01'),
  organizationId,
  creatorId,
  ownerId,
  targetProfileId,
  customResultPageText = null,
  customResultPageButtonText = null,
  customResultPageButtonUrl = null,
  multipleSendings = false,
  assessmentMethod
}: $TSFixMe = {}) {
  if (type === CampaignTypes.ASSESSMENT && !assessmentMethod) {
    targetProfileId = _.isUndefined(targetProfileId)
      ? buildTargetProfile({ ownerOrganizationId: organizationId }).id
      : targetProfileId;
    assessmentMethod = Assessment.methods.SMART_RANDOM;
  }

  organizationId = _.isNil(organizationId) ? buildOrganization().id : organizationId;
  creatorId = _.isUndefined(creatorId) ? buildUser().id : creatorId;
  ownerId = _.isUndefined(ownerId) ? buildUser().id : ownerId;

  const values = {
    id,
    name,
    code,
    title,
    createdAt,
    idPixLabel,
    externalIdHelpImageUrl,
    alternativeTextToExternalIdHelpImage,
    customLandingPageText,
    archivedAt,
    type,
    isForAbsoluteNovice,
    organizationId,
    creatorId,
    ownerId,
    targetProfileId,
    customResultPageText,
    customResultPageButtonText,
    customResultPageButtonUrl,
    multipleSendings,
    assessmentMethod,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'campaigns',
    values,
  });
};
