// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
class CompetenceTree {
  areas: $TSFixMe;
  id: $TSFixMe;
  constructor({ id = 1, areas = [] } = {}) {
    this.id = id;
    this.areas = areas;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CompetenceTree;
