// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getAttenda... Remove this comment to see the full error message
const getAttendanceSheet = require('../../../../lib/domain/usecases/get-attendance-sheet');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ATTENDANCE... Remove this comment to see the full error message
  ATTENDANCE_SHEET_SESSION_TEMPLATE_VALUES,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NON_SCO_AT... Remove this comment to see the full error message
  NON_SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_ATTEND... Remove this comment to see the full error message
  SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EXTRA_EMPT... Remove this comment to see the full error message
  EXTRA_EMPTY_CANDIDATE_ROWS,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/infrastructure/files/attendance-sheet/attendance-sheet-placeholders');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'writeOdsUt... Remove this comment to see the full error message
const writeOdsUtils = require('../../../../lib/infrastructure/utils/ods/write-ods-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'readOdsUti... Remove this comment to see the full error message
const readOdsUtils = require('../../../../lib/infrastructure/utils/ods/read-ods-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionXml... Remove this comment to see the full error message
const sessionXmlService = require('../../../../lib/domain/services/session-xml-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-attendance-sheet-in-ods-format', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('getAttendanceSheet', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('user has access to the session', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when certification center is not sco', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the attendance sheet', async function () {
          // given
          const userId = 'dummyUserId';
          const sessionId = 'dummySessionId';
          const stringifiedXml = '<xml>Some xml</xml>';
          const stringifiedSessionUpdatedXml = '<xml>Some updated session xml</xml>';
          const stringifiedSessionAndCandidatesUpdatedXml = '<xml>Some updated session and candidates xml</xml>';

          const sessionRepository = { doesUserHaveCertificationCenterMembershipForSession: sinon.stub() };
          const sessionForAttendanceSheetRepository = { getWithCertificationCandidates: sinon.stub() };
          const endTestScreenRemovalService = { isEndTestScreenRemovalEnabledBySessionId: sinon.stub() };

          sessionRepository.doesUserHaveCertificationCenterMembershipForSession.resolves(true);
          endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId.resolves(false);
          sessionForAttendanceSheetRepository.getWithCertificationCandidates
            .withArgs(sessionId)
            .resolves(_buildSessionWithCandidate('SUP', false));

          const odsBuffer = Buffer.from('some ods file');
          sinon.stub(readOdsUtils, 'getContentXml').resolves(stringifiedXml);
          sinon
            .stub(writeOdsUtils, 'makeUpdatedOdsByContentXml')
            .withArgs({
              stringifiedXml: stringifiedSessionAndCandidatesUpdatedXml,
              odsFilePath: sinon.match('non_sco_attendance_sheet_template_with_fdt.ods'),
            })
            .resolves(odsBuffer);
          sinon
            .stub(sessionXmlService, 'getUpdatedXmlWithSessionData')
            .withArgs({
              stringifiedXml,
              sessionData: _buildAttendanceSheetSessionData('SUP', false),
              sessionTemplateValues: ATTENDANCE_SHEET_SESSION_TEMPLATE_VALUES,
            })
            .returns(stringifiedSessionUpdatedXml);
          sinon
            .stub(sessionXmlService, 'getUpdatedXmlWithCertificationCandidatesData')
            .withArgs({
              stringifiedXml: stringifiedSessionUpdatedXml,
              candidatesData: _buildAttendanceSheetCandidateDataWithExtraRows('SUP'),
              candidateTemplateValues: NON_SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
            })
            .returns(stringifiedSessionAndCandidatesUpdatedXml);

          // when
          const result = await getAttendanceSheet({
            userId,
            sessionId,
            sessionRepository,
            endTestScreenRemovalService,
            sessionForAttendanceSheetRepository,
          });

          // then
          expect(result).to.deep.equal(odsBuffer);
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the certification center has supervisor access', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return the attendance sheet without end test column', async function () {
            // given
            const userId = 'dummyUserId';
            const sessionId = 'dummySessionId';
            const stringifiedXml = '<xml>Some xml</xml>';
            const stringifiedSessionUpdatedXml = '<xml>Some updated session xml</xml>';
            const stringifiedSessionAndCandidatesUpdatedXml = '<xml>Some updated session and candidates xml</xml>';

            const sessionRepository = { doesUserHaveCertificationCenterMembershipForSession: sinon.stub() };
            const endTestScreenRemovalService = { isEndTestScreenRemovalEnabledBySessionId: sinon.stub() };
            const sessionForAttendanceSheetRepository = { getWithCertificationCandidates: sinon.stub() };

            sessionRepository.doesUserHaveCertificationCenterMembershipForSession.resolves(true);
            endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId.withArgs(sessionId).resolves(true);
            sessionForAttendanceSheetRepository.getWithCertificationCandidates
              .withArgs(sessionId)
              .resolves(_buildSessionWithCandidate('SUP', true));

            const odsBuffer = Buffer.from('some ods file');
            sinon.stub(readOdsUtils, 'getContentXml').resolves(stringifiedXml);
            sinon
              .stub(writeOdsUtils, 'makeUpdatedOdsByContentXml')
              .withArgs({
                stringifiedXml: stringifiedSessionAndCandidatesUpdatedXml,
                odsFilePath: sinon.match('attendance_sheet_template.ods'),
              })
              .resolves(odsBuffer);
            sinon
              .stub(sessionXmlService, 'getUpdatedXmlWithSessionData')
              .withArgs({
                stringifiedXml,
                sessionData: _buildAttendanceSheetSessionData('SUP', true),
                sessionTemplateValues: ATTENDANCE_SHEET_SESSION_TEMPLATE_VALUES,
              })
              .returns(stringifiedSessionUpdatedXml);
            sinon
              .stub(sessionXmlService, 'getUpdatedXmlWithCertificationCandidatesData')
              .withArgs({
                stringifiedXml: stringifiedSessionUpdatedXml,
                candidatesData: _buildAttendanceSheetCandidateDataWithExtraRows('SUP'),
                candidateTemplateValues: NON_SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
              })
              .returns(stringifiedSessionAndCandidatesUpdatedXml);

            // when
            const result = await getAttendanceSheet({
              userId,
              sessionId,
              endTestScreenRemovalService,
              sessionRepository,
              sessionForAttendanceSheetRepository,
            });

            // then
            expect(result).to.deep.equal(odsBuffer);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the certification center does not have supervisor access', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return the attendance sheet with end test column', async function () {
            // given
            const userId = 'dummyUserId';
            const sessionId = 'dummySessionId';
            const stringifiedXml = '<xml>Some xml</xml>';
            const stringifiedSessionUpdatedXml = '<xml>Some updated session xml</xml>';
            const stringifiedSessionAndCandidatesUpdatedXml = '<xml>Some updated session and candidates xml</xml>';

            const sessionRepository = { doesUserHaveCertificationCenterMembershipForSession: sinon.stub() };
            const sessionForAttendanceSheetRepository = { getWithCertificationCandidates: sinon.stub() };
            const endTestScreenRemovalService = { isEndTestScreenRemovalEnabledBySessionId: sinon.stub() };

            sessionRepository.doesUserHaveCertificationCenterMembershipForSession.resolves(true);
            endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId.resolves(false);
            sessionForAttendanceSheetRepository.getWithCertificationCandidates
              .withArgs(sessionId)
              .resolves(_buildSessionWithCandidate('SUP', false));

            const odsBuffer = Buffer.from('some ods file');
            sinon.stub(readOdsUtils, 'getContentXml').resolves(stringifiedXml);
            sinon
              .stub(writeOdsUtils, 'makeUpdatedOdsByContentXml')
              .withArgs({
                stringifiedXml: stringifiedSessionAndCandidatesUpdatedXml,
                odsFilePath: sinon.match('non_sco_attendance_sheet_template_with_fdt.ods'),
              })
              .resolves(odsBuffer);
            sinon
              .stub(sessionXmlService, 'getUpdatedXmlWithSessionData')
              .withArgs({
                stringifiedXml,
                sessionData: _buildAttendanceSheetSessionData('SUP', false),
                sessionTemplateValues: ATTENDANCE_SHEET_SESSION_TEMPLATE_VALUES,
              })
              .returns(stringifiedSessionUpdatedXml);
            sinon
              .stub(sessionXmlService, 'getUpdatedXmlWithCertificationCandidatesData')
              .withArgs({
                stringifiedXml: stringifiedSessionUpdatedXml,
                candidatesData: _buildAttendanceSheetCandidateDataWithExtraRows('SUP'),
                candidateTemplateValues: NON_SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
              })
              .returns(stringifiedSessionAndCandidatesUpdatedXml);

            // when
            const result = await getAttendanceSheet({
              userId,
              sessionId,
              sessionRepository,
              endTestScreenRemovalService,
              sessionForAttendanceSheetRepository,
            });

            // then
            expect(result).to.deep.equal(odsBuffer);
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when certification center is sco and managing students', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the attendance sheet', async function () {
          // given
          const userId = 'dummyUserId';
          const sessionId = 'dummySessionId';
          const stringifiedXml = '<xml>Some xml</xml>';
          const stringifiedSessionUpdatedXml = '<xml>Some updated session xml</xml>';
          const stringifiedSessionAndCandidatesUpdatedXml = '<xml>Some updated session and candidates xml</xml>';

          const sessionRepository = { doesUserHaveCertificationCenterMembershipForSession: sinon.stub() };
          const endTestScreenRemovalService = { isEndTestScreenRemovalEnabledBySessionId: sinon.stub() };
          const sessionForAttendanceSheetRepository = { getWithCertificationCandidates: sinon.stub() };

          sessionRepository.doesUserHaveCertificationCenterMembershipForSession.resolves(true);
          endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId.resolves(false);
          sessionForAttendanceSheetRepository.getWithCertificationCandidates
            .withArgs(sessionId)
            .resolves(_buildSessionWithCandidate('SCO', true));

          const odsBuffer = Buffer.from('some ods file');
          sinon.stub(readOdsUtils, 'getContentXml').resolves(stringifiedXml);
          sinon
            .stub(writeOdsUtils, 'makeUpdatedOdsByContentXml')
            .withArgs({
              stringifiedXml: stringifiedSessionAndCandidatesUpdatedXml,
              odsFilePath: sinon.match('sco_attendance_sheet_template_with_fdt.ods'),
            })
            .resolves(odsBuffer);
          sinon
            .stub(sessionXmlService, 'getUpdatedXmlWithSessionData')
            .withArgs({
              stringifiedXml,
              sessionData: _buildAttendanceSheetSessionData('SCO', true),
              sessionTemplateValues: ATTENDANCE_SHEET_SESSION_TEMPLATE_VALUES,
            })
            .returns(stringifiedSessionUpdatedXml);
          sinon
            .stub(sessionXmlService, 'getUpdatedXmlWithCertificationCandidatesData')
            .withArgs({
              stringifiedXml: stringifiedSessionUpdatedXml,
              candidatesData: _buildAttendanceSheetCandidateDataWithExtraRows('SCO'),
              candidateTemplateValues: SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
            })
            .returns(stringifiedSessionAndCandidatesUpdatedXml);

          // when
          const result = await getAttendanceSheet({
            userId,
            sessionId,
            endTestScreenRemovalService,
            sessionRepository,
            sessionForAttendanceSheetRepository,
          });

          // then
          expect(result).to.deep.equal(odsBuffer);
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the certification center has supervisor access', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return the sco attendance sheet without end test column', async function () {
            // given
            const userId = 'dummyUserId';
            const sessionId = 'dummySessionId';
            const stringifiedXml = '<xml>Some xml</xml>';
            const stringifiedSessionUpdatedXml = '<xml>Some updated session xml</xml>';
            const stringifiedSessionAndCandidatesUpdatedXml = '<xml>Some updated session and candidates xml</xml>';

            const sessionRepository = { doesUserHaveCertificationCenterMembershipForSession: sinon.stub() };
            const endTestScreenRemovalService = { isEndTestScreenRemovalEnabledBySessionId: sinon.stub() };
            const sessionForAttendanceSheetRepository = { getWithCertificationCandidates: sinon.stub() };

            sessionRepository.doesUserHaveCertificationCenterMembershipForSession.resolves(true);
            endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId.withArgs(sessionId).resolves(true);
            sessionForAttendanceSheetRepository.getWithCertificationCandidates
              .withArgs(sessionId)
              .resolves(_buildSessionWithCandidate('SCO', true));

            const odsBuffer = Buffer.from('some ods file');
            sinon.stub(readOdsUtils, 'getContentXml').resolves(stringifiedXml);
            sinon
              .stub(writeOdsUtils, 'makeUpdatedOdsByContentXml')
              .withArgs({
                stringifiedXml: stringifiedSessionAndCandidatesUpdatedXml,
                odsFilePath: sinon.match('sco_attendance_sheet_template.ods'),
              })
              .resolves(odsBuffer);
            sinon
              .stub(sessionXmlService, 'getUpdatedXmlWithSessionData')
              .withArgs({
                stringifiedXml,
                sessionData: _buildAttendanceSheetSessionData('SCO', true),
                sessionTemplateValues: ATTENDANCE_SHEET_SESSION_TEMPLATE_VALUES,
              })
              .returns(stringifiedSessionUpdatedXml);
            sinon
              .stub(sessionXmlService, 'getUpdatedXmlWithCertificationCandidatesData')
              .withArgs({
                stringifiedXml: stringifiedSessionUpdatedXml,
                candidatesData: _buildAttendanceSheetCandidateDataWithExtraRows('SCO'),
                candidateTemplateValues: SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
              })
              .returns(stringifiedSessionAndCandidatesUpdatedXml);

            // when
            const result = await getAttendanceSheet({
              userId,
              sessionId,
              endTestScreenRemovalService,
              sessionRepository,
              sessionForAttendanceSheetRepository,
            });

            // then
            expect(result).to.deep.equal(odsBuffer);
          });
        });
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the certification center does not have supervisor access', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return the attendance sheet with end test column', async function () {
            // given
            const userId = 'dummyUserId';
            const sessionId = 'dummySessionId';
            const stringifiedXml = '<xml>Some xml</xml>';
            const stringifiedSessionUpdatedXml = '<xml>Some updated session xml</xml>';
            const stringifiedSessionAndCandidatesUpdatedXml = '<xml>Some updated session and candidates xml</xml>';

            const sessionRepository = { doesUserHaveCertificationCenterMembershipForSession: sinon.stub() };
            const endTestScreenRemovalService = { isEndTestScreenRemovalEnabledBySessionId: sinon.stub() };
            const sessionForAttendanceSheetRepository = { getWithCertificationCandidates: sinon.stub() };

            sessionRepository.doesUserHaveCertificationCenterMembershipForSession.resolves(true);
            endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId.resolves(false);
            sessionForAttendanceSheetRepository.getWithCertificationCandidates
              .withArgs(sessionId)
              .resolves(_buildSessionWithCandidate('SCO', true));

            const odsBuffer = Buffer.from('some ods file');
            sinon.stub(readOdsUtils, 'getContentXml').resolves(stringifiedXml);
            sinon
              .stub(writeOdsUtils, 'makeUpdatedOdsByContentXml')
              .withArgs({
                stringifiedXml: stringifiedSessionAndCandidatesUpdatedXml,
                odsFilePath: sinon.match('sco_attendance_sheet_template_with_fdt.ods'),
              })
              .resolves(odsBuffer);
            sinon
              .stub(sessionXmlService, 'getUpdatedXmlWithSessionData')
              .withArgs({
                stringifiedXml,
                sessionData: _buildAttendanceSheetSessionData('SCO', true),
                sessionTemplateValues: ATTENDANCE_SHEET_SESSION_TEMPLATE_VALUES,
              })
              .returns(stringifiedSessionUpdatedXml);
            sinon
              .stub(sessionXmlService, 'getUpdatedXmlWithCertificationCandidatesData')
              .withArgs({
                stringifiedXml: stringifiedSessionUpdatedXml,
                candidatesData: _buildAttendanceSheetCandidateDataWithExtraRows('SCO'),
                candidateTemplateValues: SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
              })
              .returns(stringifiedSessionAndCandidatesUpdatedXml);

            // when
            const result = await getAttendanceSheet({
              userId,
              sessionId,
              endTestScreenRemovalService,
              sessionRepository,
              sessionForAttendanceSheetRepository,
            });

            // then
            expect(result).to.deep.equal(odsBuffer);
          });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('user does not have access to the session', function () {
      let result: $TSFixMe;
      const userId = 'dummyUserId';
      const sessionId = 'dummySessionId';
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const sessionRepository = { doesUserHaveCertificationCenterMembershipForSession: sinon.stub() };
        sessionRepository.doesUserHaveCertificationCenterMembershipForSession.resolves(false);
        try {
          result = await getAttendanceSheet({ userId, sessionId, sessionRepository });
        } catch (err) {
          result = err;
        }
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error', function () {
        expect(result).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
      });
    });
  });
});

