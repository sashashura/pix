// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async addTargetProfilesToOrganization({
    organizationId,
    targetProfileIdList
  }: $TSFixMe) {
    const targetProfileShareToAdd = targetProfileIdList.map((targetProfileId: $TSFixMe) => {
      return { organizationId, targetProfileId };
    });

    const insertedTargetProfileShares = await knex('target-profile-shares')
      .insert(targetProfileShareToAdd)
      .onConflict(['targetProfileId', 'organizationId'])
      .ignore()
      .returning('targetProfileId');

    const attachedTargetProfileIds = insertedTargetProfileShares.map(({
      targetProfileId
    }: $TSFixMe) => targetProfileId);
    const duplicatedTargetProfileIds = targetProfileIdList.filter(
      (targetProfileId: $TSFixMe) => !attachedTargetProfileIds.includes(targetProfileId)
    );

    return { duplicatedIds: duplicatedTargetProfileIds, attachedIds: attachedTargetProfileIds };
  },
};
