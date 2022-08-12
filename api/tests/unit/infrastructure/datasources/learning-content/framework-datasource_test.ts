// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'frameworkD... Remove this comment to see the full error message
const frameworkDatasource = require('../../../../../lib/infrastructure/datasources/learning-content/framework-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../../../../lib/infrastructure/lcms');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Datasource | Learning Content | FrameworkDatasource', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#list', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of learning content frameworks data objects', async function () {
      // given
      const records = [{ id: 'recFramework0' }, { id: 'recFramework1' }, { id: 'recFramework2' }];
      sinon.stub(lcms, 'getLatestRelease').resolves({ frameworks: records });

      // when
      const foundFrameworks = await frameworkDatasource.list();

      // then
      expect(foundFrameworks).to.deep.equal(records);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a framework', async function () {
      // given
      const frameworks = [
        { id: 'recFramework0', name: 'Framework0' },
        { id: 'recFramework1', name: 'Framework1' },
        { id: 'recFramework2', name: 'Framework2' },
      ];
      sinon.stub(lcms, 'getLatestRelease').resolves({ frameworks });

      // when
      const foundFramework = await frameworkDatasource.getByName('Framework0');

      // then
      expect(foundFramework).to.deep.equal({ id: 'recFramework0', name: 'Framework0' });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when framework not found', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return undefined', async function () {
        const frameworks = [
          { id: 'recFramework0', name: 'Framework0' },
          { id: 'recFramework1', name: 'Framework1' },
          { id: 'recFramework2', name: 'Framework2' },
        ];
        sinon.stub(lcms, 'getLatestRelease').resolves({ frameworks });

        // when
        const foundFramework = await frameworkDatasource.getByName('Framework3');

        // then
        expect(foundFramework).to.be.undefined;
      });
    });
  });
});
