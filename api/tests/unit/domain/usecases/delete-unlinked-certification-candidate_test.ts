// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const deleteUnlinkedCertificationCandidate = require('../../../../lib/domain/usecases/delete-unlinked-certification-candidate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCandidateForbiddenDeletionError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | delete-unlinked-sertification-candidate', function () {
  let certificationCandidateId: $TSFixMe;
  let certificationCandidateRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    certificationCandidateId = 'dummy certification candidate id';
    certificationCandidateRepository = {
      isNotLinked: sinon.stub(),
      delete: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the certification candidate is not linked to a user', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      certificationCandidateRepository.isNotLinked.withArgs(certificationCandidateId).resolves(true);
      certificationCandidateRepository.delete.withArgs(certificationCandidateId).resolves(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete the certification candidate', async function () {
      // when
      const res = await deleteUnlinkedCertificationCandidate({
        certificationCandidateId,
        certificationCandidateRepository,
      });

      // then
      expect(res).to.deep.equal(true);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the certification candidate is linked to a user ', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      certificationCandidateRepository.isNotLinked.withArgs(certificationCandidateId).resolves(false);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a forbidden deletion error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const err = await catchErr(deleteUnlinkedCertificationCandidate)({
        certificationCandidateId,
        certificationCandidateRepository,
      });

      // then
      expect(err).to.be.instanceOf(CertificationCandidateForbiddenDeletionError);
    });
  });
});
