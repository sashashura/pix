// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'axios'.
const axios = require('axios');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const util = require('util');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const streamPipeline = util.promisify(require('stream').pipeline);

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ScalingoDB... Remove this comment to see the full error message
class ScalingoDBClient {
  client: $TSFixMe;
  dbId: $TSFixMe;
  constructor(dbId: $TSFixMe, client: $TSFixMe) {
    this.dbId = dbId;
    this.client = client;
  }

  static getInstance({
    dbId,
    dbToken,
    region
  }: $TSFixMe) {
    const client = axios.create({
      baseURL: `https://db-api.${region}.scalingo.com/api`,
      headers: { Authorization: `Bearer ${dbToken}` },
    });

    return new ScalingoDBClient(dbId, client);
  }

  async getBackups() {
    try {
      const response = await this.client.get(`/databases/${this.dbId}/backups`);
      return response.data.database_backups;
    } catch (error) {
      throw new Error(`Unable to get the backup with Scalingo Database API. Response was ${(error as $TSFixMe).message}`);
    }
  }

  async getBackupDownloadLink(backupId: $TSFixMe) {
    try {
      const response = await this.client.get(`/databases/${this.dbId}/backups/${backupId}/archive`);
      return response.data.download_url;
    } catch (error) {
      throw new Error(`Unable to get the backup download link with Scalingo Database API. Response was ${(error as $TSFixMe).message}`);
    }
  }

  async downloadBackup(backupId: $TSFixMe, output: $TSFixMe) {
    const downloadUrl = await this.getBackupDownloadLink(backupId);

    let downloadResponse;
    try {
      downloadResponse = await axios.get(downloadUrl, { responseType: 'stream' });
    } catch (error) {
      throw new Error(`Unable to download the backup from Scalingo API. Response was ${(error as $TSFixMe).message}`);
    }

    await streamPipeline(downloadResponse.data, fs.createWriteStream(output));
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ScalingoDBClient;
