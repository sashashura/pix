// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { getCampaignUrl };

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCampaig... Remove this comment to see the full error message
function getCampaignUrl(locale: $TSFixMe, campaignCode: $TSFixMe) {
  if (!campaignCode) {
    return null;
  }
  if (locale === 'fr') {
    return `${settings.domain.pixApp + settings.domain.tldOrg}/campagnes/${campaignCode}/?lang=fr`;
  }
  if (locale === 'en') {
    return `${settings.domain.pixApp + settings.domain.tldOrg}/campagnes/${campaignCode}/?lang=en`;
  }
  return `${settings.domain.pixApp + settings.domain.tldFr}/campagnes/${campaignCode}`;
}
