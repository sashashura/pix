const prescriberRoles = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  OWNER: 'OWNER',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAu... Remove this comment to see the full error message
class CampaignAuthorization {
  static isAllowedToManage({
    prescriberRole
  }: $TSFixMe) {
    return prescriberRole === prescriberRoles.ADMIN || prescriberRole === prescriberRoles.OWNER;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignAuthorization;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.prescriberRoles = prescriberRoles;
