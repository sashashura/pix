// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiService = require('../../../../lib/domain/services/pole-emploi-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../lib/config');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | Pole Emploi Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#generateLink', function () {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const originalEnv = settings.apiManager.url;

    // @ts-expect-error TS(2304): Cannot find name 'before'.
    before(function () {
      settings.apiManager.url = 'https://url-externe';
    });

    // @ts-expect-error TS(2304): Cannot find name 'after'.
    after(function () {
      settings.apiManager.url = originalEnv;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should generate a link', function () {
      const sending = {
        idEnvoi: 456,
        dateEnvoi: '2021-05-01T00:00:00.000Z',
        resultat: {},
      };

      // when
      const generatedLink = poleEmploiService.generateLink(sending);

      // then
      expect(generatedLink).to.equal(
        'https://url-externe/pole-emploi/envois?curseur=eyJpZEVudm9pIjo0NTYsImRhdGVFbnZvaSI6IjIwMjEtMDUtMDFUMDA6MDA6MDAuMDAwWiJ9'
      );
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a filter', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when isSuccessful is true', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should generate a link with a query params using the filters', function () {
          const sending = {
            idEnvoi: 456,
            dateEnvoi: '2021-05-01T00:00:00.000Z',
            resultat: {},
          };

          const filters = {
            isSuccessful: true,
          };

          // when
          const generatedLink = poleEmploiService.generateLink(sending, filters);

          // then
          expect(generatedLink).to.equal(
            'https://url-externe/pole-emploi/envois?curseur=eyJpZEVudm9pIjo0NTYsImRhdGVFbnZvaSI6IjIwMjEtMDUtMDFUMDA6MDA6MDAuMDAwWiJ9&enErreur=false'
          );
        });
      });
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when isSuccessful is false', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should generate a link with a query params using the filters', function () {
          const sending = {
            idEnvoi: 456,
            dateEnvoi: '2021-05-01T00:00:00.000Z',
            resultat: {},
          };

          const filters = {
            isSuccessful: false,
          };

          // when
          const generatedLink = poleEmploiService.generateLink(sending, filters);

          // then
          expect(generatedLink).to.equal(
            'https://url-externe/pole-emploi/envois?curseur=eyJpZEVudm9pIjo0NTYsImRhdGVFbnZvaSI6IjIwMjEtMDUtMDFUMDA6MDA6MDAuMDAwWiJ9&enErreur=true'
          );
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#decodeCursor', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a cursor', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should decode the cursor', function () {
        const cursor = poleEmploiService.generateCursor({ idEnvoi: 456, dateEnvoi: '2021-05-01T00:00:00.000Z' });
        const decodedData = poleEmploiService.decodeCursor(cursor);

        expect(decodedData).to.deep.equal({ idEnvoi: 456, dateEnvoi: '2021-05-01T00:00:00.000Z' });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the parameter is undefined', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', function () {
        const str = undefined;
        const decodedData = poleEmploiService.decodeCursor(str);

        expect(decodedData).to.deep.equal(null);
      });
    });
  });
});
