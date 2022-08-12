// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect, knex, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const scoCertificationCandidateRepository = require('../../../../lib/infrastructure/repositories/sco-certification-candidate-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | SCOCertificationCandidate', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#addNonEnrolledCandidatesToSession', function () {
    let sessionId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      sessionId = databaseBuilder.factory.buildSession().id;

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('certification-candidates').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('adds only the unenrolled candidates', async function () {
      // given
      const organizationLearnerId1 = databaseBuilder.factory.buildOrganizationLearner().id;
      const organizationLearnerId2 = databaseBuilder.factory.buildOrganizationLearner().id;
      const scoCandidateAlreadySaved1 = databaseBuilder.factory.buildCertificationCandidate({
        sessionId,
        organizationLearnerId: organizationLearnerId1,
      });
      const scoCandidateAlreadySaved2 = databaseBuilder.factory.buildCertificationCandidate({
        sessionId,
        organizationLearnerId: organizationLearnerId2,
      });
      const organizationLearnerId3 = databaseBuilder.factory.buildOrganizationLearner().id;
      const organizationLearnerId4 = databaseBuilder.factory.buildOrganizationLearner().id;
      await databaseBuilder.commit();

      const scoCandidates = [
        domainBuilder.buildSCOCertificationCandidate({
          ...scoCandidateAlreadySaved1,
          organizationLearnerId: scoCandidateAlreadySaved1.organizationLearnerId,
        }),
        domainBuilder.buildSCOCertificationCandidate({
          ...scoCandidateAlreadySaved2,
          organizationLearnerId: scoCandidateAlreadySaved2.organizationLearnerId,
        }),
        domainBuilder.buildSCOCertificationCandidate({
          id: null,
          firstName: 'Bobby',
          lastName: 'LaPointe',
          birthdate: '2001-01-04',
          sex: 'M',
          birthINSEECode: '75005',
          organizationLearnerId: organizationLearnerId3,
          sessionId,
        }),
        domainBuilder.buildSCOCertificationCandidate({
          id: null,
          organizationLearnerId: organizationLearnerId4,
          sessionId,
        }),
      ];

      // when
      await scoCertificationCandidateRepository.addNonEnrolledCandidatesToSession({
        sessionId,
        scoCertificationCandidates: scoCandidates,
      });

      // then
      const candidates = await knex('certification-candidates').select([
        'firstName',
        'lastName',
        'birthdate',
        'sex',
        'birthINSEECode',
        'organizationLearnerId',
        'sessionId',
      ]);
      const actualCandidates = candidatesToBeCompared(candidates);
      const expectedCandidates = candidatesToBeCompared(scoCandidates);
      expect(actualCandidates).to.exactlyContain(expectedCandidates);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does nothing when no candidate is given', async function () {
      // when
      await scoCertificationCandidateRepository.addNonEnrolledCandidatesToSession({
        sessionId,
        scoCertificationCandidates: [],
      });

      // then
      const candidates = await knex('certification-candidates').select();
      expect(candidates).to.be.empty;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findIdsByOrganizationIdAndDivision', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('retrieves no candidates when no one belongs to organization', async function () {
      // given
      const sessionId = databaseBuilder.factory.buildSession().id;
      const anOrganizationId = databaseBuilder.factory.buildOrganization().id;
      const anotherOrganizationId = databaseBuilder.factory.buildOrganization().id;
      const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: anOrganizationId,
        division: '3ème A',
      }).id;
      databaseBuilder.factory.buildCertificationCandidate({
        sessionId,
        organizationLearnerId,
      });
      await databaseBuilder.commit();

      // when
      const candidatesIds = await scoCertificationCandidateRepository.findIdsByOrganizationIdAndDivision({
        organizationId: anotherOrganizationId,
        division: '3ème A',
      });

      // then
      expect(candidatesIds).to.be.empty;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('retrieves the non disabled candidates that belong to the organization and division', async function () {
      // given
      const sessionId = databaseBuilder.factory.buildSession().id;
      const anOrganizationId = databaseBuilder.factory.buildOrganization().id;
      const nonDisabledOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: anOrganizationId,
        division: '3ème A',
        isDisabled: false,
      }).id;
      const nonDisabledCandidateId = databaseBuilder.factory.buildCertificationCandidate({
        sessionId,
        organizationLearnerId: nonDisabledOrganizationLearnerId,
      }).id;

      const disabledOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: anOrganizationId,
        division: '3ème A',
        isDisabled: true,
      }).id;
      databaseBuilder.factory.buildCertificationCandidate({
        sessionId,
        organizationLearnerId: disabledOrganizationLearnerId,
      });
      await databaseBuilder.commit();

      // when
      const candidatesIds = await scoCertificationCandidateRepository.findIdsByOrganizationIdAndDivision({
        organizationId: anOrganizationId,
        division: '3ème A',
      });

      // then
      expect(candidatesIds).to.deep.equal([nonDisabledCandidateId]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('retrieves only the candidates that belongs to the given division', async function () {
      // given
      const sessionId = databaseBuilder.factory.buildSession().id;
      const anOrganizationId = databaseBuilder.factory.buildOrganization().id;
      const aOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: anOrganizationId,
        division: '3ème A',
      }).id;
      const anotherOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: anOrganizationId,
        division: '3ème B',
      }).id;
      const candidateId = databaseBuilder.factory.buildCertificationCandidate({
        sessionId,
        organizationLearnerId: aOrganizationLearnerId,
      }).id;
      databaseBuilder.factory.buildCertificationCandidate({
        sessionId,
        organizationLearnerId: anotherOrganizationLearnerId,
      });
      await databaseBuilder.commit();

      // when
      const candidatesIds = await scoCertificationCandidateRepository.findIdsByOrganizationIdAndDivision({
        organizationId: anOrganizationId,
        division: '3ème A',
      });

      // then
      expect(candidatesIds).to.deep.equal([candidateId]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('retrieves candidates ordered by lastname and firstname', async function () {
      // given
      const sessionId = databaseBuilder.factory.buildSession().id;
      const anOrganizationId = databaseBuilder.factory.buildOrganization().id;
      const aOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: anOrganizationId,
        division: '3ème A',
      }).id;
      const anotherOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: anOrganizationId,
        division: '3ème A',
      }).id;
      const yetAnotherOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: anOrganizationId,
        division: '3ème A',
      }).id;
      const thirdInAlphabeticOrderCandidateId = databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Zen',
        firstName: 'Bob',
        sessionId,
        organizationLearnerId: aOrganizationLearnerId,
      }).id;
      const firstInAlphabeticOrderCandidateId = databaseBuilder.factory.buildCertificationCandidate({
        firstName: 'Smith',
        lastName: 'Aaron',
        sessionId,
        organizationLearnerId: yetAnotherOrganizationLearnerId,
      }).id;
      const secondInAlphabeticOrderCandidateId = databaseBuilder.factory.buildCertificationCandidate({
        firstName: 'Smith',
        lastName: 'Ben',
        sessionId,
        organizationLearnerId: anotherOrganizationLearnerId,
      }).id;

      await databaseBuilder.commit();

      // when
      const candidatesIds = await scoCertificationCandidateRepository.findIdsByOrganizationIdAndDivision({
        organizationId: anOrganizationId,
        division: '3ème A',
      });

      // then
      expect(candidatesIds).to.deep.equal([
        firstInAlphabeticOrderCandidateId,
        secondInAlphabeticOrderCandidateId,
        thirdInAlphabeticOrderCandidateId,
      ]);
    });
  });
});

function fieldsToBeCompared(candidate: $TSFixMe) {
  return _.pick(candidate, [
    'firstName',
    'lastName',
    'birthdate',
    'sex',
    'birthINSEECode',
    'organizationLearnerId',
    'sessionId',
  ]);
}

function candidatesToBeCompared(candidates: $TSFixMe) {
  return _.map(candidates, (candidate: $TSFixMe) => fieldsToBeCompared(candidate));
}
