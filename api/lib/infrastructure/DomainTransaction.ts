// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
class DomainTransaction {
  knexTransaction: $TSFixMe;
  constructor(knexTransaction: $TSFixMe) {
    this.knexTransaction = knexTransaction;
  }

  static execute(lambda: $TSFixMe) {
    return knex.transaction((trx: $TSFixMe) => {
      return lambda(new DomainTransaction(trx));
    });
  }

  static emptyTransaction() {
    return new DomainTransaction(null);
  }
}
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = DomainTransaction;
