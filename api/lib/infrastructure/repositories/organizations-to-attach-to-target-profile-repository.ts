// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'foreignKey... Remove this comment to see the full error message
const { foreignKeyConstraintViolated } = require('../utils/knex-utils.js');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async attachOrganizations(targetProfile: $TSFixMe) {
    const rows = targetProfile.organizations.map((organizationId: $TSFixMe) => {
      return {
        organizationId,
        targetProfileId: targetProfile.id,
      };
    });
    const attachedOrganizationIds = await _createTargetProfileShares(rows);

    const duplicatedOrganizationIds = targetProfile.organizations.filter(
      (organizationId: $TSFixMe) => !attachedOrganizationIds.includes(organizationId)
    );

    return { duplicatedIds: duplicatedOrganizationIds, attachedIds: attachedOrganizationIds };
  },
};

async function _createTargetProfileShares(targetProfileShares: $TSFixMe) {
  try {
    const insertedTargetProfileShares = await knex('target-profile-shares')
      .insert(targetProfileShares)
      .onConflict(['targetProfileId', 'organizationId'])
      .ignore()
      .returning('organizationId');

    return insertedTargetProfileShares.map(({
      organizationId
    }: $TSFixMe) => organizationId);
  } catch (error) {
    if (foreignKeyConstraintViolated(error)) {
      const organizationId = (error as $TSFixMe).detail.match(/=\((\d+)\)/)[1];
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`L'organization avec l'id ${organizationId} n'existe pas`);
    }
  }
}
