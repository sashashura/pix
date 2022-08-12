const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeaderForApplication,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
  buildOrganization,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildValid... Remove this comment to see the full error message
  buildValidatedPublishedCertificationData,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContentCompetences,
  buildUser,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
  buildOrganizationLearner,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../tests/tooling/domain-builder/factory/build-certifications-results-for-ls');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Certifications', function () {
  let server, options;
  const OSMOSE_CLIENT_ID = 'graviteeOsmoseClientId';
  const OSMOSE_SCOPE = 'organizations-certifications-result';
  const OSMOSE_SOURCE = 'livretScolaire';

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/organizations/:id/certifications', function () {
    const pixScore = 400;
    const uai = '789567AA';
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const type = Assessment.types.CERTIFICATION;
    const verificationCode = 'P-123498NN';
    let organizationId: $TSFixMe;

    const referentialCompetences = {
      data: [
        {
          id: '1.1',
          type: 'competences',
        },
        {
          id: '1.2',
          type: 'competences',
        },
        {
          id: '2.1',
          type: 'competences',
        },
        {
          id: '2.2',
          type: 'competences',
        },
        {
          id: '2.3',
          type: 'competences',
        },
        {
          id: '3.1',
          type: 'competences',
        },
        {
          id: '3.2',
          type: 'competences',
        },
      ],
    };

    const referentialIncludedData = [
      {
        attributes: {
          name: 'Information et données',
        },
        id: '1',
        relationships: {},
        type: 'areas',
      },
      {
        attributes: {
          name: 'Mener une recherche et une veille d’information',
        },
        id: '1.1',
        relationships: {
          area: {
            data: {
              id: '1',
              type: 'areas',
            },
          },
        },
        type: 'competences',
      },
      {
        attributes: {
          name: 'Gérer des données',
        },
        id: '1.2',
        relationships: {
          area: {
            data: {
              id: '1',
              type: 'areas',
            },
          },
        },
        type: 'competences',
      },
      {
        attributes: {
          name: 'Communication et collaboration',
        },
        id: '2',
        relationships: {},
        type: 'areas',
      },
      {
        attributes: {
          name: 'Interagir',
        },
        id: '2.1',
        relationships: {
          area: {
            data: {
              id: '2',
              type: 'areas',
            },
          },
        },
        type: 'competences',
      },
      {
        attributes: {
          name: 'Partager et publier',
        },
        id: '2.2',
        relationships: {
          area: {
            data: {
              id: '2',
              type: 'areas',
            },
          },
        },
        type: 'competences',
      },
      {
        attributes: {
          name: 'Collaborer',
        },
        id: '2.3',
        relationships: {
          area: {
            data: {
              id: '2',
              type: 'areas',
            },
          },
        },
        type: 'competences',
      },
      {
        attributes: {
          name: 'Création de contenu',
        },
        id: '3',
        relationships: {},
        type: 'areas',
      },
      {
        attributes: {
          name: 'Développer des documents textuels',
        },
        id: '3.1',
        relationships: {
          area: {
            data: {
              id: '3',
              type: 'areas',
            },
          },
        },
        type: 'competences',
      },
      {
        attributes: {
          name: 'Développer des documents multimedia',
        },
        id: '3.2',
        relationships: {
          area: {
            data: {
              id: '3',
              type: 'areas',
            },
          },
        },
        type: 'competences',
      },
    ];

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      organizationId = buildOrganization(uai).id;
      mockLearningContentCompetences();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the given uai is correct', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code with the certifications results and referential of competences', async function () {
        // given
        server = await createServer();
        const user = buildUser();
        const organizationLearner = buildOrganizationLearner({ userId: user.id, organizationId });
        const { session, certificationCourse } = buildValidatedPublishedCertificationData({
          user,
          organizationLearner,
          verificationCode,
          type,
          pixScore,
          competenceMarks: [
            {
              code: '5.2',
              level: 4,
            },
            {
              code: '1.1',
              level: 6,
            },
          ],
        });
        await databaseBuilder.commit();

        options = {
          method: 'GET',
          url: `/api/organizations/${uai}/certifications`,
          headers: {
            authorization: generateValidRequestAuthorizationHeaderForApplication(
              OSMOSE_CLIENT_ID,
              OSMOSE_SOURCE,
              OSMOSE_SCOPE
            ),
          },
        };

        // when
        const response = await server.inject(options);

        // then
        const expectedCertificationResult = {
          data: {
            attributes: {
              certifications: [
                {
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
                  status: 'validated',
                  pixScore,
                  competenceResults: [
                    { competenceId: '1.1', level: 6 },
                    { competenceId: '5.2', level: 4 },
                  ],
                },
              ],
            },
            relationships: {
              competences: referentialCompetences,
            },
            type: 'certificationsResults',
          },
          included: referentialIncludedData,
        };

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal(expectedCertificationResult);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the given uai is incorrect', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code with the referential of competences only', async function () {
        // given
        server = await createServer();
        options = {
          method: 'GET',
          url: '/api/organizations/9999/certifications',
          headers: {
            authorization: generateValidRequestAuthorizationHeaderForApplication(
              OSMOSE_CLIENT_ID,
              OSMOSE_SOURCE,
              OSMOSE_SCOPE
            ),
          },
        };

        // when
        const response = await server.inject(options);

        // then
        const expectedCertificationResult = {
          data: {
            attributes: {
              certifications: [],
            },
            relationships: {
              competences: referentialCompetences,
            },
            type: 'certificationsResults',
          },
          included: referentialIncludedData,
        };

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal(expectedCertificationResult);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the access token is generated by password credential grant to authenticate end user', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return unauthorized status code', async function () {
        // given
        server = await createServer();
        options = {
          method: 'GET',
          url: '/api/organizations/9999/certifications',
          headers: { authorization: generateValidRequestAuthorizationHeader() },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the access token is generated by client credential grant with the wrong client id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return unauthorized status code', async function () {
        // given
        server = await createServer();
        options = {
          method: 'GET',
          url: '/api/organizations/9999/certifications',
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
          headers: { authorization: generateValidRequestAuthorizationHeaderForApplication('') },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when the access token is generated by client credential grant with wrong livret scolaire scope',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return Forbidden access status code', async function () {
          // given
          server = await createServer();
          options = {
            method: 'GET',
            url: '/api/organizations/9999/certifications',
            headers: {
              // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
              authorization: generateValidRequestAuthorizationHeaderForApplication(OSMOSE_CLIENT_ID, OSMOSE_SOURCE),
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(403);
        });
      }
    );
  });
});
