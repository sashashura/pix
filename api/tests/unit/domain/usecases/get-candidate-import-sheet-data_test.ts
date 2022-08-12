// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getCandidateImportSheetData = require('../../../../lib/domain/usecases/get-candidate-import-sheet-data');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-candidate-import-sheet-data', function () {
  let sessionRepository: $TSFixMe;
  let certificationCenterRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sessionRepository = {
      doesUserHaveCertificationCenterMembershipForSession: sinon.stub(),
      getWithCertificationCandidates: sinon.stub(),
    };
    certificationCenterRepository = {
      getBySessionId: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is not a member of the certification center which has created the session', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a UserNotAuthorizedToAccessEntityError', async function () {
      // given
      const userId = 123;
      const sessionId = 456;
      sessionRepository.doesUserHaveCertificationCenterMembershipForSession.withArgs(userId, sessionId).resolves(false);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(getCandidateImportSheetData)({
        userId,
        sessionId,
        sessionRepository,
        certificationCenterRepository,
      });

      // then
      expect(error).to.be.an.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get a session with candidates and the certification center habilitations', async function () {
    // given
    const userId = 123;
    const sessionId = 456;
    sessionRepository.doesUserHaveCertificationCenterMembershipForSession.withArgs(userId, sessionId).resolves(true);
    const session = domainBuilder.buildSession({
      certificationCandidates: [
        domainBuilder.buildCertificationCandidate(),
        domainBuilder.buildCertificationCandidate(),
      ],
    });
    sessionRepository.getWithCertificationCandidates.withArgs(sessionId).resolves(session);
    const complementaryCertification1 = domainBuilder.buildComplementaryCertification({ name: 'Pix+Droit' });
    const complementaryCertification2 = domainBuilder.buildComplementaryCertification({ name: 'Pix+Penché' });
    const certificationCenter = domainBuilder.buildCertificationCenter({
      habilitations: [complementaryCertification1, complementaryCertification2],
      type: 'SCO',
    });
    certificationCenterRepository.getBySessionId.withArgs(sessionId).resolves(certificationCenter);

    // when
    const result = await getCandidateImportSheetData({
      userId,
      sessionId,
      sessionRepository,
      certificationCenterRepository,
    });

    // then
    expect(result).to.deepEqualInstance({
      session,
      certificationCenterHabilitations: [complementaryCertification1, complementaryCertification2],
      isScoCertificationCenter: true,
    });
  });
});
