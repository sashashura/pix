// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getScoCertificationResultsByDivision = require('../../../../lib/domain/usecases/get-sco-certification-results-by-division');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NoCertific... Remove this comment to see the full error message
const { NoCertificationResultForDivision } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-sco-certification-results-by-division', function () {
  const scoCertificationCandidateRepository = { findIdsByOrganizationIdAndDivision: null };
  const certificationResultRepository = { findByCertificationCandidateIds: null };
  const dependencies = {
    scoCertificationCandidateRepository,
    certificationResultRepository,
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    scoCertificationCandidateRepository.findIdsByOrganizationIdAndDivision = sinon.stub();
    certificationResultRepository.findByCertificationCandidateIds = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws when no candidates are found for organization and division', async function () {
    // given
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    scoCertificationCandidateRepository.findIdsByOrganizationIdAndDivision
      .withArgs({
        organizationId: 1,
        division: '3ème A',
      })
      .resolves([]);
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    certificationResultRepository.findByCertificationCandidateIds.rejects('I should not be called');

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(getScoCertificationResultsByDivision)({
      ...dependencies,
      organizationId: 1,
      division: '3ème A',
    });

    // then
    expect(error).to.be.instanceof(NoCertificationResultForDivision);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws when no results are found for candidates', async function () {
    // given
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    scoCertificationCandidateRepository.findIdsByOrganizationIdAndDivision
      .withArgs({
        organizationId: 1,
        division: '3ème A',
      })
      .resolves([11, 12]);
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    certificationResultRepository.findByCertificationCandidateIds
      .withArgs({
        certificationCandidateIds: [11, 12],
      })
      .resolves([]);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(getScoCertificationResultsByDivision)({
      ...dependencies,
      organizationId: 1,
      division: '3ème A',
    });

    // then
    expect(error).to.be.instanceof(NoCertificationResultForDivision);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns the certification results of candidates matching the organization and division', async function () {
    // given
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    scoCertificationCandidateRepository.findIdsByOrganizationIdAndDivision
      .withArgs({
        organizationId: 1,
        division: '3ème A',
      })
      .resolves([11, 12, 13]);
    const certificationResultA = domainBuilder.buildCertificationResult({ firstName: 'Buffy' });
    const certificationResultB = domainBuilder.buildCertificationResult({ firstName: 'Giles' });
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    certificationResultRepository.findByCertificationCandidateIds
      .withArgs({
        certificationCandidateIds: [11, 12, 13],
      })
      .resolves([certificationResultA, certificationResultB]);

    // when
    const certificationResults = await getScoCertificationResultsByDivision({
      ...dependencies,
      organizationId: 1,
      division: '3ème A',
    });

    // then
    expect(certificationResults).to.deepEqualArray([certificationResultA, certificationResultB]);
  });
});
