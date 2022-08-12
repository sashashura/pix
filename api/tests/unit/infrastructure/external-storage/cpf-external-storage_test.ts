// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cpf'.
const { cpf } = require('../../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'proxyquire... Remove this comment to see the full error message
const proxyquire = require('proxyquire');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | external-storage | cpf-external-storage', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#upload', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('it should instantiate a properly configured S3 client', function () {
      // given
      const constructorStub = sinon.stub();
      const cpfExternalStorage = proxyquire('../../../../lib/infrastructure/external-storage/cpf-external-storage', {
        '@aws-sdk/client-s3': {
          S3Client: class S3ClientMock {
            constructor(...args: $TSFixMe[]) {
              constructorStub(...args);
            }
          },
        },
      });

      sinon.stub(cpf, 'storage').value({
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
        endpoint: 'endpoint',
        region: 'region',
        bucket: 'bucket',
      });
      const writableStream = Symbol('writableStream');

      // when
      cpfExternalStorage.upload({ filename: '', writableStream });

      // then
      expect(constructorStub).to.have.been.calledWith({
        credentials: { accessKeyId: 'accessKeyId', secretAccessKey: 'secretAccessKey' },
        endpoint: 'endpoint',
        region: 'region',
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('it should instantiate an Upload with the expected parameters', function () {
      // given
      const constructorStub = sinon.stub();
      const S3ClientMock = class S3ClientMock {};
      const cpfExternalStorage = proxyquire('../../../../lib/infrastructure/external-storage/cpf-external-storage', {
        '@aws-sdk/client-s3': {
          S3Client: S3ClientMock,
        },
        '@aws-sdk/lib-storage': {
          Upload: class UploadMock {
            constructor(...args: $TSFixMe[]) {
              constructorStub(...args);
            }
            on = () => {};
            done = () => {};
          },
        },
      });

      sinon.stub(cpf, 'storage').value({
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
        endpoint: 'endpoint',
        region: 'region',
        bucket: 'bucket',
      });
      const writableStream = Symbol('writableStream');

      // when
      cpfExternalStorage.upload({ filename: 'filename.xml', writableStream });

      // then
      expect(constructorStub).to.have.been.calledWith({
        client: sinon.match(new S3ClientMock()),
        params: { Key: 'filename.xml', Bucket: 'bucket', ContentType: 'text/xml', Body: writableStream },
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('it should call done() when the upload is successfully completed', function () {
      // given
      const doneStub = sinon.stub();
      const cpfExternalStorage = proxyquire('../../../../lib/infrastructure/external-storage/cpf-external-storage', {
        '@aws-sdk/client-s3': {
          S3Client: class S3ClientMock {},
        },
        '@aws-sdk/lib-storage': {
          Upload: class UploadMock {
            on = () => {};
            done = doneStub;
          },
        },
      });

      sinon.stub(cpf, 'storage').value({
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
        endpoint: 'endpoint',
        region: 'region',
        bucket: 'bucket',
      });
      const writableStream = Symbol('writableStream');

      // when
      cpfExternalStorage.upload({ filename: 'filename.xml', writableStream });

      // then
      expect(doneStub).to.have.been.called;
    });
  });
});
