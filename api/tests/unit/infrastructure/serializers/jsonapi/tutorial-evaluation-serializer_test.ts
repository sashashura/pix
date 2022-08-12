// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/tutorial-evaluation-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialEv... Remove this comment to see the full error message
const TutorialEvaluation = require('../../../../../lib/domain/models/TutorialEvaluation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | tutorial-evaluation-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is only tutorial evaluation', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should serialize', function () {
        // given
        const tutorialEvaluation = {
          id: 'tutorialEvaluationId',
          userId: 'userId',
          tutorialId: 'tutorialId',
          status: TutorialEvaluation.statuses.LIKED,
        };
        const expectedJsonTutorialEvaluation = {
          data: {
            type: 'tutorial-evaluations',
            id: 'tutorialEvaluationId',
            attributes: {
              'user-id': 'userId',
              'tutorial-id': 'tutorialId',
              status: TutorialEvaluation.statuses.LIKED,
            },
          },
        };
        // when
        const json = serializer.serialize(tutorialEvaluation);

        // then
        expect(json).to.be.deep.equal(expectedJsonTutorialEvaluation);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is tutorial evaluation and tutorial', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should serialize', function () {
        // given
        const tutorialEvaluation = {
          id: 'tutorialEvaluationId',
          userId: 'userId',
          tutorial: domainBuilder.buildTutorial({ id: 'tutorialId' }),
        };

        const expectedJsonTutorialEvaluation = {
          data: {
            type: 'tutorial-evaluations',
            id: 'tutorialEvaluationId',
            attributes: {
              'user-id': 'userId',
            },
            relationships: {
              tutorial: {
                data: {
                  id: 'tutorialId',
                  type: 'tutorials',
                },
              },
            },
          },
          included: [
            {
              attributes: {
                duration: '00:01:30',
                format: 'video',
                id: 'tutorialId',
                link: 'https://youtube.fr',
                source: 'Youtube',
                title: 'Savoir regarder des vidéos youtube.',
              },
              id: 'tutorialId',
              type: 'tutorials',
            },
          ],
        };
        // when
        const json = serializer.serialize(tutorialEvaluation);

        // then
        expect(json).to.be.deep.equal(expectedJsonTutorialEvaluation);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert JSON API data into a TutorialEvaluation model object', function () {
      // given
      const jsonTutorialEvaluation = {
        data: {
          id: 123,
          type: 'tutorial-evaluations',
          attributes: {
            'user-id': 456,
            'tutorial-id': 'tutorial123',
            status: 'LIKED',
          },
          relationships: {},
        },
      };

      // when
      const tutorialEvaluation = serializer.deserialize(jsonTutorialEvaluation);

      // then
      expect(tutorialEvaluation).to.be.instanceOf(TutorialEvaluation);
      expect(tutorialEvaluation.id).to.be.equal(123);
      expect(tutorialEvaluation.userId).to.be.equal(456);
      expect(tutorialEvaluation.tutorialId).to.be.equal('tutorial123');
      expect(tutorialEvaluation.status).to.be.equal(TutorialEvaluation.statuses.LIKED);
    });
  });
});
