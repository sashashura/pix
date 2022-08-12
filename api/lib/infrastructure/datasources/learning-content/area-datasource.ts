// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'datasource... Remove this comment to see the full error message
const datasource = require('./datasource');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = datasource.extend({
  modelName: 'areas',

  async findByRecordIds(areaIds: $TSFixMe) {
    const areas = await this.list();
    return areas.filter(({
      id
    }: $TSFixMe) => areaIds.includes(id));
  },

  async findByFrameworkId(frameworkId: $TSFixMe) {
    const areas = await this.list();
    return areas.filter((area: $TSFixMe) => area.frameworkId === frameworkId);
  },
});
