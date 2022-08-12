// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'stageSeria... Remove this comment to see the full error message
const stageSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/stage-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'stagesCont... Remove this comment to see the full error message
const stagesController = require('../../../../lib/application/stages/stages-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | stages-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    const userId = '1';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(stageSerializer, 'serialize');
      sinon.stub(stageSerializer, 'deserialize');
      sinon.stub(usecases, 'createStage');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a newly created stage', async function () {
      // given
      const requestPayload = {};
      const request = {
        auth: {
          credentials: {
            userId: userId,
          },
        },
        payload: requestPayload,
      };
      const deserializedStage = {
        title: 'My stage',
      };
      const createdStage = {};
      stageSerializer.deserialize.returns(deserializedStage);
      usecases.createStage.resolves(createdStage);

      // when
      const response = await stagesController.create(request, hFake);

      // then
      expect(response.statusCode).to.equal(201);
      expect(stageSerializer.deserialize.calledWith(requestPayload)).to.be.true;
      expect(usecases.createStage.calledWith({ stage: deserializedStage })).to.be.true;
      expect(stageSerializer.serialize.calledWith(createdStage)).to.be.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateStage', function () {
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'updateStage');
      request = {
        params: {
          id: 44,
        },
        payload: {
          data: {
            attributes: {
              title: "c'est cool",
              message: "ça va aller t'inquiète pas",
              threshold: 64,
              'prescriber-title': 'palier bof',
              'prescriber-description': 'tu es moyen',
            },
          },
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should succeed', async function () {
        // when
        const response = await stagesController.updateStage(request, hFake);

        // then
        expect(response.statusCode).to.equal(204);
        expect(usecases.updateStage).to.have.been.calledWithMatch({
          title: "c'est cool",
          message: "ça va aller t'inquiète pas",
          threshold: 64,
          prescriberDescription: 'tu es moyen',
          prescriberTitle: 'palier bof',
          stageId: 44,
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getStageDetails', function () {
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'getStageDetails');
      request = {
        params: {
          id: 44,
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should succeed', async function () {
        // when
        stagesController.getStageDetails(request);

        // then
        expect(usecases.getStageDetails).to.have.been.calledWithMatch({ stageId: 44 });
      });
    });
  });
});
