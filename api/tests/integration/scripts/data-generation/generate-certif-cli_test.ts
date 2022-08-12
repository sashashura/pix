// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, sinon } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
  main,
  databaseBuilder: databaseBuilderCli,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../scripts/data-generation/generate-certif-cli');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillRepos... Remove this comment to see the full error message
const skillRepository = require('../../../../lib/infrastructure/repositories/skill-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('../../../../lib/infrastructure/repositories/competence-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeR... Remove this comment to see the full error message
const challengeRepository = require('../../../../lib/infrastructure/repositories/challenge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../../../../db/database-builder/database-buffer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | generate-certif-cli.js', function () {
  const certificationCenterSup = { id: 3, type: 'SUP' };
  const certificationCenterPro = { id: 2, type: 'PRO' };
  const certificationCenterSco = {
    id: 1,
    type: 'SCO',
    externalId: 'SCOID',
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon.stub(skillRepository, 'findActiveByCompetenceId').resolves([]);
    sinon.stub(competenceRepository, 'list').resolves([]);
    sinon.stub(challengeRepository, 'list').resolves([]);
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    //A we use the script databasebuilder, we have to clean it manually
    return databaseBuilderCli.clean();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#main', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when asking for 2 candidates', function () {
      // eslint-disable-next-line mocha/no-setup-in-describe
      [certificationCenterSup, certificationCenterPro].forEach(({ id: certificationCenterId, type }) => {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context(`when asking for ${type}`, function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`should create 2 ${type} candidates`, async function () {
            // given
            databaseBuffer.nextId = 0;
            buildTypedCertificationCenters();
            buildComplementaryCertifications();
            await databaseBuilderCli.commit();

            // when
            await main({
              centerType: type,
              candidateNumber: 2,
              complementaryCertifications: false,
            });

            // then
            const session = await knex('sessions').select('id', 'certificationCenterId', 'accessCode').first();
            const user = await knex('users').select('id').orderBy('id', 'asc').first();
            const hasAuthenticationMethod = !!(await knex('authentication-methods')
              .select(1)
              .where({ userId: user.id })
              .first());
            const certificationCandidates = await knex('certification-candidates').select(
              'birthdate',
              'firstName',
              'lastName',
              'sessionId',
              'email'
            );
            expect(session.accessCode).to.exist;
            expect(session.certificationCenterId).to.equal(certificationCenterId);
            expect(hasAuthenticationMethod).to.exist;
            expect(certificationCandidates).to.have.length(2);
            const name = `${type}1`.toLowerCase();
            expect(certificationCandidates[0]).to.deep.equals({
              birthdate: '2000-01-01',
              firstName: name,
              lastName: name,
              sessionId: session.id,
              email: `${name}@example.net`,
            });
          });

          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context(`when asking for complementary certifications`, function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it(`should add complementary certifications`, async function () {
              // given
              databaseBuffer.nextId = 0;
              buildTypedCertificationCenters();
              buildComplementaryCertifications();
              await databaseBuilderCli.commit();
              databaseBuilderCli.factory.buildOrganization({ id: 1, externalId: certificationCenterSco.externalId });
              databaseBuilderCli.factory.buildOrganizationLearner({
                organizationId: 1,
                userId: null,
              });
              databaseBuilderCli.factory.buildOrganizationLearner({ organizationId: 1, userId: null });
              await databaseBuilderCli.commit();
              await databaseBuilderCli.fixSequences();

              // when
              await main({
                centerType: type,
                candidateNumber: 2,
                complementaryCertifications: [
                  { candidateNumber: 1, key: 'CLEA' },
                  { candidateNumber: 1, key: 'DROIT' },
                  { candidateNumber: 1, key: 'EDU_1ER_DEGRE' },
                  { candidateNumber: 1, key: 'EDU_2ND_DEGRE' },
                ],
              });

              // then
              const { count: habilitations } = await knex('complementary-certification-habilitations')
                .count('*')
                .first();
              expect(habilitations).to.equal(4);
            });
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context(`when asking for SCO`, function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create 2 SCO candidates', async function () {
          // given
          databaseBuffer.nextId = 0;
          buildTypedCertificationCenters();
          buildComplementaryCertifications();
          await databaseBuilderCli.commit();
          databaseBuilderCli.factory.buildOrganization({ id: 1, externalId: certificationCenterSco.externalId });
          databaseBuilderCli.factory.buildOrganizationLearner({
            organizationId: 1,
            userId: null,
          });
          databaseBuilderCli.factory.buildOrganizationLearner({ organizationId: 1, userId: null });
          await databaseBuilderCli.commit();
          await databaseBuilderCli.fixSequences();

          // when
          await main({
            centerType: 'SCO',
            candidateNumber: 2,
            complementaryCertifications: false,
          });

          // then
          const session = await knex('sessions').select('id', 'certificationCenterId', 'accessCode').first();
          const user = await knex('users').select('id').orderBy('id', 'asc').first();
          const hasAuthenticationMethod = !!(await knex('authentication-methods')
            .select(1)
            .where({ userId: user.id })
            .first());
          const certificationCandidates = await knex('certification-candidates').select(
            'birthdate',
            'firstName',
            'lastName',
            'sessionId',
            'email'
          );

          expect(session.accessCode).to.exist;
          expect(session.certificationCenterId).to.equal(1);
          expect(hasAuthenticationMethod).to.exist;
          expect(certificationCandidates).to.have.length(2);
          expect(certificationCandidates[0]).to.deep.equals({
            birthdate: '2000-01-01',
            firstName: 'sco1',
            lastName: 'sco1',
            sessionId: session.id,
            email: 'sco1@example.net',
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context(`when asking for complementary certifications`, function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`should not add complementary certifications`, async function () {
            // given
            databaseBuffer.nextId = 0;
            buildTypedCertificationCenters();
            buildComplementaryCertifications();
            await databaseBuilderCli.commit();
            databaseBuilderCli.factory.buildOrganization({ id: 1, externalId: certificationCenterSco.externalId });
            databaseBuilderCli.factory.buildOrganizationLearner({
              organizationId: 1,
              userId: null,
            });
            databaseBuilderCli.factory.buildOrganizationLearner({ organizationId: 1, userId: null });
            await databaseBuilderCli.commit();
            await databaseBuilderCli.fixSequences();

            // when
            await main({
              centerType: 'SCO',
              candidateNumber: 2,
              complementaryCertifications: [
                { candidateNumber: 1, key: 'CLEA' },
                { candidateNumber: 1, key: 'DROIT' },
                { candidateNumber: 1, key: 'EDU_1ER_DEGRE' },
                { candidateNumber: 1, key: 'EDU_2ND_DEGRE' },
              ],
              isSupervisorAccessEnabled: false,
            });

            // then
            const { count: habilitations } = await knex('complementary-certification-habilitations').count('*').first();
            expect(habilitations).to.equal(0);
          });
        });
      });
    });
  });

  function buildTypedCertificationCenters() {
    databaseBuilderCli.factory.buildCertificationCenter(certificationCenterSco);
    databaseBuilderCli.factory.buildCertificationCenter(certificationCenterPro);
    databaseBuilderCli.factory.buildCertificationCenter(certificationCenterSup);
  }

  function buildComplementaryCertifications() {
    databaseBuilderCli.factory.buildBadge({ key: 'PIX_EMPLOI_CLEA_V3', targetProfileId: null });
    databaseBuilderCli.factory.buildBadge({ key: 'PIX_DROIT_EXPERT_CERTIF', targetProfileId: null });
    databaseBuilderCli.factory.buildBadge({
      key: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME',
      targetProfileId: null,
    });
    databaseBuilderCli.factory.buildBadge({
      key: 'PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME',
      targetProfileId: null,
    });

    databaseBuilderCli.factory.buildComplementaryCertification({ id: 52, key: 'CLEA' });
    databaseBuilderCli.factory.buildComplementaryCertification({ id: 53, key: 'DROIT' });
    databaseBuilderCli.factory.buildComplementaryCertification({ id: 54, key: 'EDU_1ER_DEGRE' });
    databaseBuilderCli.factory.buildComplementaryCertification({ id: 55, key: 'EDU_2ND_DEGRE' });
  }
});
