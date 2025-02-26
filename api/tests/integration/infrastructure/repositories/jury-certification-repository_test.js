const { expect, databaseBuilder, domainBuilder, catchErr } = require('../../../test-helper');
const { NotFoundError } = require('../../../../lib/domain/errors');
const juryCertificationRepository = require('../../../../lib/infrastructure/repositories/jury-certification-repository');
const Badge = require('../../../../lib/domain/models/Badge');

describe('Integration | Infrastructure | Repository | Jury Certification', function () {
  describe('#get', function () {
    it('should throw a NotFoundError when no JuryCertification exists for given certification course id', async function () {
      // given
      databaseBuilder.factory.buildCertificationCourse({ id: 1 });
      databaseBuilder.factory.buildAssessment({ id: 159, certificationCourseId: 1 });
      await databaseBuilder.commit();

      // when
      const error = await catchErr(juryCertificationRepository.get)(2);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal('Certification course of id 2 does not exist.');
    });

    it('should return the JuryCertification for given certificationCourseId', async function () {
      // given
      databaseBuilder.factory.buildUser({ id: 789 });
      databaseBuilder.factory.buildSession({ id: 456 });
      const pixEduBadgeId = databaseBuilder.factory.buildBadge({
        key: Badge.keys.PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
      }).id;
      const pixDroitBadgeId = databaseBuilder.factory.buildBadge({ key: Badge.keys.PIX_DROIT_EXPERT_CERTIF }).id;

      databaseBuilder.factory.buildCertificationCourse({ id: 2, sessionId: 456 });
      databaseBuilder.factory.buildAssessment({ certificationCourseId: 2 });
      databaseBuilder.factory.buildCertificationCourse({
        id: 1,
        sessionId: 456,
        userId: 789,
        firstName: 'Buffy',
        lastName: 'Summers',
        birthdate: '1981-01-19',
        sex: 'F',
        birthplace: 'Torreilles',
        birthINSEECode: '66212',
        birthPostalCode: null,
        birthCountry: 'FRONCE',
        createdAt: new Date('2020-01-01'),
        completedAt: new Date('2020-02-01'),
        isPublished: false,
        isCancelled: false,
      });
      const complementaryDroitCertificationId = databaseBuilder.factory.buildComplementaryCertification({
        id: 23,
        name: 'Pix+ Droit',
      }).id;
      const complementaryEduCertificationId = databaseBuilder.factory.buildComplementaryCertification({
        id: 24,
        name: 'Pix+ Édu',
      }).id;

      databaseBuilder.factory.buildComplementaryCertificationBadge({
        id: 3454,
        complementaryCertificationId: complementaryEduCertificationId,
        badgeId: pixEduBadgeId,
        label: 'Pix+ Edu label',
      });

      databaseBuilder.factory.buildComplementaryCertificationBadge({
        id: 7678,
        complementaryCertificationId: complementaryDroitCertificationId,
        badgeId: pixDroitBadgeId,
        label: 'Pix+ Droit label',
      });

      databaseBuilder.factory.buildComplementaryCertificationCourse({
        id: 123,
        complementaryCertificationId: 23,
        certificationCourseId: 1,
        complementaryCertificationBadgeId: 7678,
      });
      databaseBuilder.factory.buildComplementaryCertificationCourse({
        id: 456,
        complementaryCertificationId: 24,
        certificationCourseId: 1,
        complementaryCertificationBadgeId: 3454,
      });

      databaseBuilder.factory.buildComplementaryCertificationCourseResult({
        complementaryCertificationCourseId: 123,
        source: 'PIX',
        partnerKey: Badge.keys.PIX_DROIT_EXPERT_CERTIF,
        acquired: true,
      });

      databaseBuilder.factory.buildComplementaryCertificationCourseResult({
        complementaryCertificationCourseId: 456,
        source: 'PIX',
        partnerKey: Badge.keys.PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
        acquired: true,
      });

      databaseBuilder.factory.buildAssessment({ id: 159, certificationCourseId: 1 });
      databaseBuilder.factory.buildUser({ id: 22 });
      const assessmentResultId = databaseBuilder.factory.buildAssessmentResult({
        assessmentId: 159,
        pixScore: 123,
        status: 'validated',
        commentForOrganization: 'Un commentaire orga',
        commentForCandidate: 'Un commentaire candidat',
        commentForJury: 'Un commentaire jury',
        juryId: 22,
      }).id;
      databaseBuilder.factory.buildCompetenceMark({
        id: 123,
        score: 10,
        level: 4,
        competence_code: '2.3',
        area_code: '2',
        competenceId: 'recComp23',
        assessmentResultId,
      });
      await databaseBuilder.commit();

      // when
      const juryCertification = await juryCertificationRepository.get(1);

      // then
      const expectedCompetenceMark = domainBuilder.buildCompetenceMark({
        id: 123,
        score: 10,
        level: 4,
        competence_code: '2.3',
        area_code: '2',
        competenceId: 'recComp23',
        assessmentResultId,
      });
      const expectedJuryCertification = domainBuilder.buildJuryCertification({
        certificationCourseId: 1,
        sessionId: 456,
        userId: 789,
        assessmentId: 159,
        firstName: 'Buffy',
        lastName: 'Summers',
        birthdate: '1981-01-19',
        sex: 'F',
        birthplace: 'Torreilles',
        birthINSEECode: '66212',
        birthPostalCode: null,
        birthCountry: 'FRONCE',
        status: 'validated',
        createdAt: new Date('2020-01-01'),
        completedAt: new Date('2020-02-01'),
        isPublished: false,
        juryId: 22,
        pixScore: 123,
        commentForOrganization: 'Un commentaire orga',
        commentForCandidate: 'Un commentaire candidat',
        commentForJury: 'Un commentaire jury',
        competenceMarks: [expectedCompetenceMark],
        certificationIssueReports: [],
        commonComplementaryCertificationCourseResults: [
          {
            acquired: true,
            id: 123,
            partnerKey: 'PIX_DROIT_EXPERT_CERTIF',
            label: 'Pix+ Droit label',
          },
        ],
        complementaryCertificationCourseResultsWithExternal: {
          complementaryCertificationCourseId: 456,
          externalSection: {
            acquired: false,
            partnerKey: undefined,
            label: undefined,
          },
          pixSection: {
            acquired: true,
            partnerKey: 'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE',
            label: 'Pix+ Edu label',
          },
        },
      });
      expect(juryCertification).to.deepEqualInstance(expectedJuryCertification);
    });

    it('should return along the certificationIssueReports if any ordered by ID', async function () {
      // given
      databaseBuilder.factory.buildCertificationCourse({ id: 1 });
      databaseBuilder.factory.buildCertificationCourse({ id: 2 });
      databaseBuilder.factory.buildAssessment({ id: 159, certificationCourseId: 1 });
      const expectedCertificationIssueReportA = domainBuilder.buildCertificationIssueReport.impactful({
        id: 456,
        certificationCourseId: 1,
        description: 'une description 1',
        questionNumber: 1,
        resolvedAt: new Date('2022-05-05'),
        resolution: 'super',
        hasBeenAutomaticallyResolved: false,
      });
      const expectedCertificationIssueReportB = domainBuilder.buildCertificationIssueReport.notImpactful({
        id: 123,
        certificationCourseId: 1,
        description: 'une description 2',
        questionNumber: 12,
        resolvedAt: new Date('2021-12-25'),
        resolution: 'les doigts dans le nez',
        hasBeenAutomaticallyResolved: false,
      });
      const anotherIssueReport = domainBuilder.buildCertificationIssueReport.notImpactful({
        id: 789,
        certificationCourseId: 2,
      });
      databaseBuilder.factory.buildCertificationIssueReport(expectedCertificationIssueReportA);
      databaseBuilder.factory.buildCertificationIssueReport(expectedCertificationIssueReportB);
      databaseBuilder.factory.buildCertificationIssueReport(anotherIssueReport);
      await databaseBuilder.commit();

      // when
      const juryCertification = await juryCertificationRepository.get(1);

      // then
      expect(juryCertification.certificationIssueReports).to.deepEqualArray([
        expectedCertificationIssueReportB,
        expectedCertificationIssueReportA,
      ]);
    });
  });
});
