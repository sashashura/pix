// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'adminMembe... Remove this comment to see the full error message
const adminMemberRepository = require('../../infrastructure/repositories/admin-member-repository');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async execute(userId: $TSFixMe) {
    const adminMember = await adminMemberRepository.get({ userId });
    return adminMember.isSupport;
  },
};
