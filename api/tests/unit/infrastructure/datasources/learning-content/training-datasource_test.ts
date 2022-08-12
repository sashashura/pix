// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'trainingDa... Remove this comment to see the full error message
const trainingDatasource = require('../../../../../lib/infrastructure/datasources/learning-content/training-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../../../../lib/infrastructure/lcms');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Datasource | Learning Content | TrainingDatasource', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#list', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of learning content trainings data objects', async function () {
      // given
      const records = [{ id: 1 }, { id: 2 }, { id: 3 }];
      sinon.stub(lcms, 'getLatestRelease').resolves({ trainings: records });

      // when
      const foundTrainings = await trainingDatasource.list();

      // then
      expect(foundTrainings).to.deep.equal(records);
    });
  });
});
