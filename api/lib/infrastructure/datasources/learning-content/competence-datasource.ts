// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'datasource... Remove this comment to see the full error message
const datasource = require('./datasource');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = datasource.extend({
  modelName: 'competences',

  async findByRecordIds(competenceIds: $TSFixMe) {
    const competences = await this.list();
    return competences.filter(({
      id
    }: $TSFixMe) => competenceIds.includes(id));
  },
});
