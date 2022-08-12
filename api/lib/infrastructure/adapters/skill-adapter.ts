// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../domain/models/Skill');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  fromDatasourceObject(datasourceObject: $TSFixMe) {
    return new Skill({
      id: datasourceObject.id,
      name: datasourceObject.name,
      pixValue: datasourceObject.pixValue,
      competenceId: datasourceObject.competenceId,
      tutorialIds: datasourceObject.tutorialIds,
      tubeId: datasourceObject.tubeId,
      version: datasourceObject.version,
      level: datasourceObject.level,
    });
  },
};
