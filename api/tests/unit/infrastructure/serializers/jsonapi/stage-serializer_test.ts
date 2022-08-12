// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Stage'.
const Stage = require('../../../../../lib/domain/models/Stage');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/stage-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | stage-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Stage model object into JSON API data', function () {
      // given
      const stage = domainBuilder.buildStage({
        id: '1',
        message: 'Congrats, you won a banana stage',
        targetProfileId: '1',
        threshold: 42,
        title: 'Banana',
        prescriberTitle: 'Palier intermédiaire',
        prescriberDescription: 'Le participant a un niveau moyen',
      });

      const expectedSerializedStage = {
        data: {
          attributes: {
            message: 'Congrats, you won a banana stage',
            threshold: 42,
            title: 'Banana',
            'prescriber-title': stage.prescriberTitle,
            'prescriber-description': stage.prescriberDescription,
          },
          id: '1',
          type: 'stages',
        },
      };

      // when
      const json = serializer.serialize(stage);

      // then
      expect(json).to.deep.equal(expectedSerializedStage);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create JSON API date into a Stage model', function () {
      // given
      const targetProfileId = 43;
      const jsonStage = {
        data: {
          type: 'stages',
          attributes: {
            title: 'My stage title',
            message: 'My stage message',
            threshold: 42,
            'prescriber-title': 'Palier intermédiaire',
            'prescriber-description': 'Le participant a un niveau moyen',
          },
          relationships: {
            'target-profile': {
              data: {
                type: 'target-profiles',
                id: targetProfileId,
              },
            },
          },
        },
      };
      // when
      const stage = serializer.deserialize(jsonStage);

      // then
      expect(stage).to.be.an.instanceOf(Stage);
      expect(stage.title).to.equal('My stage title');
      expect(stage.message).to.equal('My stage message');
      expect(stage.threshold).to.equal(42);
      expect(stage.targetProfileId).to.equal(targetProfileId);
      expect(stage.prescriberTitle).to.equal('Palier intermédiaire');
      expect(stage.prescriberDescription).to.equal('Le participant a un niveau moyen');
    });
  });
});
