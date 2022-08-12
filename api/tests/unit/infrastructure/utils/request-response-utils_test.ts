// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'escapeFile... Remove this comment to see the full error message
  escapeFileName,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractUse... Remove this comment to see the full error message
  extractUserIdFromRequest,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
  extractLocaleFromRequest,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/infrastructure/utils/request-response-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ENGLISH_SP... Remove this comment to see the full error message
const { ENGLISH_SPOKEN, FRENCH_FRANCE, FRENCH_SPOKEN } = require('../../../../lib/domain/constants').LOCALE;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Utils | Request Utils', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#extractUserIdFromRequest', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should extract the ID of user from request', function () {
      // given
      const userId = 4;
      const request = {
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };
      // when
      const result = extractUserIdFromRequest(request);

      // then
      expect(result).to.equal(userId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null when request does not have headers', function () {
      // given
      const request = {};
      // when
      const result = extractUserIdFromRequest(request);

      // then
      expect(result).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#escapeFileName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow only a restricted set of characters', function () {
      // given
      const fileName = 'file-name with invalid_chars •’<>:"/\\|?*"\n.csv';

      // when
      const escapedFileName = escapeFileName(fileName);

      // then
      expect(escapedFileName).to.equal('file-name with invalid_chars _____________.csv');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#extractLocaleFromRequest', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return fr-fr locale when there is no header (to ensure retro-compat)', function () {
      // given
      const request = {};

      // when
      const locale = extractLocaleFromRequest(request);

      // then
      expect(locale).to.equal(FRENCH_FRANCE);
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { header: 'fr-FR', expectedLocale: FRENCH_FRANCE },
      { header: 'fr', expectedLocale: FRENCH_SPOKEN },
      { header: 'en', expectedLocale: ENGLISH_SPOKEN },
      { header: 'de', expectedLocale: FRENCH_FRANCE },
      { header: 'fr-BE', expectedLocale: FRENCH_FRANCE },
    ].forEach(function (data) {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return ${data.expectedLocale} locale when header is ${data.header}`, function () {
        // given
        const request = {
          headers: { 'accept-language': data.header },
        };

        // when
        const locale = extractLocaleFromRequest(request);

        // then
        expect(locale).to.equal(data.expectedLocale);
      });
    });
  });
});
