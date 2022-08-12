// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { S3Client } = require('@aws-sdk/client-s3');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { Upload } = require('@aws-sdk/lib-storage');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cpf'.
const { cpf } = require('../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../logger');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  upload: async function ({
    filename,
    writableStream
  }: $TSFixMe) {
    const { accessKeyId, secretAccessKey, endpoint, region, bucket } = cpf.storage;
    const s3Client = new S3Client({
      credentials: { accessKeyId, secretAccessKey },
      endpoint,
      region,
    });

    const upload = new Upload({
      client: s3Client,
      params: { Key: filename, Bucket: bucket, ContentType: 'text/xml', Body: writableStream },
    });

    upload.on('httpUploadProgress', (progress: $TSFixMe) => logger.trace(progress));

    await upload.done();
  },
};
