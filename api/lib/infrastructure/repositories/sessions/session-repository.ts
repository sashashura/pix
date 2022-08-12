// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../db/knex-database-connection');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfSession = require('../../orm-models/Session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Session'.
const Session = require('../../../domain/models/Session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenter = require('../../../domain/models/CertificationCenter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../../../domain/models/CertificationCandidate');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(sessionData: $TSFixMe) {
    sessionData = _.omit(sessionData, ['certificationCandidates']);

    const newSession = await new BookshelfSession(sessionData).save();
    return bookshelfToDomainConverter.buildDomainObject(BookshelfSession, newSession);
  },

  async isSessionCodeAvailable(accessCode: $TSFixMe) {
    const sessionWithAccessCode = await BookshelfSession.where({ accessCode }).fetch({ require: false });

    return !sessionWithAccessCode;
  },

  async isFinalized(id: $TSFixMe) {
    const session = await BookshelfSession.query((qb: $TSFixMe) => {
      qb.where({ id });
      qb.whereRaw('?? IS NOT NULL', ['finalizedAt']);
    }).fetch({ require: false, columns: 'id' });
    return Boolean(session);
  },

  async get(sessionId: $TSFixMe) {
    try {
      const session = await BookshelfSession.where({ id: sessionId }).fetch();
      return bookshelfToDomainConverter.buildDomainObject(BookshelfSession, session);
    } catch (err) {
      if (err instanceof BookshelfSession.NotFoundError) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        throw new NotFoundError("La session n'existe pas ou son accès est restreint");
      }
      throw err;
    }
  },

  async getWithCertificationCandidates(sessionId: $TSFixMe) {
    const session = await knex.from('sessions').where({ 'sessions.id': sessionId }).first();

    if (!session) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError("La session n'existe pas ou son accès est restreint");
    }

    const certificationCandidates = await knex
      .select('certification-candidates.*')
      .select({
        complementaryCertifications: knex.raw(`
        json_agg(json_build_object('id', "complementary-certifications"."id", 'label', "complementary-certifications"."label", 'key', "complementary-certifications"."key"))
        `),
      })
      .from('certification-candidates')
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
      .groupBy('certification-candidates.id')
      .where({ sessionId })
      .orderByRaw('LOWER(??) ASC, LOWER(??) ASC', ['lastName', 'firstName']);

    return _toDomain({ ...session, certificationCandidates });
  },

  async updateSessionInfo(session: $TSFixMe) {
    const sessionDataToUpdate = _.pick(session, [
      'address',
      'room',
      'accessCode',
      'examiner',
      'date',
      'time',
      'description',
    ]);

    let updatedSession = await new BookshelfSession({ id: session.id }).save(sessionDataToUpdate, {
      patch: true,
      method: 'update',
    });
    updatedSession = await updatedSession.refresh();
    return bookshelfToDomainConverter.buildDomainObject(BookshelfSession, updatedSession);
  },

  async doesUserHaveCertificationCenterMembershipForSession(userId: $TSFixMe, sessionId: $TSFixMe) {
    const session = await BookshelfSession.where({
      'sessions.id': sessionId,
      'certification-center-memberships.userId': userId,
      'certification-center-memberships.disabledAt': null,
    })
      .query((qb: $TSFixMe) => {
        qb.innerJoin('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId');
        qb.innerJoin(
          'certification-center-memberships',
          'certification-center-memberships.certificationCenterId',
          'certification-centers.id'
        );
      })
      .fetch({ require: false, columns: 'sessions.id' });
    return Boolean(session);
  },

  async finalize({
    id,
    examinerGlobalComment,
    hasIncident,
    hasJoiningIssue,
    finalizedAt
  }: $TSFixMe) {
    let updatedSession = await new BookshelfSession({ id }).save(
      { examinerGlobalComment, hasIncident, hasJoiningIssue, finalizedAt },
      { patch: true }
    );
    updatedSession = await updatedSession.refresh();
    return bookshelfToDomainConverter.buildDomainObject(BookshelfSession, updatedSession);
  },

  async flagResultsAsSentToPrescriber({
    id,
    resultsSentToPrescriberAt
  }: $TSFixMe) {
    let flaggedSession = await new BookshelfSession({ id }).save({ resultsSentToPrescriberAt }, { patch: true });
    flaggedSession = await flaggedSession.refresh();
    return bookshelfToDomainConverter.buildDomainObject(BookshelfSession, flaggedSession);
  },

  async updatePublishedAt({
    id,
    publishedAt
  }: $TSFixMe) {
    let publishedSession = await new BookshelfSession({ id }).save({ publishedAt }, { patch: true });
    publishedSession = await publishedSession.refresh();
    return bookshelfToDomainConverter.buildDomainObject(BookshelfSession, publishedSession);
  },

  async isSco({
    sessionId
  }: $TSFixMe) {
    const result = await knex
      .select('certification-centers.type')
      .from('sessions')
      .where('sessions.id', '=', sessionId)
      .innerJoin('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
      .first();

    return result.type === (CertificationCenter as $TSFixMe).types.SCO;
  },

  async delete(sessionId: $TSFixMe) {
    await knex.transaction(async (trx: $TSFixMe) => {
      const certificationCandidateIdsInSession = await knex('certification-candidates')
        .where({ sessionId })
        .pluck('id');
      const supervisorAccessIds = await knex('supervisor-accesses').where({ sessionId }).pluck('id');

      if (supervisorAccessIds) {
        await trx('supervisor-accesses').whereIn('id', supervisorAccessIds).del();
      }

      if (certificationCandidateIdsInSession.length) {
        await trx('complementary-certification-subscriptions')
          .whereIn('certificationCandidateId', certificationCandidateIdsInSession)
          .del();
        await trx('certification-candidates').whereIn('id', certificationCandidateIdsInSession).del();
      }
      const nbSessionsDeleted = await trx('sessions').where('id', sessionId).del();
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
      if (nbSessionsDeleted === 0) throw new NotFoundError();
    });

    return;
  },
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(results: $TSFixMe) {
  const toDomainCertificationCandidates = results.certificationCandidates
    .filter((candidateData: $TSFixMe) => candidateData != null)
    .map(
      (candidateData: $TSFixMe) => new CertificationCandidate({
        ...candidateData,
        complementaryCertifications: candidateData.complementaryCertifications.filter(
          (complementaryCertification: $TSFixMe) => complementaryCertification.id != null
        ),
      })
    );

  return new Session({
    ...results,
    certificationCandidates: toDomainCertificationCandidates,
  });
}
