// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const Competence = require('../../../../lib/domain/models/Competence');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Competence', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('@reference', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the concatenation of competence index and name', function () {
      // given
      const competence = new Competence({ index: '1.1', name: "Mener une recherche et une veille d'information" });

      // when
      const result = competence.reference;

      // then
      expect(result).to.equal("1.1 Mener une recherche et une veille d'information");
    });
  });
});
