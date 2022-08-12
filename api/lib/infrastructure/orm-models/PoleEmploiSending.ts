// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./CampaignParticipation');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'PoleEmploiSending';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'pole-emploi-sendings',
    hasTimestamps: ['createdAt'],

    campaignParticipation() {
      return this.belongsTo('CampaignParticipation', 'campaignParticipationId');
    },
  },
  {
    modelName,
  }
);
