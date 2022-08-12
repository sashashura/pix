// @ts-expect-error TS(6200): Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const { expect, sinon, hFake, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionCon... Remove this comment to see the full error message
const sessionController = require('../../../../lib/application/sessions/session-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Session'.
const Session = require('../../../../lib/domain/models/Session');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/session-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const jurySessionSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/jury-session-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCandidateSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/certification-candidate-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationReportSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/certification-report-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const juryCertificationSummarySerializer = require('../../../../lib/infrastructure/serializers/jsonapi/jury-certification-summary-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../../../lib/infrastructure/utils/query-params-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'requestRes... Remove this comment to see the full error message
const requestResponseUtils = require('../../../../lib/infrastructure/utils/request-response-utils');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionValidator = require('../../../../lib/domain/validators/session-validator');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const juryCertificationSummaryRepository = require('../../../../lib/infrastructure/repositories/jury-certification-summary-repository');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const jurySessionRepository = require('../../../../lib/infrastructure/repositories/sessions/jury-session-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserAlread... Remove this comment to see the full error message
const UserAlreadyLinkedToCertificationCandidate = require('../../../../lib/domain/events/UserAlreadyLinkedToCertificationCandidate');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const UserLinkedToCertificationCandidate = require('../../../../lib/domain/events/UserLinkedToCertificationCandidate');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationResults = require('../../../../lib/infrastructure/utils/csv/certification-results');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../../lib/domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionPub... Remove this comment to see the full error message
const { SessionPublicationBatchResult } = require('../../../../lib/domain/models/SessionPublicationBatchResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionPub... Remove this comment to see the full error message
const { SessionPublicationBatchError } = require('../../../../lib/application/http-errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const supervisorKitPdf = require('../../../../lib/infrastructure/utils/pdf/supervisor-kit-pdf');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | sessionController', function () {
  let request: $TSFixMe;
  let expectedSession: $TSFixMe;
  const userId = 274939274;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      expectedSession = new Session({
        certificationCenter: 'Université de dressage de loutres',
        address: 'Nice',
        room: '28D',
        examiner: 'Antoine Toutvenant',
        date: '2017-12-08',
        time: '14:30',
        description: 'ahah',
        accessCode: 'ABCD12',
      });

      sinon.stub(usecases, 'createSession').resolves();
      sinon.stub(sessionSerializer, 'deserialize').returns(expectedSession);
      sinon.stub(sessionSerializer, 'serialize');

      request = {
        payload: {
          data: {
            type: 'sessions',
            attributes: {
              'certification-center': 'Université de dressage de loutres',
              address: 'Nice',
              room: '28D',
              examiner: 'Antoine Toutvenant',
              date: '2017-12-08',
              time: '14:30',
              description: 'ahah',
            },
          },
        },
        auth: {
          credentials: {
            userId,
          },
        },
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save the session', async function () {
      // when
      await sessionController.save(request, hFake);

      // then
      expect(usecases.createSession).to.have.been.calledWith({ userId, session: expectedSession });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the saved session in JSON API', async function () {
      // given
      const jsonApiSession = {
        data: {
          type: 'sessions',
          id: 12,
          attributes: {},
        },
      };
      const savedSession = new Session({
        id: '12',
        certificationCenter: 'Université de dressage de loutres',
      });

      usecases.createSession.resolves(savedSession);
      sessionSerializer.serialize.returns(jsonApiSession);

      // when
      const response = await sessionController.save(request, hFake);

      // then
      expect(response).to.deep.equal(jsonApiSession);
      expect(sessionSerializer.serialize).to.have.been.calledWith(savedSession);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getJurySession', function () {
    const sessionId = 123;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'getJurySession');
      sinon.stub(jurySessionSerializer, 'serialize');
      request = {
        auth: { credentials: { userId } },
        params: {
          id: sessionId,
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reply serialized session informations', async function () {
        // given
        const foundJurySession = Symbol('foundSession');
        const serializedJurySession = Symbol('serializedSession');
        const hasSupervisorAccess = true;
        usecases.getJurySession
          .withArgs({ sessionId })
          .resolves({ jurySession: foundJurySession, hasSupervisorAccess });
        jurySessionSerializer.serialize.withArgs(foundJurySession, hasSupervisorAccess).resolves(serializedJurySession);

        // when
        const response = await sessionController.getJurySession(request, hFake);

        // then
        expect(response).to.deep.equal(serializedJurySession);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    const sessionId = 123;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'getSession');
      sinon.stub(sessionSerializer, 'serialize');
      request = {
        auth: { credentials: { userId } },
        params: {
          id: sessionId,
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reply serialized session informations', async function () {
        // given
        const foundSession = Symbol('foundSession');
        const serializedSession = Symbol('serializedSession');
        usecases.getSession.withArgs({ sessionId }).resolves({ session: foundSession });
        sessionSerializer.serialize.withArgs(foundSession).resolves(serializedSession);

        // when
        const response = await sessionController.get(request, hFake);

        // then
        expect(response).to.deep.equal(serializedSession);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#update', function () {
    let request: $TSFixMe, updatedSession: $TSFixMe, updateSessionArgs: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      request = {
        auth: { credentials: { userId: 1 } },
        params: { id: 1 },
        payload: {},
      };

      updatedSession = {
        id: request.params.id,
      };

      updateSessionArgs = {
        userId: request.auth.credentials.userId,
        session: updatedSession,
      };

      sinon.stub(usecases, 'updateSession');
      sinon.stub(sessionSerializer, 'deserialize');
      sinon.stub(sessionSerializer, 'serialize');
      sessionSerializer.deserialize.withArgs(request.payload).returns({});
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the updated session', async function () {
      // given
      usecases.updateSession.withArgs(updateSessionArgs).resolves(updatedSession);
      sessionSerializer.serialize.withArgs(updatedSession).returns(updatedSession);

      // when
      const response = await sessionController.update(request, hFake);

      // then
      expect(response).to.deep.equal(updatedSession);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getAttendanceSheet', function () {
    const sessionId = 1;
    const accessToken = 'ABC123';

    let request: $TSFixMe;
    let odsBuffer: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      request = {
        params: { id: sessionId },
        payload: {},
        query: {
          accessToken,
        },
      };

      odsBuffer = Buffer.alloc(5);
      sinon.stub(usecases, 'getAttendanceSheet');
      sinon.stub(tokenService, 'extractUserId').withArgs(accessToken).returns(userId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return the feuille d'émargement", async function () {
      // given
      usecases.getAttendanceSheet.withArgs({ sessionId, userId }).resolves(odsBuffer);

      // when
      const response = await sessionController.getAttendanceSheet(request, hFake);

      // then
      const expectedHeaders = {
        'Content-Disposition': `attachment; filename=feuille-emargement-session-${sessionId}.ods`,
        'Content-Type': 'application/vnd.oasis.opendocument.spreadsheet',
      };
      expect(response.headers).to.deep.equal(expectedHeaders);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#importCertificationCandidatesFromCandidatesImportSheet', function () {
    const sessionId = 2;
    let request: $TSFixMe;
    const odsBuffer = 'File Buffer';
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      request = {
        params: { id: sessionId },
        payload: { file: odsBuffer },
      };

      sinon.stub(usecases, 'importCertificationCandidatesFromCandidatesImportSheet').resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the usecase to import certification candidates', async function () {
      // given
      usecases.importCertificationCandidatesFromCandidatesImportSheet.resolves();

      // when
      await sessionController.importCertificationCandidatesFromCandidatesImportSheet(request);

      // then
      expect(usecases.importCertificationCandidatesFromCandidatesImportSheet).to.have.been.calledWith({
        sessionId,
        odsBuffer,
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCertificationCandidates', function () {
    let request: $TSFixMe;
    const sessionId = 1;
    const certificationCandidates = 'candidates';
    const certificationCandidatesJsonApi = 'candidatesJSONAPI';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      request = {
        params: { id: sessionId },
      };
      sinon
        .stub(usecases, 'getSessionCertificationCandidates')
        .withArgs({ sessionId })
        .resolves(certificationCandidates);
      sinon
        .stub(certificationCandidateSerializer, 'serialize')
        .withArgs(certificationCandidates)
        .returns(certificationCandidatesJsonApi);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return certification candidates', async function () {
      // when
      const response = await sessionController.getCertificationCandidates(request, hFake);

      // then
      expect(response).to.deep.equal(certificationCandidatesJsonApi);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#addCertificationCandidate ', function () {
    let request: $TSFixMe;
    const sessionId = 1;
    const certificationCandidate = 'candidate';
    const addedCertificationCandidate = 'addedCandidate';
    const certificationCandidateJsonApi = 'addedCandidateJSONApi';
    let complementaryCertifications;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      complementaryCertifications = Symbol('complementaryCertifications');
      request = {
        params: { id: sessionId },
        payload: {
          data: {
            attributes: {
              'complementary-certifications': complementaryCertifications,
            },
          },
        },
      };
      sinon.stub(certificationCandidateSerializer, 'deserialize').resolves(certificationCandidate);
      sinon
        .stub(usecases, 'addCertificationCandidateToSession')
        .withArgs({
          sessionId,
          certificationCandidate,
          complementaryCertifications,
        })
        .resolves(addedCertificationCandidate);
      sinon
        .stub(certificationCandidateSerializer, 'serialize')
        .withArgs(addedCertificationCandidate)
        .returns(certificationCandidateJsonApi);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the added certification candidate', async function () {
      // when
      const response = await sessionController.addCertificationCandidate(request, hFake);

      // then
      expect(response.source).to.equal(certificationCandidateJsonApi);
      expect(response.statusCode).to.equal(201);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deleteCertificationCandidate ', function () {
    let request: $TSFixMe;
    const sessionId = 1;
    const certificationCandidateId = 1;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      request = {
        params: { id: sessionId, certificationCandidateId },
      };
      sinon.stub(usecases, 'deleteUnlinkedCertificationCandidate').withArgs({ certificationCandidateId }).resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 when deleting successfully the candidate', async function () {
      // when
      const response = await sessionController.deleteCertificationCandidate(request, hFake);

      // then
      expect(response).to.be.null;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getJuryCertificationSummaries ', function () {
    let request: $TSFixMe;
    const sessionId = 1;
    const juryCertificationSummaries = 'someSummaries';
    const juryCertificationSummariesJSONAPI = 'someSummariesJSONApi';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      request = {
        params: { id: sessionId },
        auth: {
          credentials: {
            userId,
          },
        },
      };
      sinon
        .stub(juryCertificationSummaryRepository, 'findBySessionId')
        .withArgs(sessionId)
        .resolves(juryCertificationSummaries);
      sinon
        .stub(juryCertificationSummarySerializer, 'serialize')
        .withArgs(juryCertificationSummaries)
        .returns(juryCertificationSummariesJSONAPI);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return jury certification summaries', async function () {
      // when
      const response = await sessionController.getJuryCertificationSummaries(request, hFake);

      // then
      expect(response).to.deep.equal(juryCertificationSummariesJSONAPI);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getSessionResultsByRecipientEmail ', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return csv content and fileName', async function () {
      // given
      const session = { id: 1, date: '2020/01/01', time: '12:00' };
      sinon
        .stub(tokenService, 'extractResultRecipientEmailAndSessionId')
        .withArgs('abcd1234')
        .returns({ sessionId: 1, resultRecipientEmail: 'user@example.net' });
      sinon
        .stub(usecases, 'getSessionResultsByResultRecipientEmail')
        .withArgs({ sessionId: session.id, resultRecipientEmail: 'user@example.net' })
        .resolves({
          session,
          certificationResults: [],
          fileName: '20200101_1200_resultats_session_1.csv',
        });
      sinon.stub(certificationResults, 'getSessionCertificationResultsCsv');
      certificationResults.getSessionCertificationResultsCsv
        .withArgs({ session, certificationResults: [] })
        .resolves('csv content');

      // when
      const response = await sessionController.getSessionResultsByRecipientEmail(
        { params: { token: 'abcd1234' } },
        hFake
      );

      // then
      const expectedCsv = 'csv content';
      const expectedHeader = 'attachment; filename=20200101_1200_resultats_session_1.csv';
      expect(response.source.trim()).to.deep.equal(expectedCsv.trim());
      expect(response.headers['Content-Disposition']).to.equal(expectedHeader);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getSessionResultsToDownload ', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return results to download', async function () {
      // given
      const session = { id: 1, date: '2020/01/01', time: '12:00' };
      const sessionId = session.id;
      const fileName = `20200101_1200_resultats_session_${sessionId}.csv`;
      const certificationResults: $TSFixMe = [];
      const token = Symbol('a beautiful token');
      const request = {
        params: { id: sessionId, token },
        auth: {
          credentials: { userId },
        },
      };
      sinon.stub(tokenService, 'extractSessionId').withArgs(token).returns({ sessionId });
      sinon.stub(usecases, 'getSessionResults').withArgs({ sessionId }).resolves({
        session,
        certificationResults,
      });

      // when
      const response = await sessionController.getSessionResultsToDownload(request, hFake);

      // then
      const expectedHeader = `attachment; filename=${fileName}`;
      const expectedCsv =
        '"Numéro de certification";"Prénom";"Nom";"Date de naissance";"Lieu de naissance";"Identifiant Externe";"Statut";"Nombre de Pix";"1.1";"1.2";"1.3";"2.1";"2.2";"2.3";"2.4";"3.1";"3.2";"3.3";"3.4";"4.1";"4.2";"4.3";"5.1";"5.2";"Commentaire jury pour l’organisation";"Session";"Centre de certification";"Date de passage de la certification"';
      expect(response.source.trim()).to.deep.equal(expectedCsv);
      expect(response.headers['Content-Disposition']).to.equal(expectedHeader);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCertificationReports', function () {
    let request: $TSFixMe;
    const sessionId = 1;
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const certificationReports = Symbol('some certification reports');
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const serializedCertificationReports = Symbol('some serialized certification reports');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      request = {
        params: { id: sessionId },
      };
      sinon.stub(usecases, 'getSessionCertificationReports').withArgs({ sessionId }).resolves(certificationReports);
      sinon
        .stub(certificationReportSerializer, 'serialize')
        .withArgs(certificationReports)
        .returns(serializedCertificationReports);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return certification candidates', async function () {
      // when
      const response = await sessionController.getCertificationReports(request, hFake);

      // then
      expect(response).to.deep.equal(serializedCertificationReports);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#enrollStudentsToSession', function () {
    let request: $TSFixMe;
    const sessionId = 1;
    const userId = 2;
    const student1 = { id: 1 };
    const student2 = { id: 2 };
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const studentIds = [student1.id, student2.id];
    const studentList = [student1, student2];
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const serializedCertificationCandidate = Symbol('CertificationCandidates');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      request = {
        params: { id: sessionId },
        auth: {
          credentials: {
            userId,
          },
        },
        payload: {
          data: {
            attributes: {
              'student-ids': [student1.id, student2.id],
            },
          },
        },
      };
      sinon.stub(requestResponseUtils, 'extractUserIdFromRequest');
      sinon.stub(usecases, 'enrollStudentsToSession');
      sinon.stub(usecases, 'getSessionCertificationCandidates');
      sinon.stub(certificationCandidateSerializer, 'serialize');
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user has access to session and there studentIds are corrects', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        requestResponseUtils.extractUserIdFromRequest.withArgs(request).returns(userId);
        usecases.enrollStudentsToSession.withArgs({ sessionId, referentId: userId, studentIds }).resolves();
        usecases.getSessionCertificationCandidates.withArgs({ sessionId }).resolves(studentList);
        certificationCandidateSerializer.serialize.withArgs(studentList).returns(serializedCertificationCandidate);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return certificationCandidates', async function () {
        // when
        const response = await sessionController.enrollStudentsToSession(request, hFake);

        // then
        expect(response.statusCode).to.equal(201);
        expect(response.source).to.deep.equal(serializedCertificationCandidate);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createCandidateParticipation', function () {
    const sessionId = 1;
    const userId = 2;
    let firstName: $TSFixMe;
    let lastName: $TSFixMe;
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const birthdate = Symbol('birthdate');
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const linkedCertificationCandidate = Symbol('candidate');
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const serializedCertificationCandidate = Symbol('sCandidate');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      firstName = 'firstName';
      lastName = 'lastName';
      sinon
        .stub(certificationCandidateSerializer, 'serialize')
        .withArgs(linkedCertificationCandidate)
        .returns(serializedCertificationCandidate);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('trims the firstname and lastname', async function () {
      // given
      firstName = 'firstName     ';
      lastName = 'lastName    ';
      sinon
        .stub(usecases, 'linkUserToSessionCertificationCandidate')
        .withArgs({
          userId,
          sessionId,
          firstName: 'firstName',
          lastName: 'lastName',
          birthdate,
        })
        .resolves(new UserAlreadyLinkedToCertificationCandidate());
      sinon
        .stub(usecases, 'getCertificationCandidate')
        .withArgs({ userId, sessionId })
        .resolves(linkedCertificationCandidate);
      const request = buildRequest(sessionId, userId, firstName, lastName, birthdate);

      // when
      const response = await sessionController.createCandidateParticipation(request, hFake);

      // then
      expect(response).to.equal(serializedCertificationCandidate);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the participation already exists', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        sinon
          .stub(usecases, 'linkUserToSessionCertificationCandidate')
          .withArgs({ userId, sessionId, firstName, lastName, birthdate })
          .resolves(new UserAlreadyLinkedToCertificationCandidate());
        sinon
          .stub(usecases, 'getCertificationCandidate')
          .withArgs({ userId, sessionId })
          .resolves(linkedCertificationCandidate);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a certification candidate', async function () {
        // given
        const request = buildRequest(sessionId, userId, firstName, lastName, birthdate);
        // when
        const response = await sessionController.createCandidateParticipation(request, hFake);

        // then
        expect(response).to.equals(serializedCertificationCandidate);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the participation is created', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        sinon
          .stub(usecases, 'linkUserToSessionCertificationCandidate')
          .withArgs({ userId, sessionId, firstName, lastName, birthdate })
          .resolves(new UserLinkedToCertificationCandidate());
        sinon
          .stub(usecases, 'getCertificationCandidate')
          .withArgs({ userId, sessionId })
          .resolves(linkedCertificationCandidate);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a certification candidate', async function () {
        // given
        const request = buildRequest(sessionId, userId, firstName, lastName, birthdate);

        // when
        const response = await sessionController.createCandidateParticipation(request, hFake);

        // then
        expect(response.statusCode).to.equal(201);
        expect(response.source).to.equals(serializedCertificationCandidate);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#finalize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the finalizeSession usecase with correct values', async function () {
      // given
      const sessionId = 1;
      const aCertificationReport = Symbol('a certficication report');
      const updatedSession = Symbol('updatedSession');
      const examinerGlobalComment = 'It was a fine session my dear';
      const hasIncident = true;
      const hasJoiningIssue = true;
      const certificationReports = [
        {
          type: 'certification-reports',
        },
      ];
      const request = {
        params: {
          id: sessionId,
        },
        payload: {
          data: {
            attributes: {
              'examiner-global-comment': examinerGlobalComment,
              'has-incident': hasIncident,
              'has-joining-issue': hasJoiningIssue,
            },
            included: certificationReports,
          },
        },
      };
      sinon.stub(certificationReportSerializer, 'deserialize').resolves(aCertificationReport);
      sinon.stub(usecases, 'finalizeSession').resolves(updatedSession);
      sinon.stub(usecases, 'getSession').resolves(updatedSession);

      // when
      await sessionController.finalize(request, hFake);

      // then
      expect(usecases.finalizeSession).to.have.been.calledWithExactly({
        sessionId,
        examinerGlobalComment,
        hasIncident,
        hasJoiningIssue,
        certificationReports: [aCertificationReport],
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#publish / #unpublish', function () {
    const sessionId = 123;
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const session = Symbol('session');
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const serializedSession = Symbol('serializedSession');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      request = {
        params: {
          id: sessionId,
        },
        payload: {
          data: { attributes: {} },
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when publishing', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        request.payload.data.attributes.toPublish = true;
        const usecaseResult = session;
        sinon
          .stub(usecases, 'publishSession')
          .withArgs({
            sessionId,
          })
          .resolves(usecaseResult);
        sinon.stub(sessionSerializer, 'serialize').withArgs(session).resolves(serializedSession);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the serialized session', async function () {
        // when
        const response = await sessionController.publish(request);

        // then
        expect(response).to.equal(serializedSession);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when unpublishing', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        request.payload.data.attributes.toPublish = false;
        const usecaseResult = session;
        sinon
          .stub(usecases, 'unpublishSession')
          .withArgs({
            sessionId,
          })
          .resolves(usecaseResult);
        sinon.stub(sessionSerializer, 'serialize').withArgs(session).resolves(serializedSession);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the serialized session', async function () {
        // when
        const response = await sessionController.unpublish(request);

        // then
        expect(response).to.equal(serializedSession);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#publishInBatch', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 204 when no error occurred', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              ids: ['sessionId1', 'sessionId2'],
            },
          },
        },
      };
      sinon
        .stub(usecases, 'publishSessionsInBatch')
        .withArgs({
          sessionIds: ['sessionId1', 'sessionId2'],
        })
        .resolves(new SessionPublicationBatchResult('batchId'));

      // when
      const response = await sessionController.publishInBatch(request, hFake);
      // then
      expect(response.statusCode).to.equal(204);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('logs errors when errors occur', async function () {
      // given
      const result = new SessionPublicationBatchResult('batchId');
      result.addPublicationError('sessionId1', new Error('an error'));
      result.addPublicationError('sessionId2', new Error('another error'));

      const request = {
        payload: {
          data: {
            attributes: {
              ids: ['sessionId1', 'sessionId2'],
            },
          },
        },
      };
      sinon
        .stub(usecases, 'publishSessionsInBatch')
        .withArgs({
          sessionIds: ['sessionId1', 'sessionId2'],
        })
        .resolves(result);
      sinon.stub(logger, 'warn');

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      await catchErr(sessionController.publishInBatch)(request, hFake);

      // then
      expect(logger.warn).to.have.been.calledWithExactly(
        'One or more error occurred when publishing session in batch batchId'
      );

      expect(logger.warn).to.have.been.calledWithExactly(
        {
          batchId: 'batchId',
          sessionId: 'sessionId1',
        },
        'an error'
      );

      expect(logger.warn).to.have.been.calledWithExactly(
        {
          batchId: 'batchId',
          sessionId: 'sessionId2',
        },
        'another error'
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the serialized batch id', async function () {
      // given
      const result = new SessionPublicationBatchResult('batchId');
      result.addPublicationError('sessionId1', new Error('an error'));

      const request = {
        payload: {
          data: {
            attributes: {
              ids: ['sessionId1', 'sessionId2'],
            },
          },
        },
      };
      sinon
        .stub(usecases, 'publishSessionsInBatch')
        .withArgs({
          sessionIds: ['sessionId1', 'sessionId2'],
        })
        .resolves(result);
      sinon.stub(logger, 'warn');

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(sessionController.publishInBatch)(request, hFake);

      // then
      expect(error).to.be.an.instanceof(SessionPublicationBatchError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#flagResultsAsSentToPrescriber', function () {
    const sessionId = 123;
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const session = Symbol('session');
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const serializedSession = Symbol('serializedSession');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      request = {
        params: {
          id: sessionId,
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session results were already flagged as sent', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const usecaseResult = { resultsFlaggedAsSent: false, session };
        sinon.stub(usecases, 'flagSessionResultsAsSentToPrescriber').withArgs({ sessionId }).resolves(usecaseResult);
        sinon.stub(sessionSerializer, 'serialize').withArgs(session).resolves(serializedSession);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the serialized session', async function () {
        // when
        const response = await sessionController.flagResultsAsSentToPrescriber(request, hFake);

        // then
        expect(response).to.equal(serializedSession);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session results were not flagged as sent', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const usecaseResult = { resultsFlaggedAsSent: true, session };
        sinon.stub(usecases, 'flagSessionResultsAsSentToPrescriber').withArgs({ sessionId }).resolves(usecaseResult);
        sinon.stub(sessionSerializer, 'serialize').withArgs(session).resolves(serializedSession);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the serialized session with code 201', async function () {
        // when
        const response = await sessionController.flagResultsAsSentToPrescriber(request, hFake);

        // then
        expect(response.statusCode).to.equal(201);
        expect(response.source).to.equal(serializedSession);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedFilteredJurySessions', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(queryParamsUtils, 'extractParameters');
      sinon.stub(sessionValidator, 'validateAndNormalizeFilters');
      sinon.stub(jurySessionRepository, 'findPaginatedFiltered');
      sinon.stub(jurySessionSerializer, 'serializeForPaginatedList');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the serialized jurySessions', async function () {
      // given
      const request = { query: {} };
      const filter = { filter1: ' filter1ToTrim', filter2: 'filter2' };
      const normalizedFilters = 'normalizedFilters';
      const page = 'somePageConfiguration';
      const jurySessionsForPaginatedList = Symbol('jurySessionsForPaginatedList');
      const serializedJurySessionsForPaginatedList = Symbol('serializedJurySessionsForPaginatedList');
      queryParamsUtils.extractParameters.withArgs(request.query).returns({ filter, page });
      sessionValidator.validateAndNormalizeFilters.withArgs(filter).returns(normalizedFilters);
      jurySessionRepository.findPaginatedFiltered
        .withArgs({ filters: normalizedFilters, page })
        .resolves(jurySessionsForPaginatedList);
      jurySessionSerializer.serializeForPaginatedList
        .withArgs(jurySessionsForPaginatedList)
        .returns(serializedJurySessionsForPaginatedList);

      // when
      const result = await sessionController.findPaginatedFilteredJurySessions(request, hFake);

      // then
      expect(result).to.equal(serializedJurySessionsForPaginatedList);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#assignCertificationOfficer', function () {
    let request: $TSFixMe;
    const sessionId = 1;
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const session = Symbol('session');
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const sessionJsonApi = Symbol('someSessionSerialized');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      request = {
        params: { id: sessionId },
        auth: {
          credentials: {
            userId,
          },
        },
      };
      sinon
        .stub(usecases, 'assignCertificationOfficerToJurySession')
        .withArgs({
          sessionId,
          certificationOfficerId: userId,
        })
        .resolves(session);
      sinon.stub(jurySessionSerializer, 'serialize').withArgs(session).returns(sessionJsonApi);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return updated session', async function () {
      // when
      const response = await sessionController.assignCertificationOfficer(request, hFake);

      // then
      expect(usecases.assignCertificationOfficerToJurySession).to.have.been.calledWithExactly({
        sessionId,
        certificationOfficerId: userId,
      });
      expect(response).to.deep.equal(sessionJsonApi);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#commentAsJury', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the session with a comment', async function () {
      // given
      const sessionId = 1;
      const userId = 1;
      sinon.stub(usecases, 'commentSessionAsJury');
      request = {
        params: { id: sessionId },
        auth: {
          credentials: {
            userId,
          },
        },
        payload: {
          'jury-comment': 'Un commentaire du pôle certif',
        },
      };

      // when
      await sessionController.commentAsJury(request, hFake);

      // then
      expect(usecases.commentSessionAsJury).to.have.been.calledWithExactly({
        sessionId,
        juryCommentAuthorId: userId,
        juryComment: 'Un commentaire du pôle certif',
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#delete', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete the session', async function () {
      // given
      const sessionId = 1;
      const userId = 1;
      sinon.stub(usecases, 'deleteSession');
      request = {
        params: { id: sessionId },
        auth: {
          credentials: {
            userId,
          },
        },
      };

      // when
      await sessionController.delete(request, hFake);

      // then
      expect(usecases.deleteSession).to.have.been.calledWithExactly({
        sessionId,
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deleteJuryComment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete the session comment', async function () {
      // given
      const sessionId = 1;
      sinon.stub(usecases, 'deleteSessionJuryComment');
      request = { params: { id: sessionId } };

      // when
      const response = await sessionController.deleteJuryComment(request, hFake);

      // then
      expect(usecases.deleteSessionJuryComment).to.have.been.calledWithExactly({
        sessionId,
      });
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getSupervisorKitPdf', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return supervisor kit', async function () {
      // given
      sinon.stub(usecases, 'getSupervisorKitSessionInfo');
      const sessionMainInfo = domainBuilder.buildSessionForSupervisorKit({ id: 1 });
      const supervisorKitBuffer = 'binary string';
      const userId = 1;
      const request = {
        auth: { credentials: { userId } },
        params: { id: sessionMainInfo.id },
        query: {
          accessToken: 'ACCESS_TOKEN',
        },
      };
      sinon.stub(tokenService, 'extractUserId').returns(userId);
      sinon
        .stub(supervisorKitPdf, 'getSupervisorKitPdfBuffer')
        .resolves({ buffer: supervisorKitBuffer, fileName: `kit-surveillant-${sessionMainInfo.id}.pdf` });
      usecases.getSupervisorKitSessionInfo.resolves(sessionMainInfo);

      // when
      const response = await sessionController.getSupervisorKitPdf(request, hFake);

      // then
      expect(usecases.getSupervisorKitSessionInfo).to.have.been.calledWith({
        userId,
        sessionId: sessionMainInfo.id,
      });
      expect(response.source).to.deep.equal(supervisorKitBuffer);
      expect(response.headers['Content-Disposition']).to.contains(`attachment; filename=kit-surveillant-1.pdf`);
    });
  });
});

function buildRequest(sessionId: $TSFixMe, userId: $TSFixMe, firstName: $TSFixMe, lastName: $TSFixMe, birthdate: $TSFixMe) {
  return {
    params: { id: sessionId },
    auth: {
      credentials: {
        userId,
      },
    },
    payload: {
      data: {
        attributes: {
          'first-name': firstName,
          'last-name': lastName,
          birthdate: birthdate,
        },
        type: 'certification-candidates',
      },
    },
  };
}