function _buildSessionWithCandidate(certificationCenterType: $TSFixMe, isOrganizationManagingStudents: $TSFixMe) {
  return {
    id: 1,
    address: 'Rue de bercy',
    room: 'Salle 2',
    examiner: 'Benoit',
    date: '2018-01-16',
    time: '14:00:00',
    certificationCenterName: 'Tour Gamma',
    certificationCenterType,
    isOrganizationManagingStudents,
    certificationCandidates: [
      {
        lastName: 'Gouffre des Beignets',
        firstName: 'Jean',
        birthdate: '1985-05-20',
        birthCity: 'Loukoum City',
        externalId: 'ENT1234',
        division: '3B',
        extraTimePercentage: 0.5,
      },
      {
        lastName: 'Laifrui',
        firstName: 'Jaime',
        birthdate: '1975-11-04',
        birthCity: 'Minneapolis',
        externalId: 'ENT4567',
        division: '3B',
        extraTimePercentage: null,
      },
    ],
  };
}

function _buildAttendanceSheetSessionData(certificationCenterType: $TSFixMe, isOrganizationManagingStudents: $TSFixMe) {
  return {
    id: 1,
    address: 'Rue de bercy',
    room: 'Salle 2',
    examiner: 'Benoit',
    certificationCenterName: 'Tour Gamma',
    certificationCenterType,
    isOrganizationManagingStudents,
    startTime: '14:00',
    endTime: '16:00',
    date: '16/01/2018',
  };
}

