// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SiecleFile... Remove this comment to see the full error message
const SiecleFileStreamer = require('../../../../../lib/infrastructure/utils/xml/siecle-file-streamer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FileValida... Remove this comment to see the full error message
const { FileValidationError, SiecleXmlImportError } = require('../../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('SiecleFileStreamer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('perform', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the file is not zipped', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('parse the file', async function () {
        // @ts-expect-error TS(2304): Cannot find name '__dirname'.
        const path = `${__dirname}/files/xml/valid.xml`;

        const streamer = await SiecleFileStreamer.create(path);

        const text = await read(streamer);

        expect(text).to.equal('<hello></hello>\n');
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the xml is not correctly formed', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws an error', async function () {
          // @ts-expect-error TS(2304): Cannot find name '__dirname'.
          const path = `${__dirname}/files/xml/bad.xml`;

          const streamer = await SiecleFileStreamer.create(path);

          const error = await catchErr(
            streamer.perform,
            streamer
          )((saxStream: $TSFixMe, resolve: $TSFixMe) => {
            saxStream.on('data', () => {
              return;
            });
            saxStream.on('end', resolve);
          });

          expect(error).to.be.an.instanceof(FileValidationError);
          expect((error as $TSFixMe).code).to.equal('INVALID_FILE');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the file contain the BOM character', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('streams the file', async function () {
          // @ts-expect-error TS(2304): Cannot find name '__dirname'.
          const path = `${__dirname}/files/xml/bom.xml`;

          const streamer = await SiecleFileStreamer.create(path);

          const text = await read(streamer);

          expect(text).to.equal('<?xml version="1.0" encoding="UTF-8"?>\n');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the encoding is not supported', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it throws an error', async function () {
          // @ts-expect-error TS(2304): Cannot find name '__dirname'.
          const path = `${__dirname}/files/xml/unknown-encoding.xml`;
          const streamer = await SiecleFileStreamer.create(path);

          const error = await catchErr(
            streamer.perform,
            streamer
          )((saxStream: $TSFixMe, resolve: $TSFixMe) => {
            saxStream.on('data', () => {
              return;
            });
            saxStream.on('end', resolve);
          });

          expect(error).to.be.an.instanceof(SiecleXmlImportError);
          expect((error as $TSFixMe).code).to.equal('ENCODING_NOT_SUPPORTED');
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the file is zipped', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('unzip the file', async function () {
        // given
        // @ts-expect-error TS(2304): Cannot find name '__dirname'.
        const path = `${__dirname}/files/zip/valid.zip`;

        // when
        const streamer = await SiecleFileStreamer.create(path);

        const text = await read(streamer);

        expect(text).to.equal('<hello></hello>\n');
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are files with a corrupted entry within zip', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws an error', async function () {
          // given
          // @ts-expect-error TS(2304): Cannot find name '__dirname'.
          const path = `${__dirname}/files/zip/corrupted-entry.zip`;

          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(SiecleFileStreamer.create)(path);

          expect(error).to.be.an.instanceof(FileValidationError);
          expect((error as $TSFixMe).code).to.equal('INVALID_FILE');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are several files in the zip', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws an error', async function () {
          // @ts-expect-error TS(2304): Cannot find name '__dirname'.
          const path = `${__dirname}/files/zip/several-files.zip`;

          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(SiecleFileStreamer.create)(path);

          expect(error).to.be.an.instanceof(FileValidationError);
          expect((error as $TSFixMe).code).to.equal('INVALID_FILE');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is a file name starting with a dot', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('ignores the folder', async function () {
          // @ts-expect-error TS(2304): Cannot find name '__dirname'.
          const path = `${__dirname}/files/zip/hidden-file.zip`;

          const streamer = await SiecleFileStreamer.create(path);

          const text = await read(streamer);

          expect(text).to.equal('<hello></hello>\n');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is en empty folder', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('ignores the folder', async function () {
          // @ts-expect-error TS(2304): Cannot find name '__dirname'.
          const path = `${__dirname}/files/zip/empty-folder.zip`;

          const streamer = await SiecleFileStreamer.create(path);

          const text = await read(streamer);

          expect(text).to.equal('<hello></hello>\n');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the stream is closed perform method is called', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws an error', async function () {
          // @ts-expect-error TS(2304): Cannot find name '__dirname'.
          const path = `${__dirname}/files/zip/valid.zip`;

          const streamer = await SiecleFileStreamer.create(path);

          await read(streamer);
          await streamer.close();

          const error = await catchErr(
            streamer.perform,
            streamer
          )((saxStream: $TSFixMe, resolve: $TSFixMe) => {
            saxStream.on('data', () => {
              return;
            });
            saxStream.on('end', resolve);
          });

          expect(error).to.be.an.instanceof(FileValidationError);
          expect((error as $TSFixMe).code).to.equal('INVALID_FILE');
        });
      });
    });
  });
});

async function read(streamer: $TSFixMe) {
  let accumulator = '';
  await streamer.perform((saxStream: $TSFixMe, resolve: $TSFixMe) => {
    saxStream.on('data', (data: $TSFixMe) => {
      accumulator += data;
    });
    saxStream.on('end', () => {
      resolve();
    });
  });

  return accumulator;
}
