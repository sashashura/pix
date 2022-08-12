// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentResultRepository = require('../../infrastructure/repositories/assessment-result-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceMarkRepository = require('../../infrastructure/repositories/competence-mark-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../models/CompetenceMark');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

async function _validatedDataForAllCompetenceMark(competenceMarks: $TSFixMe) {
  for (const competenceMark of competenceMarks) {
    competenceMark.validate();
  }
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function save(assessmentResult: $TSFixMe, competenceMarks: $TSFixMe) {
  await _validatedDataForAllCompetenceMark(competenceMarks);
  const { id } = await assessmentResultRepository.save(assessmentResult);
  return bluebird.mapSeries(competenceMarks, (competenceMark: $TSFixMe) => competenceMarkRepository.save(new CompetenceMark({ ...competenceMark, assessmentResultId: id }))
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  save,
};
