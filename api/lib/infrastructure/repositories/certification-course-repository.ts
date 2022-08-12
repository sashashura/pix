// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const { _ } = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourseBookshelf = require('../orm-models/CertificationCourse');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const AssessmentBookshelf = require('../orm-models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourse = require('../../domain/models/CertificationCourse');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationChallengeRepository = require('./certification-challenge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../domain/models/CertificationIssueReport');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourse = require('../../domain/models/ComplementaryCertificationCourse');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save({
    certificationCourse,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    const knexConn = domainTransaction.knexTransaction || Bookshelf.knex;
    const certificationCourseToSaveDTO = _adaptModelToDb(certificationCourse);
    const options = { transacting: domainTransaction.knexTransaction };
    const savedCertificationCourseDTO = await new CertificationCourseBookshelf(certificationCourseToSaveDTO).save(
      null,
      options
    );

    const complementaryCertificationCourses = certificationCourse
      .toDTO()
      .complementaryCertificationCourses.map(({
      complementaryCertificationId
    }: $TSFixMe) => ({
        complementaryCertificationId,
        certificationCourseId: savedCertificationCourseDTO.id,
      }));

    if (!_.isEmpty(complementaryCertificationCourses)) {
      await knexConn('complementary-certification-courses').insert(complementaryCertificationCourses);
    }

    const savedChallenges = await bluebird.mapSeries(
      certificationCourse.toDTO().challenges,
      (certificationChallenge: $TSFixMe) => {
        const certificationChallengeWithCourseId = {
          ...certificationChallenge,
          courseId: savedCertificationCourseDTO.id,
        };
        return certificationChallengeRepository.save({
          certificationChallenge: certificationChallengeWithCourseId,
          domainTransaction,
        });
      }
    );

    const savedCertificationCourse = toDomain(savedCertificationCourseDTO);
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    savedCertificationCourse._challenges = savedChallenges;
    return savedCertificationCourse;
  },

  async changeCompletionDate(
    certificationCourseId: $TSFixMe,
    completedAt = null,
    domainTransaction = DomainTransaction.emptyTransaction()
  ) {
    const certificationCourseBookshelf = new CertificationCourseBookshelf({ id: certificationCourseId, completedAt });
    const savedCertificationCourse = await certificationCourseBookshelf.save(null, {
      transacting: domainTransaction.knexTransaction,
    });
    return toDomain(savedCertificationCourse);
  },

  async get(id: $TSFixMe) {
    try {
      const certificationCourseBookshelf = await CertificationCourseBookshelf.where({ id }).fetch({
        withRelated: ['assessment', 'challenges', 'certificationIssueReports', 'complementaryCertificationCourses'],
      });
      return toDomain(certificationCourseBookshelf);
    } catch (bookshelfError) {
      if (bookshelfError instanceof CertificationCourseBookshelf.NotFoundError) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        throw new NotFoundError(`Certification course of id ${id} does not exist.`);
      }
      throw bookshelfError;
    }
  },

  async getCreationDate(id: $TSFixMe) {
    const row = await knex('certification-courses').select('createdAt').where({ id }).first();
    if (!row) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Certification course of id ${id} does not exist.`);
    }

    return row.createdAt;
  },

  async findOneCertificationCourseByUserIdAndSessionId({
    userId,
    sessionId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    const certificationCourse = await CertificationCourseBookshelf.where({ userId, sessionId })
      .orderBy('createdAt', 'desc')
      .fetch({
        require: false,
        withRelated: ['assessment', 'challenges'],
        transacting: domainTransaction.knexTransaction,
      });
    return toDomain(certificationCourse);
  },

  async update(certificationCourse: $TSFixMe) {
    const certificationCourseData = _pickUpdatableProperties(certificationCourse);
    const certificationCourseBookshelf = new CertificationCourseBookshelf(certificationCourseData);
    try {
      const certificationCourse = await certificationCourseBookshelf.save();
      return toDomain(certificationCourse);
    } catch (err) {
      if (err instanceof CertificationCourseBookshelf.NoRowsUpdatedError) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        throw new NotFoundError(`No rows updated for certification course of id ${certificationCourse.getId()}.`);
      }
      throw err;
    }
  },

  async isVerificationCodeAvailable(verificationCode: $TSFixMe) {
    const exist = await knex('certification-courses')
      .select('id')
      .whereRaw('UPPER(??)=?', ['verificationCode', verificationCode.toUpperCase()])
      .first();

    return !exist;
  },

  async findCertificationCoursesBySessionId({
    sessionId
  }: $TSFixMe) {
    const bookshelfCertificationCourses = await CertificationCourseBookshelf.where({ sessionId }).fetchAll();
    return bookshelfCertificationCourses.map(toDomain);
  },

  toDomain,
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'toDomain'.
function toDomain(bookshelfCertificationCourse: $TSFixMe) {
  if (!bookshelfCertificationCourse) {
    return null;
  }

  const assessment = bookshelfToDomainConverter.buildDomainObject(
    AssessmentBookshelf,
    bookshelfCertificationCourse.related('assessment')
  );
  const dbCertificationCourse = bookshelfCertificationCourse.toJSON();
  return new CertificationCourse({
    assessment,
    challenges: bookshelfCertificationCourse.related('challenges').toJSON(),
    certificationIssueReports: bookshelfCertificationCourse
      .related('certificationIssueReports')
      .toJSON()
      .map((json: $TSFixMe) => new CertificationIssueReport(json)),
    complementaryCertificationCourses: bookshelfCertificationCourse
      .related('complementaryCertificationCourses')
      .toJSON()
      .map((json: $TSFixMe) => new ComplementaryCertificationCourse(json)),
    ..._.pick(dbCertificationCourse, [
      'id',
      'userId',
      'createdAt',
      'completedAt',
      'firstName',
      'lastName',
      'birthplace',
      'birthdate',
      'sex',
      'birthPostalCode',
      'birthINSEECode',
      'birthCountry',
      'sessionId',
      'externalId',
      'isPublished',
      'isV2Certification',
      'hasSeenEndTestScreen',
      'isCancelled',
      'maxReachableLevelOnCertificationDate',
      'verificationCode',
      'abortReason',
    ]),
  });
}

function _adaptModelToDb(certificationCourse: $TSFixMe) {
  return _.omit(certificationCourse.toDTO(), [
    'complementaryCertificationCourses',
    'certificationIssueReports',
    'assessment',
    'challenges',
    'createdAt',
  ]);
}

function _pickUpdatableProperties(certificationCourse: $TSFixMe) {
  return _.pick(certificationCourse.toDTO(), [
    'id',
    'isCancelled',
    'birthdate',
    'birthplace',
    'firstName',
    'lastName',
    'sex',
    'birthCountry',
    'birthINSEECode',
    'birthPostalCode',
    'abortReason',
    'completedAt',
  ]);
}
