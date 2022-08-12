// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/framework-areas-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | pix-framework-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a serialized JSON data object', function () {
      // given
      const tube = domainBuilder.buildTube({
        id: 'tubeId',
      });

      const thematicWithTube = domainBuilder.buildThematic({
        id: 'recThem1',
        tubeIds: ['tubeId'],
      });

      const thematicWithoutTube = domainBuilder.buildThematic({
        id: 'recThem2',
      });

      const area = domainBuilder.buildArea({});

      const competence = domainBuilder.buildCompetence({ thematicIds: ['recThem1', 'recThem2'] });
      area.competences = [competence];

      const expectedSerializedResult = {
        data: [
          {
            id: 'recArea123',
            type: 'areas',
            attributes: {
              code: 5,
              color: 'red',
              title: 'Super domaine',
            },
            relationships: {
              competences: {
                data: [
                  {
                    id: 'recCOMP1',
                    type: 'competences',
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            type: 'tubes',
            id: 'tubeId',
            attributes: {
              name: '@tubeName',
              'practical-title': 'titre pratique',
              'practical-description': 'description pratique',
            },
            relationships: {
              skills: {
                links: {
                  related: '/api/admin/tubes/tubeId/skills',
                },
              },
            },
          },
          {
            type: 'thematics',
            id: 'recThem1',
            attributes: {
              name: 'My Thematic',
              index: 0,
            },
            relationships: {
              tubes: {
                data: [
                  {
                    id: 'tubeId',
                    type: 'tubes',
                  },
                ],
              },
            },
          },
          {
            type: 'competences',
            id: 'recCOMP1',
            relationships: {
              thematics: {
                data: [
                  {
                    id: 'recThem1',
                    type: 'thematics',
                  },
                ],
              },
            },
            attributes: {
              index: '1.1',
              name: 'Manger des fruits',
            },
          },
        ],
      };

      // when
      const result = serializer.serialize({
        tubes: [tube],
        thematics: [thematicWithTube, thematicWithoutTube],
        areas: [area],
      });

      // then
      expect(result).to.deep.equal(expectedSerializedResult);
    });
  });
});
