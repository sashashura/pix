// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../../../../lib/infrastructure/lcms');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialDa... Remove this comment to see the full error message
const tutorialDatasource = require('../../../../../lib/infrastructure/datasources/learning-content/tutorial-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../../../../../lib/infrastructure/caches/learning-content-cache');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Datasource | Learning Content | TutorialDatasource', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(cache, 'get').callsFake((generator: $TSFixMe) => generator());
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByRecordIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of tutorial data objects', function () {
      // given
      const rawTutorial1 = { id: 'FAKE_REC_ID_RAW_TUTORIAL_1' };
      const rawTutorial2 = { id: 'FAKE_REC_ID_RAW_TUTORIAL_2' };
      const rawTutorial3 = { id: 'FAKE_REC_ID_RAW_TUTORIAL_3' };
      const records = [rawTutorial1, rawTutorial2, rawTutorial3];
      sinon.stub(lcms, 'getLatestRelease').resolves({ tutorials: records });

      // when
      const promise = tutorialDatasource.findByRecordIds([rawTutorial1.id, rawTutorial3.id]);

      // then
      return promise.then((foundTutorials: $TSFixMe) => {
        expect(foundTutorials).to.be.an('array');
        expect(_.map(foundTutorials, 'id')).to.deep.equal([rawTutorial1.id, rawTutorial3.id]);
        expect(lcms.getLatestRelease).to.have.been.called;
      });
    });
  });
});
