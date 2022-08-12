// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const enrollStudentsToSession = require('../../../../lib/domain/usecases/enroll-students-to-session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCOCertifi... Remove this comment to see the full error message
const SCOCertificationCandidate = require('../../../../lib/domain/models/SCOCertificationCandidate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess, UnknownCountryForStudentEnrollmentError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | enroll-students-to-session', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when referent is allowed to Pix Certif', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('enrolls n students to a session', async function () {
      // given
      const { session, certificationCenterMemberships } = _buildMatchingSessionAndCertificationCenterMembership();
      const sessionId = session.id;
      const anotherSessionId = sessionId + 1;

      const referentId = Symbol('a referent id');

      const studentIds = [1, 2, 3];
      const { organizationForReferent, organizationLearners } =
        _buildMatchingReferentOrganisationAndOrganizationLearners(studentIds);

      const country = domainBuilder.buildCountry({
        code: '99100',
        name: 'FRANCE',
      });

      const expectedCertificationCandidates = organizationLearners.map((sr: $TSFixMe) => {
        return new SCOCertificationCandidate({
          firstName: sr.firstName,
          lastName: sr.lastName,
          birthdate: sr.birthdate,
          birthINSEECode: sr.birthCityCode,
          birthCountry: 'FRANCE',
          birthCity: sr.birthCity,
          sex: sr.sex,
          sessionId: sessionId,
          organizationLearnerId: sr.id,
        });
      });

      const scoCertificationCandidateRepository = new InMemorySCOCertificationCandidateRepository();
      const organizationLearnerRepository = { findByIds: sinon.stub() };
      const countryRepository = { findAll: sinon.stub() };
      countryRepository.findAll.resolves([country]);
      organizationLearnerRepository.findByIds.withArgs({ ids: studentIds }).resolves(organizationLearners);
      const sessionRepository = { get: sinon.stub() };
      sessionRepository.get.withArgs(sessionId).resolves(session);
      const certificationCenterMembershipRepository = { findByUserId: sinon.stub() };
      certificationCenterMembershipRepository.findByUserId
        .withArgs(referentId)
        .resolves(certificationCenterMemberships);
      const organizationRepository = { getIdByCertificationCenterId: sinon.stub() };
      organizationRepository.getIdByCertificationCenterId
        .withArgs(session.certificationCenterId)
        .resolves(organizationForReferent.id);

      // when
      await enrollStudentsToSession({
        sessionId,
        studentIds,
        referentId,
        scoCertificationCandidateRepository,
        certificationCenterMembershipRepository,
        organizationLearnerRepository,
        sessionRepository,
        countryRepository,
        organizationRepository,
      });

      // then
      expect(scoCertificationCandidateRepository.findBySessionId(sessionId)).to.deep.equal(
        expectedCertificationCandidates
      );
      expect(scoCertificationCandidateRepository.findBySessionId(anotherSessionId)).to.deep.equal(undefined);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('enrolls a student by trimming his first name and last name', async function () {
      // given
      const { session, certificationCenterMemberships } = _buildMatchingSessionAndCertificationCenterMembership();
      const sessionId = session.id;

      const referentId = Symbol('a referent id');

      const organizationForReferent = domainBuilder.buildOrganization();
      const country = domainBuilder.buildCountry({
        code: '99100',
        name: 'FRANCE',
      });

      const organizationLearner = domainBuilder.buildOrganizationLearner({
        id: 1,
        firstName: 'Sarah Michelle ',
        lastName: ' Gellar',
        birthdate: '2020-01-01',
        sex: 'F',
        birthCityCode: '48512',
        organization: organizationForReferent,
      });

      const expectedCertificationCandidate = new SCOCertificationCandidate({
        firstName: 'Sarah Michelle',
        lastName: 'Gellar',
        birthdate: organizationLearner.birthdate,
        sex: organizationLearner.sex,
        birthINSEECode: organizationLearner.birthCityCode,
        birthCountry: country.name,
        birthCity: organizationLearner.birthCity,
        sessionId: sessionId,
        organizationLearnerId: 1,
      });

      const scoCertificationCandidateRepository = new InMemorySCOCertificationCandidateRepository();
      const organizationLearnerRepository = { findByIds: sinon.stub() };
      const countryRepository = { findAll: sinon.stub() };
      countryRepository.findAll.resolves([country]);
      organizationLearnerRepository.findByIds.withArgs({ ids: [1] }).resolves([organizationLearner]);
      const sessionRepository = { get: sinon.stub() };
      sessionRepository.get.withArgs(sessionId).resolves(session);
      const certificationCenterMembershipRepository = { findByUserId: sinon.stub() };
      certificationCenterMembershipRepository.findByUserId
        .withArgs(referentId)
        .resolves(certificationCenterMemberships);
      const organizationRepository = { getIdByCertificationCenterId: sinon.stub() };
      organizationRepository.getIdByCertificationCenterId
        .withArgs(session.certificationCenterId)
        .resolves(organizationForReferent.id);

      // when
      await enrollStudentsToSession({
        sessionId,
        studentIds: [1],
        referentId,
        scoCertificationCandidateRepository,
        certificationCenterMembershipRepository,
        organizationLearnerRepository,
        sessionRepository,
        countryRepository,
        organizationRepository,
      });

      // then
      expect(scoCertificationCandidateRepository.findBySessionId(sessionId)).to.deep.equal([
        expectedCertificationCandidate,
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('rejects enrollment if students do not belong to same organization as referent', async function () {
      // given
      const { session, certificationCenterMemberships } = _buildMatchingSessionAndCertificationCenterMembership();

      const referentId = Symbol('an unauthorized referent id');

      const studentIds = [1, 2, 3];
      const { organizationForReferent, organizationLearners } =
        _buildNonMatchingReferentOrganisationAndOrganizationLearners(studentIds);

      const organizationLearnerRepository = { findByIds: sinon.stub() };
      organizationLearnerRepository.findByIds.withArgs({ ids: studentIds }).resolves(organizationLearners);
      const sessionRepository = { get: sinon.stub() };
      sessionRepository.get.withArgs(session.id).resolves(session);
      const certificationCenterMembershipRepository = { findByUserId: sinon.stub() };
      certificationCenterMembershipRepository.findByUserId
        .withArgs(referentId)
        .resolves(certificationCenterMemberships);
      const organizationRepository = { getIdByCertificationCenterId: sinon.stub() };
      organizationRepository.getIdByCertificationCenterId
        .withArgs(session.certificationCenterId)
        .resolves(organizationForReferent.id);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(enrollStudentsToSession)({
        sessionId: session.id,
        studentIds,
        referentId,
        organizationLearnerRepository,
        organizationRepository,
        sessionRepository,
        certificationCenterMembershipRepository,
      });

      // then
      expect(error).to.be.instanceof(ForbiddenAccess);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('rejects enrollment if session does not belong to same certification center as referent', async function () {
      // given
      const { session, certificationCenterMemberships } = _buildNonMatchingSessionAndCertificationCenterMembership();
      const referentId = Symbol('a referent id');
      const studentIds = [1, 2, 3];

      const certificationCenterMembershipRepository = { findByUserId: sinon.stub() };
      certificationCenterMembershipRepository.findByUserId
        .withArgs(referentId)
        .resolves(certificationCenterMemberships);
      const sessionRepository = { get: sinon.stub() };
      sessionRepository.get.withArgs(session.id).resolves(session);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(enrollStudentsToSession)({
        sessionId: session.id,
        studentIds,
        referentId,
        certificationCenterMembershipRepository,
        organizationRepository: undefined,
        organizationLearnerRepository: undefined,
        sessionRepository,
      });

      // then
      expect(error).to.be.an.instanceOf(ForbiddenAccess);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('rejects enrollment if a student birth country is not found', async function () {
      // given
      const { session, certificationCenterMemberships } = _buildMatchingSessionAndCertificationCenterMembership();
      const sessionId = session.id;
      const referentId = Symbol('a referent id');

      const studentIds = [1, 2, 3];
      const { organizationForReferent, organizationLearners } =
        _buildMatchingReferentOrganisationAndOrganizationLearners(studentIds);

      const country = domainBuilder.buildCountry({
        code: '99A07',
        name: 'COUBA',
      });

      const scoCertificationCandidateRepository = new InMemorySCOCertificationCandidateRepository();
      const organizationLearnerRepository = { findByIds: sinon.stub() };
      organizationLearnerRepository.findByIds.withArgs({ ids: studentIds }).resolves(organizationLearners);
      const countryRepository = { findAll: sinon.stub() };
      countryRepository.findAll.resolves([country]);
      const sessionRepository = { get: sinon.stub() };
      sessionRepository.get.withArgs(sessionId).resolves(session);
      const certificationCenterMembershipRepository = { findByUserId: sinon.stub() };
      certificationCenterMembershipRepository.findByUserId
        .withArgs(referentId)
        .resolves(certificationCenterMemberships);
      const organizationRepository = { getIdByCertificationCenterId: sinon.stub() };
      organizationRepository.getIdByCertificationCenterId
        .withArgs(session.certificationCenterId)
        .resolves(organizationForReferent.id);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(enrollStudentsToSession)({
        sessionId,
        studentIds,
        referentId,
        scoCertificationCandidateRepository,
        certificationCenterMembershipRepository,
        organizationLearnerRepository,
        sessionRepository,
        countryRepository,
        organizationRepository,
      });

      // then
      expect(error).to.be.an.instanceOf(UnknownCountryForStudentEnrollmentError);
      expect((error as $TSFixMe).message).to.contains(`${organizationLearners[0].firstName} ${organizationLearners[0].lastName}`);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does nothing if no student ids is given as input', async function () {
      // given
      const { session, certificationCenterMemberships } = _buildMatchingSessionAndCertificationCenterMembership();
      const sessionId = session.id;
      const studentIds: $TSFixMe = [];
      const referentId = Symbol('a referent id');
      const { organizationForReferent, organizationLearners } =
        _buildMatchingReferentOrganisationAndOrganizationLearners(studentIds);
      const country = domainBuilder.buildCountry({
        code: '99100',
        name: 'FRANCE',
      });

      const scoCertificationCandidateRepository = new InMemorySCOCertificationCandidateRepository();
      const organizationLearnerRepository = { findByIds: sinon.stub() };
      const countryRepository = { findAll: sinon.stub() };
      countryRepository.findAll.resolves([country]);
      organizationLearnerRepository.findByIds.withArgs({ ids: studentIds }).resolves(organizationLearners);
      const sessionRepository = { get: sinon.stub() };
      sessionRepository.get.withArgs(sessionId).resolves(session);
      const certificationCenterMembershipRepository = { findByUserId: sinon.stub() };
      certificationCenterMembershipRepository.findByUserId
        .withArgs(referentId)
        .resolves(certificationCenterMemberships);
      const organizationRepository = { getIdByCertificationCenterId: sinon.stub() };
      organizationRepository.getIdByCertificationCenterId
        .withArgs(session.certificationCenterId)
        .resolves(organizationForReferent.id);

      // when
      await enrollStudentsToSession({
        sessionId,
        studentIds,
        referentId,
        scoCertificationCandidateRepository,
        certificationCenterMembershipRepository,
        organizationRepository,
        organizationLearnerRepository,
        countryRepository,
        sessionRepository,
      });

      // then
      expect(scoCertificationCandidateRepository.findBySessionId(sessionId)).to.deep.equal([]);
    });
  });
});

function _buildMatchingSessionAndCertificationCenterMembership() {
  const certificationCenter = domainBuilder.buildCertificationCenter();
  const session = domainBuilder.buildSession({
    certificationCenterId: certificationCenter.id,
  });

  const certificationCenterMembership = domainBuilder.buildCertificationCenterMembership({
    certificationCenter,
  });

  return { session, certificationCenterMemberships: [certificationCenterMembership] };
}

function _buildNonMatchingSessionAndCertificationCenterMembership() {
  const certificationCenterForSession = domainBuilder.buildCertificationCenter({ id: 1234 });
  const session = domainBuilder.buildSession({
    certificationCenterId: certificationCenterForSession.id,
  });

  const certificationCenterForReferent = domainBuilder.buildCertificationCenter({ id: 5678 });
  const certificationCenterMembership = domainBuilder.buildCertificationCenterMembership({
    certficicationCenter: certificationCenterForReferent,
  });

  return { session, certificationCenterMemberships: [certificationCenterMembership] };
}

function _buildMatchingReferentOrganisationAndOrganizationLearners(studentIds: $TSFixMe) {
  const organizationForReferent = domainBuilder.buildOrganization();
  const organizationLearners = studentIds.map((id: $TSFixMe) => {
    return domainBuilder.buildOrganizationLearner({
      id,
      organization: organizationForReferent,
    });
  });

  return { organizationForReferent, organizationLearners };
}

function _buildNonMatchingReferentOrganisationAndOrganizationLearners(studentIds: $TSFixMe) {
  const organizationForStudents = domainBuilder.buildOrganization({ id: 123 });
  const organizationLearners = studentIds.map((id: $TSFixMe) => {
    return domainBuilder.buildOrganizationLearner({ id, organization: organizationForStudents });
  });

  const organizationForReferent = domainBuilder.buildOrganization({ id: 456 });
  return { organizationForReferent, organizationLearners };
}

class InMemorySCOCertificationCandidateRepository {
  addedCandidates: $TSFixMe;
  constructor() {
    this.addedCandidates = {};
  }

  addNonEnrolledCandidatesToSession({
    sessionId,
    scoCertificationCandidates
  }: $TSFixMe) {
    this.addedCandidates[sessionId] = scoCertificationCandidates;
  }

  findBySessionId(sessionId: $TSFixMe) {
    return this.addedCandidates[sessionId];
  }
}
