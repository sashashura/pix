// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const CertificationChallengeBookshelf = require('../orm-models/CertificationChallenge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentEndedError } = require('../../domain/errors');

const logContext = {
  zone: 'certificationChallengeRepository.getNextNonAnsweredChallengeByCourseId',
  type: 'repository',
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save({
    certificationChallenge,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    const certificationChallengeToSave = new CertificationChallengeBookshelf({
      challengeId: certificationChallenge.challengeId,
      competenceId: certificationChallenge.competenceId,
      associatedSkillName: certificationChallenge.associatedSkillName,
      associatedSkillId: certificationChallenge.associatedSkillId,
      courseId: certificationChallenge.courseId,
      certifiableBadgeKey: certificationChallenge.certifiableBadgeKey,
    });
    const savedCertificationChallenge = await certificationChallengeToSave.save(null, {
      transacting: domainTransaction.knexTransaction,
    });
    return bookshelfToDomainConverter.buildDomainObject(CertificationChallengeBookshelf, savedCertificationChallenge);
  },

  async getNextNonAnsweredChallengeByCourseId(assessmentId: $TSFixMe, courseId: $TSFixMe) {
    const answeredChallengeIds = Bookshelf.knex('answers').select('challengeId').where({ assessmentId });

    const certificationChallenge = await CertificationChallengeBookshelf.where({ courseId })
      .query((knex: $TSFixMe) => knex.whereNotIn('challengeId', answeredChallengeIds))
      .orderBy('id', 'asc')
      .fetch({ require: false });

    if (certificationChallenge === null) {
      logger.trace(logContext, 'no found challenges');
      throw new AssessmentEndedError();
    }

    (logContext as $TSFixMe).challengeId = certificationChallenge.id;
    logger.trace(logContext, 'found challenge');
    return bookshelfToDomainConverter.buildDomainObject(CertificationChallengeBookshelf, certificationChallenge);
  },
};
