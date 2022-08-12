// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

const DISTANCE = 0.8;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  filterByFullName(queryBuilder: $TSFixMe, search: $TSFixMe, firstName: $TSFixMe, lastName: $TSFixMe) {
    const searchLowerCase = search.trim().toLowerCase();
    queryBuilder.where(function(this: $TSFixMe) {
      this.where(knex.raw(`CONCAT (??, ' ', ??) <-> ?`, [firstName, lastName, searchLowerCase]), '<=', DISTANCE);
      this.orWhereRaw('LOWER(??) LIKE ?', [firstName, `%${searchLowerCase}%`]);
      this.orWhereRaw('LOWER(??) LIKE ?', [lastName, `%${searchLowerCase}%`]);
    });
  },
};
