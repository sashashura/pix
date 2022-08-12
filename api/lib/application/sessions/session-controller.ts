// @ts-expect-error TS(6200): Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadRequest... Remove this comment to see the full error message
const { BadRequestError, SessionPublicationBatchError } = require('../http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionRes... Remove this comment to see the full error message
const sessionResultsLinkService = require('../../domain/services/session-results-link-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionVal... Remove this comment to see the full error message
const sessionValidator = require('../../domain/validators/session-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'events'.
const events = require('../../domain/events');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCandidateAlreadyLinkedToUserError } = require('../../domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionSerializer = require('../../infrastructure/serializers/jsonapi/session-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const jurySessionSerializer = require('../../infrastructure/serializers/jsonapi/jury-session-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCandidateSerializer = require('../../infrastructure/serializers/jsonapi/certification-candidate-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationReportSerializer = require('../../infrastructure/serializers/jsonapi/certification-report-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const juryCertificationSummarySerializer = require('../../infrastructure/serializers/jsonapi/jury-certification-summary-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'juryCertif... Remove this comment to see the full error message
const juryCertificationSummaryRepository = require('../../infrastructure/repositories/jury-certification-summary-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jurySessio... Remove this comment to see the full error message
const jurySessionRepository = require('../../infrastructure/repositories/sessions/jury-session-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../infrastructure/utils/query-params-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'requestRes... Remove this comment to see the full error message
const requestResponseUtils = require('../../infrastructure/utils/request-response-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationResultUtils = require('../../infrastructure/utils/csv/certification-results');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fillCandid... Remove this comment to see the full error message
const fillCandidatesImportSheet = require('../../infrastructure/files/candidates-import/fill-candidates-import-sheet');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const supervisorKitPdf = require('../../infrastructure/utils/pdf/supervisor-kit-pdf');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'trim'.
const trim = require('lodash/trim');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserLinked... Remove this comment to see the full error message
const UserLinkedToCertificationCandidate = require('../../domain/events/UserLinkedToCertificationCandidate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findPaginatedFilteredJurySessions(request: $TSFixMe) {
    const { filter, page } = queryParamsUtils.extractParameters(request.query);
    const normalizedFilters = sessionValidator.validateAndNormalizeFilters(filter);
    const jurySessionsForPaginatedList = await jurySessionRepository.findPaginatedFiltered({
      filters: normalizedFilters,
      page,
    });

    return jurySessionSerializer.serializeForPaginatedList(jurySessionsForPaginatedList);
  },

  async getJurySession(request: $TSFixMe) {
    const sessionId = request.params.id;
    const { jurySession, hasSupervisorAccess } = await usecases.getJurySession({ sessionId });

    return jurySessionSerializer.serialize(jurySession, hasSupervisorAccess);
  },

  async get(request: $TSFixMe) {
    const sessionId = request.params.id;
    const { session, hasSupervisorAccess } = await usecases.getSession({ sessionId });
    return sessionSerializer.serialize(session, hasSupervisorAccess);
  },

  async save(request: $TSFixMe) {
    const userId = request.auth.credentials.userId;
    const session = sessionSerializer.deserialize(request.payload);

    const newSession = await usecases.createSession({ userId, session });

    return sessionSerializer.serialize(newSession);
  },

  async update(request: $TSFixMe) {
    const userId = request.auth.credentials.userId;
    const session = sessionSerializer.deserialize(request.payload);
    session.id = request.params.id;

    const updatedSession = await usecases.updateSession({ userId, session });

    return sessionSerializer.serialize(updatedSession);
  },

  async getAttendanceSheet(request: $TSFixMe, h: $TSFixMe) {
    const sessionId = request.params.id;
    const token = request.query.accessToken;
    const userId = tokenService.extractUserId(token);
    const attendanceSheet = await usecases.getAttendanceSheet({ sessionId, userId });

    const fileName = `feuille-emargement-session-${sessionId}.ods`;
    return h
      .response(attendanceSheet)
      .header('Content-Type', 'application/vnd.oasis.opendocument.spreadsheet')
      .header('Content-Disposition', `attachment; filename=${fileName}`);
  },

  async getSupervisorKitPdf(request: $TSFixMe, h: $TSFixMe) {
    const sessionId = request.params.id;
    const token = request.query.accessToken;
    const userId = tokenService.extractUserId(token);
    const sessionForSupervisorKit = await usecases.getSupervisorKitSessionInfo({ sessionId, userId });

    const { buffer, fileName } = await supervisorKitPdf.getSupervisorKitPdfBuffer({
      sessionForSupervisorKit,
    });

    return h
      .response(buffer)
      .header('Content-Disposition', `attachment; filename=${fileName}`)
      .header('Content-Type', 'application/pdf');
  },

  async getCandidatesImportSheet(request: $TSFixMe, h: $TSFixMe) {
    const sessionId = request.params.id;
    const token = request.query.accessToken;
    const userId = tokenService.extractUserId(token);

    const { session, certificationCenterHabilitations, isScoCertificationCenter } =
      await usecases.getCandidateImportSheetData({
        sessionId,
        userId,
      });
    const candidateImportSheet = await fillCandidatesImportSheet({
      session,
      certificationCenterHabilitations,
      isScoCertificationCenter,
    });

    return h
      .response(candidateImportSheet)
      .header('Content-Type', 'application/vnd.oasis.opendocument.spreadsheet')
      .header('Content-Disposition', 'attachment; filename=liste-candidats-session-' + sessionId + '.ods');
  },

  async getCertificationCandidates(request: $TSFixMe) {
    const sessionId = request.params.id;

    const certificationCandidates = await usecases.getSessionCertificationCandidates({ sessionId });
    return certificationCandidateSerializer.serialize(certificationCandidates);
  },

  async addCertificationCandidate(request: $TSFixMe, h: $TSFixMe) {
    const sessionId = request.params.id;
    const certificationCandidate = await certificationCandidateSerializer.deserialize(request.payload);
    const complementaryCertifications = request.payload.data.attributes['complementary-certifications'] ?? [];
    const addedCertificationCandidate = await usecases.addCertificationCandidateToSession({
      sessionId,
      certificationCandidate,
      complementaryCertifications,
    });

    return h.response(certificationCandidateSerializer.serialize(addedCertificationCandidate)).created();
  },

  async deleteCertificationCandidate(request: $TSFixMe) {
    const certificationCandidateId = request.params.certificationCandidateId;

    await usecases.deleteUnlinkedCertificationCandidate({ certificationCandidateId });

    return null;
  },

  async getJuryCertificationSummaries(request: $TSFixMe) {
    const sessionId = request.params.id;

    const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(sessionId);

    return juryCertificationSummarySerializer.serialize(juryCertificationSummaries);
  },

  async generateSessionResultsDownloadLink(request: $TSFixMe, h: $TSFixMe) {
    const sessionId = request.params.id;
    const sessionResultsLink = sessionResultsLinkService.generateResultsLink(sessionId);

    return h.response({ sessionResultsLink });
  },

  async getSessionResultsToDownload(request: $TSFixMe, h: $TSFixMe) {
    const token = request.params.token;
    const { sessionId } = tokenService.extractSessionId(token);
    const { session, certificationResults } = await usecases.getSessionResults({ sessionId });

    const csvResult = await certificationResultUtils.getSessionCertificationResultsCsv({
      session,
      certificationResults,
    });

    const dateWithTime = moment(session.date + ' ' + session.time, 'YYYY-MM-DD HH:mm');
    const fileName = `${dateWithTime.format('YYYYMMDD_HHmm')}_resultats_session_${sessionId}.csv`;

    return h
      .response(csvResult)
      .header('Content-Type', 'text/csv;charset=utf-8')
      .header('Content-Disposition', `attachment; filename=${fileName}`);
  },

  async getSessionResultsByRecipientEmail(request: $TSFixMe, h: $TSFixMe) {
    const token = request.params.token;
    const { resultRecipientEmail, sessionId } = tokenService.extractResultRecipientEmailAndSessionId(token);
    const { session, certificationResults } = await usecases.getSessionResultsByResultRecipientEmail({
      sessionId,
      resultRecipientEmail,
    });
    const csvResult = await certificationResultUtils.getSessionCertificationResultsCsv({
      session,
      certificationResults,
    });

    const dateWithTime = moment(session.date + ' ' + session.time, 'YYYY-MM-DD HH:mm');
    const fileName = `${dateWithTime.format('YYYYMMDD_HHmm')}_resultats_session_${sessionId}.csv`;

    return h
      .response(csvResult)
      .header('Content-Type', 'text/csv;charset=utf-8')
      .header('Content-Disposition', `attachment; filename=${fileName}`);
  },

  async getCertificationReports(request: $TSFixMe) {
    const sessionId = request.params.id;

    return usecases
      .getSessionCertificationReports({ sessionId })
      .then((certificationReports: $TSFixMe) => certificationReportSerializer.serialize(certificationReports));
  },

  async importCertificationCandidatesFromCandidatesImportSheet(request: $TSFixMe) {
    const sessionId = request.params.id;
    const odsBuffer = request.payload.file;

    try {
      await usecases.importCertificationCandidatesFromCandidatesImportSheet({ sessionId, odsBuffer });
    } catch (err) {
      if (err instanceof CertificationCandidateAlreadyLinkedToUserError) {
        throw new BadRequestError((err as $TSFixMe).message);
      }
      throw err;
    }

    return null;
  },

  async enrollStudentsToSession(request: $TSFixMe, h: $TSFixMe) {
    const referentId = requestResponseUtils.extractUserIdFromRequest(request);
    const sessionId = request.params.id;
    const studentIds = request.payload.data.attributes['student-ids'];

    await usecases.enrollStudentsToSession({ sessionId, referentId, studentIds });
    const certificationCandidates = await usecases.getSessionCertificationCandidates({ sessionId });
    const certificationCandidatesSerialized = certificationCandidateSerializer.serialize(certificationCandidates);
    return h.response(certificationCandidatesSerialized).created();
  },

  async createCandidateParticipation(request: $TSFixMe, h: $TSFixMe) {
    const userId = request.auth.credentials.userId;
    const sessionId = request.params.id;
    const firstName = trim(request.payload.data.attributes['first-name']);
    const lastName = trim(request.payload.data.attributes['last-name']);
    const birthdate = request.payload.data.attributes['birthdate'];

    const event = await usecases.linkUserToSessionCertificationCandidate({
      userId,
      sessionId,
      firstName,
      lastName,
      birthdate,
    });

    const certificationCandidate = await usecases.getCertificationCandidate({ userId, sessionId });
    const serialized = await certificationCandidateSerializer.serialize(certificationCandidate);
    return event instanceof UserLinkedToCertificationCandidate ? h.response(serialized).created() : serialized;
  },

  async finalize(request: $TSFixMe, h: $TSFixMe) {
    const sessionId = request.params.id;
    const examinerGlobalComment = request.payload.data.attributes['examiner-global-comment'];
    const hasIncident = request.payload.data.attributes['has-incident'];
    const hasJoiningIssue = request.payload.data.attributes['has-joining-issue'];
    const certificationReports = await Promise.all(
      (request.payload.data.included || [])
        .filter((data: $TSFixMe) => data.type === 'certification-reports')
        .map((data: $TSFixMe) => certificationReportSerializer.deserialize({ data }))
    );

    const event = await usecases.finalizeSession({
      sessionId,
      examinerGlobalComment,
      hasIncident,
      hasJoiningIssue,
      certificationReports,
    });
    await events.eventDispatcher.dispatch(event);
    return h.response().code(200);
  },

  async publish(request: $TSFixMe) {
    const sessionId = request.params.id;

    const session = await usecases.publishSession({ sessionId });

    return sessionSerializer.serialize(session);
  },

  async publishInBatch(request: $TSFixMe, h: $TSFixMe) {
    const sessionIds = request.payload.data.attributes.ids;
    const result = await usecases.publishSessionsInBatch({
      sessionIds,
    });
    if (result.hasPublicationErrors()) {
      _logSessionBatchPublicationErrors(result);
      throw new SessionPublicationBatchError(result.batchId);
    }
    return h.response().code(204);
  },

  async unpublish(request: $TSFixMe) {
    const sessionId = request.params.id;

    const session = await usecases.unpublishSession({ sessionId });

    return sessionSerializer.serialize(session);
  },

  async flagResultsAsSentToPrescriber(request: $TSFixMe, h: $TSFixMe) {
    const sessionId = request.params.id;
    const { resultsFlaggedAsSent, session } = await usecases.flagSessionResultsAsSentToPrescriber({ sessionId });
    const serializedSession = await sessionSerializer.serialize(session);
    return resultsFlaggedAsSent ? h.response(serializedSession).created() : serializedSession;
  },

  async assignCertificationOfficer(request: $TSFixMe) {
    const sessionId = request.params.id;
    const certificationOfficerId = request.auth.credentials.userId;
    const jurySession = await usecases.assignCertificationOfficerToJurySession({ sessionId, certificationOfficerId });
    return jurySessionSerializer.serialize(jurySession);
  },

  async commentAsJury(request: $TSFixMe, h: $TSFixMe) {
    const sessionId = request.params.id;
    const juryCommentAuthorId = request.auth.credentials.userId;
    const juryComment = request.payload['jury-comment'];
    await usecases.commentSessionAsJury({ sessionId, juryCommentAuthorId, juryComment });

    return h.response().code(204);
  },

  async delete(request: $TSFixMe, h: $TSFixMe) {
    const sessionId = request.params.id;

    await usecases.deleteSession({ sessionId });

    return h.response().code(204);
  },

  async deleteJuryComment(request: $TSFixMe, h: $TSFixMe) {
    const sessionId = request.params.id;
    await usecases.deleteSessionJuryComment({ sessionId });

    return h.response().code(204);
  },
};

function _logSessionBatchPublicationErrors(result: $TSFixMe) {
  logger.warn(`One or more error occurred when publishing session in batch ${result.batchId}`);

  const sessionAndError = result.publicationErrors;
  for (const sessionId in sessionAndError) {
    logger.warn(
      {
        batchId: result.batchId,
        sessionId,
      },
      sessionAndError[sessionId].message
    );
  }
}
