// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalize'... Remove this comment to see the full error message
const { normalize } = require('../utils/string-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const CertificationCandidateBookshelf = require('../orm-models/CertificationCandidate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../../infrastructure/utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PGSQL_UNIQ... Remove this comment to see the full error message
const { PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR } = require('../../../db/pgsql-errors');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCandidateCreationOrUpdateError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCandidateMultipleUserLinksWithinSessionError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../../domain/models/CertificationCandidate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertification = require('../../domain/models/ComplementaryCertification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async linkToUser({
    id,
    userId
  }: $TSFixMe) {
    try {
      const certificationCandidateBookshelf = new CertificationCandidateBookshelf({ id });
      await certificationCandidateBookshelf.save({ userId }, { patch: true, method: 'update' });
    } catch (bookshelfError) {
      if ((bookshelfError as $TSFixMe).code === PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR) {
        throw new CertificationCandidateMultipleUserLinksWithinSessionError(
          'A user cannot be linked to several certification candidates within the same session'
        );
      }
      throw new CertificationCandidateCreationOrUpdateError(
        'An error occurred while linking the certification candidate to a user'
      );
    }
  },

  async saveInSession({
    certificationCandidate,
    sessionId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    const certificationCandidateDataToSave = _adaptModelToDb(certificationCandidate);

    try {
      const insertCertificationCandidateQuery = knex('certification-candidates')
        .insert({ ...certificationCandidateDataToSave, sessionId })
        .returning('*');

      if (domainTransaction.knexTransaction) {
        insertCertificationCandidateQuery.transacting(domainTransaction.knexTransaction);
      }

      const [addedCertificationCandidate] = await insertCertificationCandidateQuery;

      if (!_.isEmpty(certificationCandidate.complementaryCertifications)) {
        const complementaryCertificationSubscriptionsToSave = certificationCandidate.complementaryCertifications.map(
          (complementaryCertification: $TSFixMe) => {
            return {
              complementaryCertificationId: complementaryCertification.id,
              certificationCandidateId: addedCertificationCandidate.id,
            };
          }
        );

        const insertComplementaryCertificationSubscriptionQuery = knex(
          'complementary-certification-subscriptions'
        ).insert(complementaryCertificationSubscriptionsToSave);

        if (domainTransaction.knexTransaction) {
          insertComplementaryCertificationSubscriptionQuery.transacting(domainTransaction.knexTransaction);
        }

        await insertComplementaryCertificationSubscriptionQuery;
      }

      return new CertificationCandidate(addedCertificationCandidate);
    } catch (error) {
      logger.error(error);
      throw new CertificationCandidateCreationOrUpdateError(
        'An error occurred while saving the certification candidate in a session'
      );
    }
  },

  async delete(certificationCandidateId: $TSFixMe) {
    await knex.transaction(async (trx: $TSFixMe) => {
      await trx('complementary-certification-subscriptions').where({ certificationCandidateId }).del();
      return trx('certification-candidates').where({ id: certificationCandidateId }).del();
    });

    return true;
  },

  async isNotLinked(certificationCandidateId: $TSFixMe) {
    const notLinkedCandidate = await CertificationCandidateBookshelf.where({
      id: certificationCandidateId,
      userId: null,
    }).fetch({ require: false, columns: ['id'] });

    return !!notLinkedCandidate;
  },

  async getBySessionIdAndUserId({
    sessionId,
    userId
  }: $TSFixMe) {
    const certificationCandidate = await knex
      .select('certification-candidates.*')
      .select({ complementaryCertifications: knex.raw(`json_agg("complementary-certifications".*)`) })
      .from('certification-candidates')
      .leftJoin(
        'complementary-certification-subscriptions',
        'certification-candidates.id',
        'complementary-certification-subscriptions.certificationCandidateId'
      )
      .leftJoin(
        'complementary-certifications',
        'complementary-certification-subscriptions.complementaryCertificationId',
        'complementary-certifications.id'
      )
      .where({ sessionId, userId })
      .groupBy('certification-candidates.id')
      .first();
    return certificationCandidate ? _toDomain(certificationCandidate) : undefined;
  },

  async findBySessionId(sessionId: $TSFixMe) {
    const results = await knex
      .select('certification-candidates.*')
      .select({ complementaryCertifications: knex.raw(`json_agg("complementary-certifications".*)`) })
      .from('certification-candidates')
      .where({ 'certification-candidates.sessionId': sessionId })
      .leftJoin(
        'complementary-certification-subscriptions',
        'certification-candidates.id',
        'complementary-certification-subscriptions.certificationCandidateId'
      )
      .leftJoin(
        'complementary-certifications',
        'complementary-certification-subscriptions.complementaryCertificationId',
        'complementary-certifications.id'
      )
      .groupBy('certification-candidates.id')
      .orderByRaw('LOWER("certification-candidates"."lastName") asc')
      .orderByRaw('LOWER("certification-candidates"."firstName") asc');
    return results.map(_toDomain);
  },

  async findBySessionIdAndPersonalInfo({
    sessionId,
    firstName,
    lastName,
    birthdate
  }: $TSFixMe) {
    const results = await CertificationCandidateBookshelf.where({ sessionId, birthdate }).fetchAll();

    const certificationCandidates = _buildCertificationCandidates(results);

    const normalizedInputNames = {
      lastName: normalize(lastName),
      firstName: normalize(firstName),
    };
    return _.filter(certificationCandidates, (certificationCandidate: $TSFixMe) => {
      const certificationCandidateNormalizedNames = {
        lastName: normalize(certificationCandidate.lastName),
        firstName: normalize(certificationCandidate.firstName),
      };
      return _.isEqual(normalizedInputNames, certificationCandidateNormalizedNames);
    });
  },

  findOneBySessionIdAndUserId({
    sessionId,
    userId
  }: $TSFixMe) {
    return CertificationCandidateBookshelf.where({ sessionId, userId })
      .fetchAll()
      .then((results: $TSFixMe) => _buildCertificationCandidates(results)[0]);
  },

  async doesLinkedCertificationCandidateInSessionExist({
    sessionId
  }: $TSFixMe) {
    const anyLinkedCandidateInSession = await CertificationCandidateBookshelf.query({
      where: { sessionId },
      whereNotNull: 'userId',
    }).fetch({ require: false, columns: 'id' });

    return anyLinkedCandidateInSession !== null;
  },

  async update(certificationCandidate: $TSFixMe) {
    const result = await knex('certification-candidates')
      .where({ id: certificationCandidate.id })
      .update({ authorizedToStart: certificationCandidate.authorizedToStart });

    if (result === 0) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError('Aucun candidat trouvé');
    }
  },

  async deleteBySessionId({
    sessionId
  }: $TSFixMe) {
    await knex('complementary-certification-subscriptions')
      .whereIn('certificationCandidateId', knex.select('id').from('certification-candidates').where({ sessionId }))
      .del();

    await knex('certification-candidates').where({ sessionId }).del();
  },

  async getWithComplementaryCertifications(id: $TSFixMe) {
    const candidateData = await knex('certification-candidates')
      .select('certification-candidates.*')
      .select({ complementaryCertifications: knex.raw('json_agg("complementary-certifications".*)') })
      .leftJoin(
        'complementary-certification-subscriptions',
        'complementary-certification-subscriptions.certificationCandidateId',
        'certification-candidates.id'
      )
      .leftJoin(
        'complementary-certifications',
        'complementary-certifications.id',
        'complementary-certification-subscriptions.complementaryCertificationId'
      )
      .where('certification-candidates.id', id)
      .groupBy('certification-candidates.id')
      .first();
    return _toDomain(candidateData);
  },
};

