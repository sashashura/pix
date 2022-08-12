// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { Client } = require('pg');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PgClient'.
class PgClient {
  client: $TSFixMe;
  constructor(databaseUrl: $TSFixMe) {
    this.client = new Client({ connectionString: databaseUrl, connectionTimeoutMillis: 10000 });
  }

  static async getClient(databaseUrl: $TSFixMe) {
    const instance = new PgClient(databaseUrl);
    try {
      await instance.client.connect();
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error('Database error', error);
    }
    return instance;
  }

  end() {
    return this.client.end();
  }

  query_and_log(query: $TSFixMe) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`query: ${query}`);
    return this.client.query(query).then((result: $TSFixMe) => {
      const { command, rowCount, rows } = result;
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log(`result: command ${command} (rowCount ${rowCount}) = ${JSON.stringify(rows)}`);
      return result;
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PgClient;
