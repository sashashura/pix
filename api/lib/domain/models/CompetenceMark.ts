// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'schema'.
const schema = Joi.object({
  id: Joi.number().integer().optional(),
  level: Joi.number().integer().min(-1).max(8).required(),
  score: Joi.number().integer().min(0).max(64).required(),
  area_code: Joi.required(),
  competence_code: Joi.required(),
  competenceId: Joi.string().optional(),
  assessmentResultId: Joi.number().optional(),
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
class CompetenceMark {
  area_code: $TSFixMe;
  assessmentResultId: $TSFixMe;
  competenceId: $TSFixMe;
  competence_code: $TSFixMe;
  id: $TSFixMe;
  level: $TSFixMe;
  score: $TSFixMe;
  constructor({
    id,
    area_code,
    competence_code,
    competenceId,
    level,
    score,
    assessmentResultId
  }: $TSFixMe = {}) {
    this.id = id;
    this.area_code = area_code;
    this.competence_code = competence_code;
    this.competenceId = competenceId;
    this.level = level;
    this.score = score;
    this.assessmentResultId = assessmentResultId;
  }

  validate() {
    validateEntity(schema, this);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CompetenceMark;
