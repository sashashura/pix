// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceTree = require('../../../../lib/domain/models/CompetenceTree');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildArea'... Remove this comment to see the full error message
const buildArea = require('./build-area');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildCompetence = require('./build-competence');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCompetenceTree({
  id = 1,
  areas = [
    buildArea({
      id: 'recvoGdo7z2z7pXWa',
      code: '1',
      title: 'Information et données',
      name: '1. Information et données',
      color: 'jaffa',
      frameworkId: 'recAi12kj43h23jrh3',
      competences: [
        buildCompetence({
          name: 'Mener une recherche et une veille d’information',
          id: 'recsvLz0W2ShyfD63',
          index: '1.1',
        }),
        buildCompetence({
          name: 'Mener une recherche et une veille d’information',
          id: 'recNv8qhaY887jQb2',
          index: '1.2',
        }),
        buildCompetence({
          name: 'Mener une recherche et une veille d’information',
          id: 'recIkYm646lrGvLNT',
          index: '1.3',
        }),
      ],
    }),
  ],
} = {}) {
  return new CompetenceTree({
    id,
    // @ts-expect-error TS(2322): Type 'any[]' is not assignable to type 'never[]'.
    areas,
  });
};
