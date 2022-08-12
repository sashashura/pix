// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ResultComp... Remove this comment to see the full error message
const ResultCompetenceTree = require('../../../../lib/domain/models/ResultCompetenceTree');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildCompetenceTree = require('./build-competence-tree');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCompe... Remove this comment to see the full error message
const buildCompetenceMark = require('./build-competence-mark');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildResultCompetenceTree({
  id = '1-1',
  competenceTree = buildCompetenceTree(),
  competenceMarks = [buildCompetenceMark()],
} = {}) {
  const resultCompetenceTree = ResultCompetenceTree.generateTreeFromCompetenceMarks({
    competenceTree,
    competenceMarks,
  });
  resultCompetenceTree.id = id;
  return resultCompetenceTree;
};
