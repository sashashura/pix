// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, hFake } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'progressio... Remove this comment to see the full error message
const progressionController = require('../../../../lib/application/progressions/progression-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | progression-controller', function () {
  const userId = 60;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    const progressionId = 'progression-1234';

    const request = {
      params: {
        id: progressionId,
      },
      auth: { credentials: { userId } },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'getProgression');
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('if assessment exists', function () {
      let progression: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        progression = domainBuilder.buildProgression({ knowledgeElements: [], isProfileCompleted: true });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and belongs to current user', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the serialized progression', async function () {
          // given
          const serializedProgression = {
            data: {
              id: progressionId,
              attributes: {
                'completion-rate': 1,
              },
              type: 'progressions',
            },
          };
          usecases.getProgression.resolves(progression);

          // when
          const response = await progressionController.get(request, hFake);

          // Then
          expect(usecases.getProgression).to.have.been.calledWith({
            progressionId,
            userId,
          });

          expect(response).to.deep.equal(serializedProgression);
        });
      });
    });
  });
});
