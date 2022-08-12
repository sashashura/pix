// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(complementaryCertification: $TSFixMe) {
    const columnsToSave = {
      complementaryCertificationId: complementaryCertification.complementaryCertificationId,
      certificationCenterId: complementaryCertification.certificationCenterId,
    };
    return knex('complementary-certification-habilitations').insert(columnsToSave);
  },

  async deleteByCertificationCenterId(certificationCenterId: $TSFixMe) {
    return knex('complementary-certification-habilitations').delete().where({ certificationCenterId });
  },
};
