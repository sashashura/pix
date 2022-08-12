// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../../domain/models/CompetenceMark');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./AssessmentResult');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'CompetenceMark';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'competence-marks',
    hasTimestamps: ['createdAt', null],

    assessmentResults() {
      return this.belongsTo('AssessmentResult');
    },

    toDomainEntity() {
      const model = this.toJSON();
      return new CompetenceMark(model);
    },
  },
  {
    modelName,
  }
);
