// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCpfCity = require('../../domain/models/CertificationCpfCity');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMNS'.
const COLUMNS = ['id', 'name', 'postalCode', 'INSEECode', 'isActualName'];

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findByINSEECode({
    INSEECode
  }: $TSFixMe) {
    const result = await knex
      .select(COLUMNS)
      .from('certification-cpf-cities')
      .where({ INSEECode })
      .orderBy('isActualName', 'desc')
      .orderBy('id');

    return result.map((city: $TSFixMe) => new CertificationCpfCity(city));
  },

  async findByPostalCode({
    postalCode
  }: $TSFixMe) {
    const result = await knex
      .select(COLUMNS)
      .from('certification-cpf-cities')
      .where({ postalCode })
      .orderBy('isActualName', 'desc')
      .orderBy('id');

    return result.map((city: $TSFixMe) => new CertificationCpfCity(city));
  },
};
