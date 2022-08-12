// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(framework: $TSFixMe) {
    return new Serializer('area', {
      ref: 'id',
      attributes: ['code', 'title', 'color', 'competences'],

      competences: {
        include: true,
        ref: 'id',
        attributes: ['name', 'index', 'thematics'],

        thematics: {
          include: true,
          ref: 'id',
          attributes: ['name', 'index', 'tubes'],

          tubes: {
            include: true,
            ref: 'id',
            attributes: ['name', 'practicalTitle', 'practicalDescription', 'mobile', 'tablet', 'skills'],
            skills: {
              ref: true,
              ignoreRelationshipData: true,
              relationshipLinks: {
                related: (_area: $TSFixMe, _skills: $TSFixMe, tube: $TSFixMe) => `/api/admin/tubes/${tube.id}/skills`,
              },
            },
          },
        },
      },

      transform(area: $TSFixMe) {
        area.competences.forEach((competence: $TSFixMe) => {
          competence.thematics = framework.thematics
            .filter((thematic: $TSFixMe) => {
              return competence.thematicIds.includes(thematic.id);
            })
            .map((thematic: $TSFixMe) => {
              return {
                ...thematic,
                tubes: framework.tubes.filter(({
                  id
                }: $TSFixMe) => {
                  return thematic.tubeIds.includes(id);
                }),
              };
            })
            .filter((thematic: $TSFixMe) => {
              return thematic.tubes.length > 0;
            });
        });
        return area;
      },
    }).serialize(framework.areas);
  },
};
