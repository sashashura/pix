// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./BadgeCriterion');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./SkillSet');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./TargetProfile');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'Badge';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'badges',

    targetProfile() {
      return this.belongsTo('TargetProfile', 'targetProfileId');
    },

    badgeCriteria() {
      return this.hasMany('BadgeCriterion', 'badgeId');
    },

    skillSets() {
      return this.hasMany('SkillSet', 'badgeId');
    },
  },
  {
    modelName,
  }
);