function _buildCertificationCandidates(results: $TSFixMe) {
  if (results?.models[0]) {
    results.models.forEach((model: $TSFixMe, index: $TSFixMe) => {
      results.models[index].attributes.organizationLearnerId = model.attributes.organizationLearnerId;
    });
  }

  return bookshelfToDomainConverter.buildDomainObjects(CertificationCandidateBookshelf, results);
}

function _adaptModelToDb(certificationCandidateToSave: $TSFixMe) {
  return {
    authorizedToStart: certificationCandidateToSave.authorizedToStart,
    billingMode: certificationCandidateToSave.billingMode,
    birthCity: certificationCandidateToSave.birthCity,
    birthCountry: certificationCandidateToSave.birthCountry,
    birthINSEECode: certificationCandidateToSave.birthINSEECode,
    birthPostalCode: certificationCandidateToSave.birthPostalCode,
    birthProvinceCode: certificationCandidateToSave.birthProvinceCode,
    birthdate: certificationCandidateToSave.birthdate,
    email: certificationCandidateToSave.email,
    externalId: certificationCandidateToSave.externalId,
    extraTimePercentage: certificationCandidateToSave.extraTimePercentage,
    firstName: certificationCandidateToSave.firstName,
    lastName: certificationCandidateToSave.lastName,
    prepaymentCode: certificationCandidateToSave.prepaymentCode,
    resultRecipientEmail: certificationCandidateToSave.resultRecipientEmail,
    organizationLearnerId: certificationCandidateToSave.organizationLearnerId,
    sex: certificationCandidateToSave.sex,
  };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(candidateData: $TSFixMe) {
  const complementaryCertifications = candidateData.complementaryCertifications
    .filter((certificationData: $TSFixMe) => certificationData !== null)
    .map((certification: $TSFixMe) => new ComplementaryCertification(certification));

  return new CertificationCandidate({
    ...candidateData,
    complementaryCertifications,
  });
}
