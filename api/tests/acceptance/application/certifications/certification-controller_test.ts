const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateCe... Remove this comment to see the full error message
  generateCertificateVerificationCode,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/services/verify-certificate-code-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Certifications', function () {
  let server: $TSFixMe, options;
  let userId: $TSFixMe;
  let session: $TSFixMe, certificationCourse: $TSFixMe, assessment, assessmentResult: $TSFixMe, badge: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();

    userId = databaseBuilder.factory.buildUser().id;
    session = databaseBuilder.factory.buildSession({ publishedAt: new Date('2018-12-01T01:02:03Z') });
    badge = databaseBuilder.factory.buildBadge({ key: 'charlotte_aux_fraises' });
    certificationCourse = databaseBuilder.factory.buildCertificationCourse({
      sessionId: session.id,
      userId,
      isPublished: true,
      maxReachableLevelOnCertificationDate: 3,
      verificationCode: await generateCertificateVerificationCode(),
    });
    assessment = databaseBuilder.factory.buildAssessment({
      userId,
      certificationCourseId: certificationCourse.id,
      type: Assessment.types.CERTIFICATION,
      state: 'completed',
    });
    assessmentResult = databaseBuilder.factory.buildAssessmentResult({
      assessmentId: assessment.id,
      level: 1,
      pixScore: 23,
      emitter: 'PIX-ALGO',
      status: 'validated',
    });
    const { id } = databaseBuilder.factory.buildComplementaryCertificationCourse({
      certificationCourseId: certificationCourse.id,
      name: 'patisseries au fruits',
    });
    databaseBuilder.factory.buildComplementaryCertificationCourseResult({
      complementaryCertificationCourseId: id,
      partnerKey: badge.key,
    });

    const learningContent = [
      {
        id: 'recvoGdo7z2z7pXWa',
        code: '1',
        name: '1. Information et données',
        titleFr: 'Information et données',
        color: 'jaffa',
        competences: [
          {
            id: 'recsvLz0W2ShyfD63',
            name: 'Mener une recherche et une veille d’information',
            index: '1.1',
            tubes: [
              {
                id: 'recTube1',
                skills: [
                  {
                    id: 'recSkillId1',
                    challenges: [
                      'rec02tVrimXNkgaLD',
                      'rec0gm0GFue3PQB3k',
                      'rec0hoSlSwCeNNLkq',
                      'rec2FcZ4jsPuY1QYt',
                      'rec39bDMnaVw3MyMR',
                      'rec3FMoD8h9USTktb',
                      'rec3P7fvPSpFkIFLV',
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'recNv8qhaY887jQb2',
            name: 'Gérer des données',
            index: '1.2',
            tubes: [
              {
                id: 'recTube2',
                skills: [
                  {
                    id: 'recSkillId2',
                    challenges: [
                      'rec02tVrimXNkgaLD',
                      'rec0gm0GFue3PQB3k',
                      'rec0hoSlSwCeNNLkq',
                      'rec2FcZ4jsPuY1QYt',
                      'rec39bDMnaVw3MyMR',
                      'rec3FMoD8h9USTktb',
                      'rec3P7fvPSpFkIFLV',
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'recIkYm646lrGvLNT',
            name: 'Traiter des données',
            index: '1.3',
            tubes: [
              {
                id: 'recTube3',
                skills: [
                  {
                    id: 'recSkillId3',
                    challenges: [
                      'rec02tVrimXNkgaLD',
                      'rec0gm0GFue3PQB3k',
                      'rec0hoSlSwCeNNLkq',
                      'rec2FcZ4jsPuY1QYt',
                      'rec39bDMnaVw3MyMR',
                      'rec3FMoD8h9USTktb',
                      'rec3P7fvPSpFkIFLV',
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
    mockLearningContent(learningContentObjects);

    return databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/certifications', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 HTTP status code', async function () {
      options = {
        method: 'GET',
        url: '/api/certifications',
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };
      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.deep.equal([
        {
          type: 'certifications',
          id: `${certificationCourse.id}`,
          attributes: {
            birthdate: certificationCourse.birthdate,
            birthplace: certificationCourse.birthplace,
            'certification-center': session.certificationCenter,
            'comment-for-candidate': assessmentResult.commentForCandidate,
            date: certificationCourse.createdAt,
            'first-name': certificationCourse.firstName,
            'delivered-at': session.publishedAt,
            'is-published': certificationCourse.isPublished,
            'last-name': certificationCourse.lastName,
            'pix-score': assessmentResult.pixScore,
            status: assessmentResult.status,
            'clea-certification-status': 'not_taken',
            'certified-badge-images': [],
            'verification-code': certificationCourse.verificationCode,
            'max-reachable-level-on-certification-date': certificationCourse.maxReachableLevelOnCertificationDate,
          },
          relationships: {
            'result-competence-tree': {
              data: null,
            },
          },
        },
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 401 HTTP status code if user is not authenticated', async function () {
      // given
      const options = {
        method: 'GET',
        url: '/api/certifications',
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(401);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/certifications/:id', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      databaseBuilder.factory.buildCompetenceMark({
        level: 3,
        score: 23,
        area_code: '1',
        competence_code: '1.1',
        assessmentResultId: assessmentResult.id,
        acquiredComplementaryCertifications: [badge.key],
      });
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 HTTP status code and the certification with the result competence tree included', async function () {
      // given
      options = {
        method: 'GET',
        url: `/api/certifications/${certificationCourse.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      // when
      const response = await server.inject(options);

      // then
      const expectedBody = {
        data: {
          attributes: {
            birthdate: certificationCourse.birthdate,
            birthplace: certificationCourse.birthplace,
            'certification-center': session.certificationCenter,
            'comment-for-candidate': assessmentResult.commentForCandidate,
            date: certificationCourse.createdAt,
            'first-name': certificationCourse.firstName,
            'delivered-at': session.publishedAt,
            'is-published': certificationCourse.isPublished,
            'last-name': certificationCourse.lastName,
            'pix-score': assessmentResult.pixScore,
            status: assessmentResult.status,
            'clea-certification-status': 'not_taken',
            'certified-badge-images': [],
            'verification-code': certificationCourse.verificationCode,
            'max-reachable-level-on-certification-date': certificationCourse.maxReachableLevelOnCertificationDate,
          },
          id: `${certificationCourse.id}`,
          relationships: {
            'result-competence-tree': {
              data: {
                id: `${certificationCourse.id}-${assessmentResult.id}`,
                type: 'result-competence-trees',
              },
            },
          },
          type: 'certifications',
        },
        included: [
          {
            attributes: {
              index: '1.1',
              level: 3,
              name: 'Mener une recherche et une veille d’information',
              score: 23,
            },
            id: 'recsvLz0W2ShyfD63',
            type: 'result-competences',
          },
          {
            attributes: {
              index: '1.2',
              level: -1,
              name: 'Gérer des données',
              score: 0,
            },
            id: 'recNv8qhaY887jQb2',
            type: 'result-competences',
          },
          {
            attributes: {
              index: '1.3',
              level: -1,
              name: 'Traiter des données',
              score: 0,
            },
            id: 'recIkYm646lrGvLNT',
            type: 'result-competences',
          },
          {
            attributes: {
              code: '1',
              name: '1. Information et données',
              title: 'Information et données',
              color: 'jaffa',
            },
            id: 'recvoGdo7z2z7pXWa',
            relationships: {
              'result-competences': {
                data: [
                  {
                    id: 'recsvLz0W2ShyfD63',
                    type: 'result-competences',
                  },
                  {
                    id: 'recNv8qhaY887jQb2',
                    type: 'result-competences',
                  },
                  {
                    id: 'recIkYm646lrGvLNT',
                    type: 'result-competences',
                  },
                ],
              },
            },
            type: 'areas',
          },
          {
            attributes: {
              id: `${certificationCourse.id}-${assessmentResult.id}`,
            },
            id: `${certificationCourse.id}-${assessmentResult.id}`,
            relationships: {
              areas: {
                data: [
                  {
                    id: 'recvoGdo7z2z7pXWa',
                    type: 'areas',
                  },
                ],
              },
            },
            type: 'result-competence-trees',
          },
        ],
      };
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.deep.equal(expectedBody);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return notFound 404 HTTP status code when user is not owner of the certification', async function () {
      // given
      const unauthenticatedUserId = userId + 1;
      options = {
        method: 'GET',
        url: `/api/certifications/${certificationCourse.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(unauthenticatedUserId) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(404);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/shared-certifications', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      databaseBuilder.factory.buildCompetenceMark({
        level: 3,
        score: 23,
        area_code: '1',
        competence_code: '1.1',
        assessmentResultId: assessmentResult.id,
        acquiredComplementaryCertifications: [badge.key],
      });
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the given verificationCode is correct', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code and the certification', async function () {
        // given
        const verificationCode = certificationCourse.verificationCode;
        options = {
          method: 'POST',
          url: '/api/shared-certifications',
          payload: { verificationCode },
        };

        // when
        const response = await server.inject(options);

        // then
        const expectedBody = {
          data: {
            attributes: {
              birthdate: certificationCourse.birthdate,
              birthplace: certificationCourse.birthplace,
              'certification-center': session.certificationCenter,
              date: certificationCourse.createdAt,
              'first-name': certificationCourse.firstName,
              'delivered-at': session.publishedAt,
              'is-published': certificationCourse.isPublished,
              'last-name': certificationCourse.lastName,
              'pix-score': assessmentResult.pixScore,
              'clea-certification-status': 'not_taken',
              'certified-badge-images': [],
              'max-reachable-level-on-certification-date': certificationCourse.maxReachableLevelOnCertificationDate,
            },
            id: `${certificationCourse.id}`,
            relationships: {
              'result-competence-tree': {
                data: {
                  id: `${certificationCourse.id}-${assessmentResult.id}`,
                  type: 'result-competence-trees',
                },
              },
            },
            type: 'certifications',
          },
          included: [
            {
              attributes: {
                index: '1.1',
                level: 3,
                name: 'Mener une recherche et une veille d’information',
                score: 23,
              },
              id: 'recsvLz0W2ShyfD63',
              type: 'result-competences',
            },
            {
              attributes: {
                index: '1.2',
                level: -1,
                name: 'Gérer des données',
                score: 0,
              },
              id: 'recNv8qhaY887jQb2',
              type: 'result-competences',
            },
            {
              attributes: {
                index: '1.3',
                level: -1,
                name: 'Traiter des données',
                score: 0,
              },
              id: 'recIkYm646lrGvLNT',
              type: 'result-competences',
            },
            {
              attributes: {
                code: '1',
                name: '1. Information et données',
                title: 'Information et données',
                color: 'jaffa',
              },
              id: 'recvoGdo7z2z7pXWa',
              relationships: {
                'result-competences': {
                  data: [
                    {
                      id: 'recsvLz0W2ShyfD63',
                      type: 'result-competences',
                    },
                    {
                      id: 'recNv8qhaY887jQb2',
                      type: 'result-competences',
                    },
                    {
                      id: 'recIkYm646lrGvLNT',
                      type: 'result-competences',
                    },
                  ],
                },
              },
              type: 'areas',
            },
            {
              attributes: {
                id: `${certificationCourse.id}-${assessmentResult.id}`,
              },
              id: `${certificationCourse.id}-${assessmentResult.id}`,
              relationships: {
                areas: {
                  data: [
                    {
                      id: 'recvoGdo7z2z7pXWa',
                      type: 'areas',
                    },
                  ],
                },
              },
              type: 'result-competence-trees',
            },
          ],
        };
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal(expectedBody);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the given verificationCode is incorrect', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 500 HTTP status code when param is missing', async function () {
        // given
        options = {
          method: 'POST',
          url: '/api/shared-certifications',
          payload: {},
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(500);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return notFound 404 HTTP status code when param is incorrect', async function () {
        // given
        const verificationCode = 'P-12345678';
        options = {
          method: 'POST',
          url: '/api/shared-certifications',
          payload: { verificationCode },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(404);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/attestation/pdf', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      databaseBuilder.factory.buildCompetenceMark({
        level: 3,
        score: 23,
        area_code: '1',
        competence_code: '1.1',
        assessmentResultId: assessmentResult.id,
        acquiredComplementaryCertifications: [badge.key],
      });
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user own the certification', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code and the certification', async function () {
        // given
        options = {
          method: 'GET',
          url: `/api/attestation/${certificationCourse.id}?isFrenchDomainExtension=true`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/pdf');
        expect(response.headers['content-disposition']).to.include('filename=attestation-pix');
        expect(response.file).not.to.be.null;
      });
    });
  });
});
