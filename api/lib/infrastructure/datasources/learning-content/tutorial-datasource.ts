// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'datasource... Remove this comment to see the full error message
const datasource = require('./datasource');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = datasource.extend({
  modelName: 'tutorials',

  async findByRecordIds(tutorialRecordIds: $TSFixMe) {
    const tutorials = await this.list();
    return tutorials.filter((tutorialData: $TSFixMe) => _.includes(tutorialRecordIds, tutorialData.id));
  },
});
