// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationLsRepository = require('../../../../lib/infrastructure/repositories/certification-livret-scolaire-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'status'.
const status = require('../../../../lib/domain/read-models/livret-scolaire/CertificateStatus');

const {
  buildUser,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
  buildOrganizationLearner,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
  buildOrganization,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
  buildCertificationDataWithNoCompetenceMarks,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildValid... Remove this comment to see the full error message
  buildValidatedPublishedCertificationData,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildValid... Remove this comment to see the full error message
  buildValidatedUnpublishedCertificationData,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCance... Remove this comment to see the full error message
  buildCancelledCertificationData,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildRejec... Remove this comment to see the full error message
  buildRejectedPublishedCertificationData,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildError... Remove this comment to see the full error message
  buildErrorUnpublishedCertificationData,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../tests/tooling/domain-builder/factory/build-certifications-results-for-ls');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Certification-ls ', function () {
  const pixScore = 400;
  const uai = '789567AA';
  const verificationCode = 'P-123498NN';
  const competenceMarks = [
    {
      code: '1.1',
      level: 6,
    },
    {
      code: '5.2',
      level: 4,
    },
  ];

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('competence-marks').delete();
    await knex('certification-candidates').delete();
    await knex('complementary-certification-course-results').delete();
    await knex('assessment-results').delete();
    await knex('assessments').delete();
    await knex('certification-courses').delete();
    return knex('sessions').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCertificatesByOrganizationUAI', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return validated certification results for a given UAI', async function () {
      // given
      const organizationId = buildOrganization(uai).id;
      const user = buildUser();
      const organizationLearner = buildOrganizationLearner({
        userId: user.id,
        organizationId,
      });
      const { session, certificationCourse } = buildValidatedPublishedCertificationData({
        user,
        organizationLearner,
        verificationCode,
        pixScore,
        competenceMarks,
      });

      await databaseBuilder.commit();

      const expected = {
        id: certificationCourse.id,
        firstName: organizationLearner.firstName,
        middleName: organizationLearner.middleName,
        thirdName: organizationLearner.thirdName,
        lastName: organizationLearner.lastName,
        nationalStudentId: organizationLearner.nationalStudentId,
        birthdate: organizationLearner.birthdate,
        date: certificationCourse.createdAt,
        verificationCode: certificationCourse.verificationCode,
        deliveredAt: session.publishedAt,
        certificationCenter: session.certificationCenter,
        status: status.VALIDATED,
        pixScore,
        competenceResults: [
          {
            competenceId: '1.1',
            level: 6,
          },
          {
            competenceId: '5.2',
            level: 4,
          },
        ],
      };

      // when
      const certificationResults = await certificationLsRepository.getCertificatesByOrganizationUAI(uai);

      // then
      expect(certificationResults).to.deep.equal([expected]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return disabled organization learner certification results for a given UAI', async function () {
      // given
      const organizationId = buildOrganization(uai).id;
      const user = buildUser();
      const organizationLearner = buildOrganizationLearner({
        userId: user.id,
        organizationId,
        isDisabled: true,
      });

      buildValidatedPublishedCertificationData({
        user,
        organizationLearner,
        verificationCode,
        pixScore,
        competenceMarks,
      });

      await databaseBuilder.commit();

      // when
      const certificationResults = await certificationLsRepository.getCertificatesByOrganizationUAI(uai);

      // then
      expect(certificationResults).to.deep.equal([]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return cancelled certification for a given UAI', async function () {
      // given
      const organizationId = buildOrganization(uai).id;
      const user = buildUser();
      const organizationLearner = buildOrganizationLearner({
        userId: user.id,
        organizationId,
      });
      buildCancelledCertificationData({
        user,
        organizationLearner,
        verificationCode,
        pixScore,
        competenceMarks,
      });

      await databaseBuilder.commit();

      // when
      const certificationResults = await certificationLsRepository.getCertificatesByOrganizationUAI(uai);

      // then
      expect(certificationResults).to.deep.equal([]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return rejected certification results for a given UAI', async function () {
      // given
      const organizationId = buildOrganization(uai).id;
      const user = buildUser();
      const organizationLearner = buildOrganizationLearner({
        userId: user.id,
        organizationId,
      });
      buildRejectedPublishedCertificationData({
        user,
        organizationLearner,
        competenceMarks,
      });

      await databaseBuilder.commit();

      // when
      const [certificationResult] = await certificationLsRepository.getCertificatesByOrganizationUAI(uai);

      // then
      expect(certificationResult.status).to.equal(status.REJECTED);
      expect(certificationResult.pixScore).to.equal(0);
      expect(certificationResult.competenceResults).to.be.empty;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return pending (error) certification results for a given UAI', async function () {
      // given
      const organizationId = buildOrganization(uai).id;
      const user = buildUser();
      const organizationLearner = buildOrganizationLearner({
        userId: user.id,
        organizationId,
      });
      buildErrorUnpublishedCertificationData({
        user,
        organizationLearner,
      });

      await databaseBuilder.commit();

      // when
      const [certificationResult] = await certificationLsRepository.getCertificatesByOrganizationUAI(uai);

      // then
expect(certificationResult.status).to.equal((status as $TSFixMe).PENDING);
      expect(certificationResult.pixScore).to.equal(0);
      expect(certificationResult.competenceResults).to.be.empty;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return pending (validated) certification results for a given UAI', async function () {
      // given
      const organizationId = buildOrganization(uai).id;
      const user = buildUser();
      const organizationLearner = buildOrganizationLearner({
        userId: user.id,
        organizationId,
      });
      buildValidatedUnpublishedCertificationData({
        user,
        organizationLearner,
      });

      await databaseBuilder.commit();

      // when
      const [certificationResult] = await certificationLsRepository.getCertificatesByOrganizationUAI(uai);

      // then
expect(certificationResult.status).to.equal((status as $TSFixMe).PENDING);
      expect(certificationResult.pixScore).to.equal(0);
      expect(certificationResult.competenceResults).to.be.empty;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return no certification results if no competence-marks for a given UAI', async function () {
      // given
      const organizationId = buildOrganization(uai).id;
      const user = buildUser();
      const organizationLearner = buildOrganizationLearner({
        userId: user.id,
        organizationId,
      });
      buildCertificationDataWithNoCompetenceMarks({
        user,
        organizationLearner,
      });

      await databaseBuilder.commit();

      // when
      const certificationResult = await certificationLsRepository.getCertificatesByOrganizationUAI(uai);

      // then
      expect(certificationResult).to.be.empty;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return certification from student even if this certification was from another other organisation', async function () {
      // given
      const organizationId = buildOrganization(uai).id;
      const user = buildUser();
      buildOrganizationLearner({
        userId: user.id,
        organizationId,
      });
      const formerOrganizationId = buildOrganization().id;
      const formerOrganizationLearner = buildOrganizationLearner({
        userId: user.id,
        formerOrganizationId,
      });

      buildValidatedPublishedCertificationData({
        user,
        organizationLearner: formerOrganizationLearner,
        verificationCode,
        pixScore,
        competenceMarks,
      });

      await databaseBuilder.commit();

      // when
      const [certificationResult] = await certificationLsRepository.getCertificatesByOrganizationUAI(uai);

      // then
      expect(certificationResult.status).to.equal(status.VALIDATED);
      expect(certificationResult.pixScore).not.to.equal(0);
      expect(certificationResult.competenceResults).not.to.be.empty;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return only the last (not cancelled) certification', async function () {
      // given
      const organizationId = buildOrganization(uai).id;
      const user = buildUser();
      const organizationLearner = buildOrganizationLearner({
        userId: user.id,
        organizationId,
      });
      buildValidatedPublishedCertificationData({
        user,
        organizationLearner,
        certificationCreatedDate: new Date('2020-02-20T14:23:56Z'),
      });

      const { certificationCourse: lastCertificationCourse } = buildValidatedPublishedCertificationData({
        user,
        organizationLearner,
        certificationCreatedDate: new Date('2020-02-22T14:23:56Z'),
      });

      buildValidatedPublishedCertificationData({
        user,
        organizationLearner,
        certificationCreatedDate: new Date('2020-02-21T14:23:56Z'),
      });

      buildCancelledCertificationData({
        user,
        organizationLearner,
        certificationCreatedDate: new Date('2020-02-23T14:23:56Z'),
      });

      await databaseBuilder.commit();

      // when
      const certificationResults = await certificationLsRepository.getCertificatesByOrganizationUAI(uai);

      // then
      expect(certificationResults).to.have.length(1);
      expect(certificationResults[0].id).to.equal(lastCertificationCourse.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 0 (low level) and -1 (rejected) competence level', async function () {
      // given
      const organizationId = buildOrganization(uai).id;
      const user = buildUser();
      const organizationLearner = buildOrganizationLearner({
        userId: user.id,
        organizationId,
      });
      buildValidatedPublishedCertificationData({
        user,
        organizationLearner,
        verificationCode,
        pixScore,
        competenceMarks: [
          {
            code: '5.2',
            level: -1,
          },
          {
            code: '1.1',
            level: 0,
          },
        ],
      });

      await databaseBuilder.commit();

      const expectedCompetenceResults = [
        {
          competenceId: '1.1',
          level: 0,
        },
        {
          competenceId: '5.2',
          level: -1,
        },
      ];

      // when
      const [certificationResult] = await certificationLsRepository.getCertificatesByOrganizationUAI(uai);

      // then
      expect(certificationResult.competenceResults).to.deep.equal(expectedCompetenceResults);
    });
  });
});
