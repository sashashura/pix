class JobPgBoss {
  name: $TSFixMe;
  queryBuilder: $TSFixMe;
  retryDelay: $TSFixMe;
  retryLimit: $TSFixMe;
  constructor(config: $TSFixMe, queryBuilder: $TSFixMe) {
    this.name = config.name;
    this.retryLimit = config.retryLimit || 0;
    this.retryDelay = config.retryDelay || 30;
    this.queryBuilder = queryBuilder;
  }

  async schedule(data: $TSFixMe) {
    await this.queryBuilder.raw(
      'INSERT INTO pgboss.job (name, data, retryLimit, retryDelay) VALUES (:name, :data, :retryLimit, :retryDelay)',
      {
        name: this.name,
        retryLimit: this.retryLimit,
        retryDelay: this.retryDelay,
        data,
      }
    );
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = JobPgBoss;
