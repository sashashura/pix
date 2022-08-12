// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
const { mockLearningContent, expect } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const trainingRepository = require('../../../../lib/infrastructure/repositories/training-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Training'.
const Training = require('../../../../lib/domain/models/Training');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | training-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByTargetProfileId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should find trainings by targetProfileId and locale', async function () {
      // given
      const trainingsList = [
        {
          title: 'training 0',
          id: 'recTraining0',
          targetProfileIds: [12343],
          locale: 'fr-fr',
        },
        {
          title: 'training 1',
          id: 'recTraining1',
          targetProfileIds: [12343],
          locale: 'fr-fr',
        },
        {
          title: 'training 3',
          id: 'recTraining3',
          targetProfileIds: [12343],
          locale: 'en-gb',
        },
        {
          title: 'training 4',
          id: 'recTraining4',
          targetProfileIds: [43],
          locale: 'fr-fr',
        },
      ];

      const learningContent = { trainings: trainingsList };
      mockLearningContent(learningContent);

      // when
      const trainings = await trainingRepository.findByTargetProfileIdAndLocale({ targetProfileId: 12343 });

      // then
      expect(trainings).to.have.lengthOf(2);
      expect(trainings[0]).to.be.instanceOf(Training);
    });
  });
});
