// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'frameworkA... Remove this comment to see the full error message
const frameworkAreasSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/framework-areas-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'frameworkS... Remove this comment to see the full error message
const frameworkSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/framework-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'frameworks... Remove this comment to see the full error message
const frameworksController = require('../../../../lib/application/frameworks/frameworks-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | frameworks-controller', function () {
  let frameworks: $TSFixMe;
  let areas: $TSFixMe;
  let serializedAreas: $TSFixMe;
  let serializedFrameworks: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    frameworks = Symbol('frameworks');
    areas = Symbol('areas');
    serializedAreas = Symbol('serializedAreas');
    serializedFrameworks = Symbol('serializedFrameworks');

    sinon.stub(usecases, 'getFrameworks').returns(frameworks);
    sinon.stub(frameworkAreasSerializer, 'serialize').returns(serializedAreas);
    sinon.stub(frameworkSerializer, 'serialize').returns(serializedFrameworks);
    sinon.stub(usecases, 'getFrameworkAreas').returns(areas);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getPixFramework', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fetch and return pix framework, serialized as JSONAPI', async function () {
      // given
      const request = {};

      // when
      const result = await frameworksController.getPixFramework(request);

      // then
      expect(result).to.equal(serializedAreas);
      expect(usecases.getFrameworkAreas).to.have.been.calledWith({ frameworkName: 'Pix', locale: 'fr-fr' });
      expect(frameworkAreasSerializer.serialize).to.have.been.calledWithExactly(areas);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should extract the locale and pass it to the usecases', async function () {
      // given
      const request = {
        headers: {
          'accept-language': 'en',
        },
      };

      // when
      const result = await frameworksController.getPixFramework(request);

      // then
      expect(result).to.equal(serializedAreas);
      expect(usecases.getFrameworkAreas).to.have.been.calledWithExactly({ frameworkName: 'Pix', locale: 'en' });
      expect(frameworkAreasSerializer.serialize).to.have.been.calledWithExactly(areas);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getFrameworks', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fetch and return frameworks, serialized as JSONAPI', async function () {
      // when
      const result = await frameworksController.getFrameworks();

      // then
      expect(result).to.equal(serializedFrameworks);
      expect(usecases.getFrameworks).to.have.been.calledWithExactly();
      expect(frameworkSerializer.serialize).to.have.been.calledWithExactly(frameworks);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getFrameworkAreas', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fetch and return framework, serialized as JSONAPI', async function () {
      // given
      const frameworkId = 'frameworkId';
      const request = {
        params: {
          id: frameworkId,
        },
      };

      // when
      const result = await frameworksController.getFrameworkAreas(request);

      // then
      expect(result).to.equal(serializedAreas);
      expect(usecases.getFrameworkAreas).to.have.been.calledWithExactly({ frameworkId });
      expect(frameworkAreasSerializer.serialize).to.have.been.calledWithExactly(areas);
    });
  });
});
