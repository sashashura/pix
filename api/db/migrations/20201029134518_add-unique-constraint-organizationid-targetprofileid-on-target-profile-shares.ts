// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex
    .with('all_target_profile_shares_ranked', (qb: $TSFixMe) => {
      qb.select([
        'target-profile-shares.id',
        knex.raw('ROW_NUMBER() OVER (PARTITION BY ??, ?? ORDER BY ??) AS rank', [
          'target-profile-shares.organizationId',
          'target-profile-shares.targetProfileId',
          'target-profile-shares.createdAt',
        ]),
      ])
        .from('target-profile-shares')
        .join('organizations', 'organizations.id', 'target-profile-shares.organizationId');
    })
    .from('target-profile-shares')
    .whereRaw('id = ANY((SELECT id FROM all_target_profile_shares_ranked WHERE rank > 1))')
    .del();
  return knex.schema.table('target-profile-shares', (table: $TSFixMe) => table.unique(['organizationId', 'targetProfileId']));
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  return knex.schema.table('target-profile-shares', (table: $TSFixMe) => table.dropUnique(['organizationId', 'targetProfileId']));
};