function _buildAttendanceSheetCandidateDataWithExtraRows(certificationCenterType: $TSFixMe) {
  const candidateTemplateValues =
    certificationCenterType === 'SCO'
      ? SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES
      : NON_SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES;
  const attendanceSheetCandidatesData = [
    {
      count: 1,
      lastName: 'Gouffre des Beignets',
      firstName: 'Jean',
      birthdate: '1985-05-20',
      birthCity: 'Loukoum City',
      externalId: 'ENT1234',
      division: '3B',
      extraTimePercentage: 0.5,
    },
    {
      count: 2,
      lastName: 'Laifrui',
      firstName: 'Jaime',
      birthdate: '1975-11-04',
      birthCity: 'Minneapolis',
      externalId: 'ENT4567',
      division: '3B',
      extraTimePercentage: '',
    },
  ];

  _.times(EXTRA_EMPTY_CANDIDATE_ROWS, () => {
    const emptyCandidateSheetData = {};
    _.each(candidateTemplateValues, (templateVal: $TSFixMe) => {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      emptyCandidateSheetData[templateVal.propertyName] = '';
    });
    (emptyCandidateSheetData as $TSFixMe).count = attendanceSheetCandidatesData.length + 1;
    // @ts-expect-error TS(2345): Argument of type '{}' is not assignable to paramet... Remove this comment to see the full error message
    attendanceSheetCandidatesData.push(emptyCandidateSheetData);
  });

  return attendanceSheetCandidatesData;
}
