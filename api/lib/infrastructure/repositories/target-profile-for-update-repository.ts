// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const targetProfileForUpdate = require('../../domain/models/TargetProfileForUpdate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: $TSFixMe) {
    const row = await knex('target-profiles')
      .select('id', 'name', 'description', 'comment', 'category')
      .where({ id })
      .first();

    if (!row) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Le profil cible avec l'id ${id} n'existe pas`);
    }

    return new targetProfileForUpdate(row);
  },

  async update(targetProfile: $TSFixMe) {
    return await knex('target-profiles').where({ id: targetProfile.id }).update(targetProfile);
  },
};
