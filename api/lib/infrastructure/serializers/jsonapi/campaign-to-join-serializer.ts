// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(campaignsToJoin: $TSFixMe) {
    return new Serializer('campaign', {
      attributes: [
        'code',
        'title',
        'type',
        'idPixLabel',
        'customLandingPageText',
        'externalIdHelpImageUrl',
        'alternativeTextToExternalIdHelpImage',
        'isArchived',
        'isForAbsoluteNovice',
        'isRestricted',
        'isSimplifiedAccess',
        'organizationName',
        'organizationType',
        'organizationLogoUrl',
        'identityProvider',
        'organizationShowNPS',
        'organizationFormNPSUrl',
        'targetProfileName',
        'targetProfileImageUrl',
        'customResultPageText',
        'customResultPageButtonText',
        'customResultPageButtonUrl',
        'multipleSendings',
        'isFlash',
      ],
    }).serialize(campaignsToJoin);
  },
};
