// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipRepository = require('../../infrastructure/repositories/membership-repository');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  execute(userId: $TSFixMe) {
    return membershipRepository.findByUserId({ userId }).then((memberships: $TSFixMe) => !_.isEmpty(memberships));
  },
};
