// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JobQueue'.
class JobQueue {
  dependenciesBuilder: $TSFixMe;
  pgBoss: $TSFixMe;
  constructor(pgBoss: $TSFixMe, dependenciesBuilder: $TSFixMe) {
    this.pgBoss = pgBoss;
    this.dependenciesBuilder = dependenciesBuilder;
  }

  performJob(name: $TSFixMe, handlerClass: $TSFixMe) {
    this.pgBoss.work(name, (job: $TSFixMe) => {
      const promise = DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
        const handler = this.dependenciesBuilder.build(handlerClass, domainTransaction);
        await handler.handle(job.data);
      });

      promise.then(() => job.done()).catch((error: $TSFixMe) => job.done(error));
      return promise;
    });
  }

  async stop() {
    await this.pgBoss.stop({ graceful: false, timeout: 1000 });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = JobQueue;
