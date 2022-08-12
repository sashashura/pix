// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Area'.
const Area = require('./Area');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ResultComp... Remove this comment to see the full error message
const ResultCompetence = require('./ResultCompetence');

const NOT_PASSED_LEVEL = -1;
const NOT_PASSED_SCORE = 0;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ResultComp... Remove this comment to see the full error message
class ResultCompetenceTree {
  areas: $TSFixMe;
  id: $TSFixMe;
  constructor({
    id,
    areas = []
  }: $TSFixMe = {}) {
    this.id = id;
    this.areas = areas;
  }

  static generateTreeFromCompetenceMarks({
    competenceTree,
    competenceMarks,
    certificationId,
    assessmentResultId
  }: $TSFixMe) {
    const areasWithResultCompetences = competenceTree.areas.map((area: $TSFixMe) => {
      const areaWithResultCompetences = new Area(area);

      (areaWithResultCompetences as $TSFixMe).resultCompetences = area.competences.map((competence: $TSFixMe) => {
    const noLevelCompetenceMarkData = { level: NOT_PASSED_LEVEL, score: NOT_PASSED_SCORE };
    const associatedCompetenceMark = competenceMarks.find((competenceMark: $TSFixMe) => competenceMark.competence_code === competence.index) ||
        noLevelCompetenceMarkData;
    return new ResultCompetence({
        id: competence.id,
        index: competence.index,
        level: associatedCompetenceMark.level,
        name: competence.name,
        score: associatedCompetenceMark.score,
    });
});

      delete areaWithResultCompetences.competences; // XXX Competences duplicate info from resultCompetences

      return areaWithResultCompetences;
    });

    return new ResultCompetenceTree({
      id: `${certificationId}-${assessmentResultId}`,
      areas: areasWithResultCompetences,
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ResultCompetenceTree;
