// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/competence-evaluation-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | competence-evaluation-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a CompetenceEvaluation model object into JSON API data', function () {
      // given
      const competenceEvaluation = domainBuilder.buildCompetenceEvaluation();

      const expectedSerializedCompetenceEvaluation = {
        data: {
          type: 'competence-evaluations',
          id: competenceEvaluation.id.toString(),
          attributes: {
            'updated-at': new Date(competenceEvaluation.updatedAt),
            'created-at': new Date(competenceEvaluation.createdAt),
            'user-id': competenceEvaluation.userId,
            'competence-id': competenceEvaluation.competenceId,
            status: competenceEvaluation.status,
          },
          relationships: {
            assessment: {
              data: {
                id: competenceEvaluation.assessmentId.toString(),
                type: 'assessments',
              },
            },
            scorecard: {
              links: {
                related: `/api/scorecards/${competenceEvaluation.userId}_${competenceEvaluation.competenceId}`,
              },
            },
          },
        },
      };

      // when
      const json = serializer.serialize(competenceEvaluation);

      // then
      expect(json).to.deep.equal(expectedSerializedCompetenceEvaluation);
    });
  });
});
