// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getSessionResultsByResultRecipientEmail = require('../../../../lib/domain/usecases/get-session-results-by-result-recipient-email');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | get-session-results-by-result-recipient-email', function () {
  const sessionRepository = { getWithCertificationCandidates: null };
  const certificationResultRepository = { findByCertificationCandidateIds: null };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sessionRepository.getWithCertificationCandidates = sinon.stub();
    certificationResultRepository.findByCertificationCandidateIds = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return session', async function () {
    // given
    const expectedSession = domainBuilder.buildSession({
      certificationCandidates: [],
    });
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    sessionRepository.getWithCertificationCandidates.withArgs(123).resolves(expectedSession);
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    certificationResultRepository.findByCertificationCandidateIds
      .withArgs({ certificationCandidateIds: [] })
      .resolves([]);

    // when
    const { session } = await getSessionResultsByResultRecipientEmail({
      sessionId: 123,
      resultRecipientEmail: 'matching@example.net',
      sessionRepository,
      certificationResultRepository,
    });

    // then
    expect(session).to.deepEqualInstance(expectedSession);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return all certification results linked to candidates whose resultRecipientEmail matches with the one provided', async function () {
    // given
    const certificationCandidate1 = domainBuilder.buildCertificationCandidate({
      id: 456,
      resultRecipientEmail: 'notMatching@example.net',
    });
    const certificationCandidate2 = domainBuilder.buildCertificationCandidate({
      id: 789,
      resultRecipientEmail: 'matching@example.net',
    });
    const expectedSession = domainBuilder.buildSession({
      certificationCandidates: [certificationCandidate1, certificationCandidate2],
      date: '2019-06-06',
      time: '12:05:30',
    });
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    sessionRepository.getWithCertificationCandidates.withArgs(123).resolves(expectedSession);
    const certificationResult = domainBuilder.buildCertificationResult({ firstName: 'Buffy' });
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    certificationResultRepository.findByCertificationCandidateIds
      .withArgs({ certificationCandidateIds: [789] })
      .resolves([certificationResult]);

    // when
    const { certificationResults } = await getSessionResultsByResultRecipientEmail({
      sessionId: 123,
      resultRecipientEmail: 'matching@example.net',
      sessionRepository,
      certificationResultRepository,
    });

    // then
    expect(certificationResults).to.deepEqualArray([certificationResult]);
  });
});
