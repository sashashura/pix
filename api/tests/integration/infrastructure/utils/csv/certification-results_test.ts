// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getSession... Remove this comment to see the full error message
  getSessionCertificationResultsCsv,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getDivisio... Remove this comment to see the full error message
  getDivisionCertificationResultsCsv,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'REJECTED_A... Remove this comment to see the full error message
  REJECTED_AUTOMATICALLY_COMMENT,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../../lib/infrastructure/utils/csv/certification-results');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V3,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Utils | csv | certification-results', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#getSessionCertificationResultsCsv', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when no certification has passed complementary certifications', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return correct csvContent without complementary certification informations', async function () {
        // given
        const session = domainBuilder.buildSession({ id: 777, certificationCenter: 'CentreCertif' });
        const competencesWithMark = [
          domainBuilder.buildCompetenceMark({ competence_code: '1.1', level: 0 }),
          domainBuilder.buildCompetenceMark({ competence_code: '1.2', level: 1 }),
          domainBuilder.buildCompetenceMark({ competence_code: '1.3', level: 5 }),
          domainBuilder.buildCompetenceMark({ competence_code: '5.1', level: 0 }),
          domainBuilder.buildCompetenceMark({ competence_code: '5.2', level: -1 }),
        ];

        const certifResult = domainBuilder.buildCertificationResult.validated({
          id: 123,
          lastName: 'Oxford',
          firstName: 'Lili',
          birthdate: '1990-01-04',
          birthplace: 'Torreilles',
          externalId: 'LOLORD',
          createdAt: new Date('2020-01-01'),
          pixScore: 55,
          commentForOrganization: 'RAS',
          competencesWithMark: competencesWithMark,
          complementaryCertificationCourseResults: [],
        });

        const certificationResults = [certifResult];

        // when
        const result = await getSessionCertificationResultsCsv({ session, certificationResults });

        // then
        const expectedResult =
          '\uFEFF' +
          '"Numéro de certification";"Prénom";"Nom";"Date de naissance";"Lieu de naissance";"Identifiant Externe";"Statut";"Nombre de Pix";"1.1";"1.2";"1.3";"2.1";"2.2";"2.3";"2.4";"3.1";"3.2";"3.3";"3.4";"4.1";"4.2";"4.3";"5.1";"5.2";"Commentaire jury pour l’organisation";"Session";"Centre de certification";"Date de passage de la certification"\n' +
          '123;"Lili";"Oxford";"04/01/1990";"Torreilles";"LOLORD";"Validée";55;0;1;5;"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";0;0;"RAS";777;"CentreCertif";"01/01/2020"';
        expect(result).to.equal(expectedResult);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when certification has been rejected automatically', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return correct csvContent with automatically rejected comment for organization', async function () {
          // given
          const session = domainBuilder.buildSession({ id: 777, certificationCenter: 'CentreCertif' });

          const competencesWithMark = [
            domainBuilder.buildCompetenceMark({ competence_code: '5.1', level: 3 }),
            domainBuilder.buildCompetenceMark({ competence_code: '5.2', level: -1 }),
          ];

          const automaticallyRejectedCertificationResult = domainBuilder.buildCertificationResult.rejected({
            id: 456,
            lastName: 'Cambridge',
            firstName: 'Tom',
            birthdate: '1993-05-21',
            birthplace: 'TheMoon',
            externalId: 'TOTODGE',
            createdAt: new Date('2020-02-02'),
            pixScore: 66,
            commentForOrganization: null,
            competencesWithMark: competencesWithMark,
            complementaryCertificationCourseResults: [],
          });
          const certificationResults = [automaticallyRejectedCertificationResult];

          // when
          const result = await getSessionCertificationResultsCsv({ session, certificationResults });

          // then
          const expectedResult =
            '\uFEFF' +
            '"Numéro de certification";"Prénom";"Nom";"Date de naissance";"Lieu de naissance";"Identifiant Externe";"Statut";"Nombre de Pix";"1.1";"1.2";"1.3";"2.1";"2.2";"2.3";"2.4";"3.1";"3.2";"3.3";"3.4";"4.1";"4.2";"4.3";"5.1";"5.2";"Commentaire jury pour l’organisation";"Session";"Centre de certification";"Date de passage de la certification"\n' +
            `456;"Tom";"Cambridge";"21/05/1993";"TheMoon";"TOTODGE";"Rejetée";"0";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";0;0;"${REJECTED_AUTOMATICALLY_COMMENT}";777;"CentreCertif";"02/02/2020"`;
          expect(result).to.equal(expectedResult);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when certification is cancelled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return correct csvContent with cancelled status and dashes as Pix scores', async function () {
        // given
        const session = domainBuilder.buildSession({ id: 777, certificationCenter: 'CentreCertif' });
        const competencesWithMark = [
          domainBuilder.buildCompetenceMark({ competence_code: '5.1', level: 3 }),
          domainBuilder.buildCompetenceMark({ competence_code: '5.2', level: -1 }),
        ];
        const certifResult = domainBuilder.buildCertificationResult.cancelled({
          id: 123,
          lastName: 'Oxford',
          firstName: 'Lili',
          birthdate: '1990-01-04',
          birthplace: 'Torreilles',
          externalId: 'LOLORD',
          createdAt: new Date('2020-01-01'),
          pixScore: 55,
          commentForOrganization: 'RAS',
          competencesWithMark: competencesWithMark,
          complementaryCertificationCourseResults: [],
        });

        const certificationResults = [certifResult];

        // when
        const result = await getSessionCertificationResultsCsv({ session, certificationResults });

        // then
        const expectedResult =
          '\uFEFF' +
          '"Numéro de certification";"Prénom";"Nom";"Date de naissance";"Lieu de naissance";"Identifiant Externe";"Statut";"Nombre de Pix";"1.1";"1.2";"1.3";"2.1";"2.2";"2.3";"2.4";"3.1";"3.2";"3.3";"3.4";"4.1";"4.2";"4.3";"5.1";"5.2";"Commentaire jury pour l’organisation";"Session";"Centre de certification";"Date de passage de la certification"\n' +
          '123;"Lili";"Oxford";"04/01/1990";"Torreilles";"LOLORD";"Annulée";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"RAS";777;"CentreCertif";"01/01/2020"';
        expect(result).to.equal(expectedResult);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when at least one certification course is in error', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return correct csvContent with error status and dashes as Pix scores', async function () {
        // given
        const session = domainBuilder.buildSession({ id: 777, certificationCenter: 'CentreCertif' });
        const competencesWithMark = [
          domainBuilder.buildCompetenceMark({ competence_code: '5.1', level: 3 }),
          domainBuilder.buildCompetenceMark({ competence_code: '5.2', level: -1 }),
        ];
        const certifResult = domainBuilder.buildCertificationResult.error({
          id: 123,
          lastName: 'Oxford',
          firstName: 'Lili',
          birthdate: '1990-01-04',
          birthplace: 'Torreilles',
          externalId: 'LOLORD',
          createdAt: new Date('2020-01-01'),
          pixScore: 55,
          commentForOrganization: 'RAS',
          competencesWithMark: competencesWithMark,
          complementaryCertificationCourseResults: [],
        });

        const certificationResults = [certifResult];

        // when
        const result = await getSessionCertificationResultsCsv({ session, certificationResults });

        // then
        const expectedResult =
          '\uFEFF' +
          '"Numéro de certification";"Prénom";"Nom";"Date de naissance";"Lieu de naissance";"Identifiant Externe";"Statut";"Nombre de Pix";"1.1";"1.2";"1.3";"2.1";"2.2";"2.3";"2.4";"3.1";"3.2";"3.3";"3.4";"4.1";"4.2";"4.3";"5.1";"5.2";"Commentaire jury pour l’organisation";"Session";"Centre de certification";"Date de passage de la certification"\n' +
          '123;"Lili";"Oxford";"04/01/1990";"Torreilles";"LOLORD";"En erreur";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"RAS";777;"CentreCertif";"01/01/2020"';
        expect(result).to.equal(expectedResult);
      });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { partnerKey: PIX_EMPLOI_CLEA_V3, expectedHeader: 'Certification CléA numérique' },
      { partnerKey: PIX_DROIT_MAITRE_CERTIF, expectedHeader: 'Certification Pix+ Droit Maître' },
      { partnerKey: PIX_DROIT_EXPERT_CERTIF, expectedHeader: 'Certification Pix+ Droit Expert' },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        expectedHeader: 'Certification Pix+ Édu 2nd degré Initié (entrée dans le métier)',
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
        expectedHeader: 'Certification Pix+ Édu 2nd degré Confirmé',
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
        expectedHeader: 'Certification Pix+ Édu 2nd degré Avancé',
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
        expectedHeader: 'Certification Pix+ Édu 2nd degré Expert',
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
        expectedHeader: 'Certification Pix+ Édu 1er degré Initié (entrée dans le métier)',
      },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
        expectedHeader: 'Certification Pix+ Édu 1er degré Confirmé',
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
        expectedHeader: 'Certification Pix+ Édu 1er degré Avancé',
      },
      {
        partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
        expectedHeader: 'Certification Pix+ Édu 1er degré Expert',
      },
    ].forEach(({ partnerKey, expectedHeader }) => {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context(`when at least one candidate has passed ${partnerKey} certification`, function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should return correct csvContent with the ${partnerKey} information`, async function () {
          // given
          const session = domainBuilder.buildSession({ id: 777, certificationCenter: 'CentreCertif' });
          const competencesWithMark = [
            domainBuilder.buildCompetenceMark({ competence_code: '5.1', level: 3 }),
            domainBuilder.buildCompetenceMark({ competence_code: '5.2', level: -1 }),
          ];
          const certifResult = domainBuilder.buildCertificationResult.validated({
            id: 123,
            lastName: 'Oxford',
            firstName: 'Lili',
            birthdate: '1990-01-04',
            birthplace: 'Torreilles',
            externalId: 'LOLORD',
            createdAt: new Date('2020-01-01'),
            pixScore: 55,
            commentForOrganization: 'RAS',
            competencesWithMark: competencesWithMark,
            complementaryCertificationCourseResults: [
              domainBuilder.buildComplementaryCertificationCourseResult({ partnerKey, acquired: true }),
            ],
          });

          const certificationResults = [certifResult];

          // when
          const result = await getSessionCertificationResultsCsv({ session, certificationResults });

          // then
          const expectedResult =
            '\uFEFF' +
            `"Numéro de certification";"Prénom";"Nom";"Date de naissance";"Lieu de naissance";"Identifiant Externe";"Statut";"${expectedHeader}";"Nombre de Pix";"1.1";"1.2";"1.3";"2.1";"2.2";"2.3";"2.4";"3.1";"3.2";"3.3";"3.4";"4.1";"4.2";"4.3";"5.1";"5.2";"Commentaire jury pour l’organisation";"Session";"Centre de certification";"Date de passage de la certification"\n` +
            '123;"Lili";"Oxford";"04/01/1990";"Torreilles";"LOLORD";"Validée";"Validée";55;"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";3;0;"RAS";777;"CentreCertif";"01/01/2020"';
          expect(result).to.equal(expectedResult);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should return a cancelled ${partnerKey} certification when certification pix is cancelled`, async function () {
          // given
          const session = domainBuilder.buildSession({ id: 777, certificationCenter: 'CentreCertif' });
          const competencesWithMark = [
            domainBuilder.buildCompetenceMark({ competence_code: '5.1', level: 3 }),
            domainBuilder.buildCompetenceMark({ competence_code: '5.2', level: -1 }),
          ];
          const certifResult = domainBuilder.buildCertificationResult.cancelled({
            id: 123,
            lastName: 'Oxford',
            firstName: 'Lili',
            birthdate: '1990-01-04',
            birthplace: 'Torreilles',
            externalId: 'LOLORD',
            createdAt: new Date('2020-01-01'),
            pixScore: 55,
            commentForOrganization: 'RAS',
            competencesWithMark: competencesWithMark,
            complementaryCertificationCourseResults: [
              domainBuilder.buildComplementaryCertificationCourseResult({ partnerKey, acquired: true }),
            ],
          });

          const certificationResults = [certifResult];

          // when
          const result = await getSessionCertificationResultsCsv({ session, certificationResults });

          // then
          const expectedResult =
            '\uFEFF' +
            `"Numéro de certification";"Prénom";"Nom";"Date de naissance";"Lieu de naissance";"Identifiant Externe";"Statut";"${expectedHeader}";"Nombre de Pix";"1.1";"1.2";"1.3";"2.1";"2.2";"2.3";"2.4";"3.1";"3.2";"3.3";"3.4";"4.1";"4.2";"4.3";"5.1";"5.2";"Commentaire jury pour l’organisation";"Session";"Centre de certification";"Date de passage de la certification"\n` +
            '123;"Lili";"Oxford";"04/01/1990";"Torreilles";"LOLORD";"Annulée";"Annulée";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"RAS";777;"CentreCertif";"01/01/2020"';
          expect(result).to.equal(expectedResult);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are several complementary certifications', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return correct csvContent with complementary informations', async function () {
        // given
        const session = domainBuilder.buildSession({ id: 777, certificationCenter: 'CentreCertif' });
        const competencesWithMark = [
          domainBuilder.buildCompetenceMark({ competence_code: '5.1', level: 3 }),
          domainBuilder.buildCompetenceMark({ competence_code: '5.2', level: -1 }),
        ];
        const certifResult = domainBuilder.buildCertificationResult.validated({
          id: 123,
          lastName: 'Oxford',
          firstName: 'Lili',
          birthdate: '1990-01-04',
          birthplace: 'Torreilles',
          externalId: 'LOLORD',
          createdAt: new Date('2020-01-01'),
          pixScore: 55,
          commentForOrganization: 'RAS',
          competencesWithMark: competencesWithMark,
          complementaryCertificationCourseResults: [
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: PIX_EMPLOI_CLEA_V3,
              acquired: true,
            }),
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: PIX_DROIT_MAITRE_CERTIF,
              acquired: false,
            }),
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: PIX_DROIT_EXPERT_CERTIF,
              acquired: true,
            }),
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
              acquired: true,
            }),
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
              acquired: false,
            }),
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
              acquired: true,
            }),
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
              acquired: false,
            }),
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
              acquired: true,
            }),
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
              acquired: false,
            }),
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
              acquired: true,
            }),
            domainBuilder.buildComplementaryCertificationCourseResult({
              partnerKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
              acquired: false,
            }),
          ],
        });

        const certificationResults = [certifResult];

        // when
        const result = await getSessionCertificationResultsCsv({ session, certificationResults });

        // then
        const expectedResult =
          '\uFEFF' +
          '"Numéro de certification";"Prénom";"Nom";"Date de naissance";"Lieu de naissance";"Identifiant Externe";"Statut";"Certification Pix+ Droit Maître";"Certification Pix+ Droit Expert";"Certification CléA numérique";"Certification Pix+ Édu 2nd degré Initié (entrée dans le métier)";"Certification Pix+ Édu 2nd degré Confirmé";"Certification Pix+ Édu 2nd degré Avancé";"Certification Pix+ Édu 2nd degré Expert";"Certification Pix+ Édu 1er degré Initié (entrée dans le métier)";"Certification Pix+ Édu 1er degré Confirmé";"Certification Pix+ Édu 1er degré Avancé";"Certification Pix+ Édu 1er degré Expert";"Nombre de Pix";"1.1";"1.2";"1.3";"2.1";"2.2";"2.3";"2.4";"3.1";"3.2";"3.3";"3.4";"4.1";"4.2";"4.3";"5.1";"5.2";"Commentaire jury pour l’organisation";"Session";"Centre de certification";"Date de passage de la certification"\n' +
          '123;"Lili";"Oxford";"04/01/1990";"Torreilles";"LOLORD";"Validée";"Rejetée";"Validée";"Validée";"Validée";"Rejetée";"Validée";"Rejetée";"Validée";"Rejetée";"Validée";"Rejetée";55;"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";3;0;"RAS";777;"CentreCertif";"01/01/2020"';
        expect(result).to.equal(expectedResult);
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#getDivisionCertificationResultsCsv', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when at least one candidate has passed a certification', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns a csv without session informations', async function () {
        // given
        const competencesWithMark = [
          domainBuilder.buildCompetenceMark({ competence_code: '1.1', level: 0 }),
          domainBuilder.buildCompetenceMark({ competence_code: '1.2', level: 1 }),
          domainBuilder.buildCompetenceMark({ competence_code: '1.3', level: 5 }),
          domainBuilder.buildCompetenceMark({ competence_code: '5.1', level: 0 }),
          domainBuilder.buildCompetenceMark({ competence_code: '5.2', level: -1 }),
        ];

        const certifResult = domainBuilder.buildCertificationResult.validated({
          id: 123,
          lastName: 'Oxford',
          firstName: 'Lili',
          birthdate: '1990-01-04',
          birthplace: 'Torreilles',
          externalId: 'LOLORD',
          createdAt: new Date('2020-01-01'),
          pixScore: 55,
          commentForOrganization: 'RAS',
          competencesWithMark: competencesWithMark,
          sessionId: 777,
          complementaryCertificationCourseResults: [],
        });

        const certificationResults = [certifResult];

        // when
        const result = await getDivisionCertificationResultsCsv({ certificationResults });

        // then
        const expectedResult =
          '\uFEFF' +
          '"Numéro de certification";"Prénom";"Nom";"Date de naissance";"Lieu de naissance";"Identifiant Externe";"Statut";"Nombre de Pix";"1.1";"1.2";"1.3";"2.1";"2.2";"2.3";"2.4";"3.1";"3.2";"3.3";"3.4";"4.1";"4.2";"4.3";"5.1";"5.2";"Commentaire jury pour l’organisation";"Session";"Date de passage de la certification"\n' +
          '123;"Lili";"Oxford";"04/01/1990";"Torreilles";"LOLORD";"Validée";55;0;1;5;"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";0;0;"RAS";777;"01/01/2020"';
        expect(result).to.equal(expectedResult);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when certification has been rejected automatically', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return correct csvContent with automatically rejected comment for organization', async function () {
        // given

        const competencesWithMark = [
          domainBuilder.buildCompetenceMark({ competence_code: '5.1', level: 3 }),
          domainBuilder.buildCompetenceMark({ competence_code: '5.2', level: -1 }),
        ];

        const certifResult = domainBuilder.buildCertificationResult.rejected({
          id: 456,
          lastName: 'Cambridge',
          firstName: 'Tom',
          birthdate: '1993-05-21',
          birthplace: 'TheMoon',
          externalId: 'TOTODGE',
          createdAt: new Date('2020-02-02'),
          pixScore: 66,
          sessionId: 777,
          commentForOrganization: null,
          competencesWithMark: competencesWithMark,
          complementaryCertificationCourseResults: [],
        });
        const certificationResults = [certifResult];

        // when
        const result = await getDivisionCertificationResultsCsv({ certificationResults });

        // then
        const expectedResult =
          '\uFEFF' +
          '"Numéro de certification";"Prénom";"Nom";"Date de naissance";"Lieu de naissance";"Identifiant Externe";"Statut";"Nombre de Pix";"1.1";"1.2";"1.3";"2.1";"2.2";"2.3";"2.4";"3.1";"3.2";"3.3";"3.4";"4.1";"4.2";"4.3";"5.1";"5.2";"Commentaire jury pour l’organisation";"Session";"Date de passage de la certification"\n' +
          `456;"Tom";"Cambridge";"21/05/1993";"TheMoon";"TOTODGE";"Rejetée";"0";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";0;0;"${REJECTED_AUTOMATICALLY_COMMENT}";777;"02/02/2020"`;
        expect(result).to.equal(expectedResult);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when at least one certification course is cancelled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return correct csvContent with cancelled status and dashes as Pix scores', async function () {
        // given
        const competencesWithMark = [
          domainBuilder.buildCompetenceMark({ competence_code: '5.1', level: 3 }),
          domainBuilder.buildCompetenceMark({ competence_code: '5.2', level: -1 }),
        ];
        const certifResult = domainBuilder.buildCertificationResult.cancelled({
          id: 123,
          lastName: 'Oxford',
          firstName: 'Lili',
          birthdate: '1990-01-04',
          birthplace: 'Torreilles',
          externalId: 'LOLORD',
          createdAt: new Date('2020-01-01'),
          pixScore: 55,
          sessionId: 777,
          commentForOrganization: 'RAS',
          competencesWithMark: competencesWithMark,
          complementaryCertificationCourseResults: [],
        });

        const certificationResults = [certifResult];

        // when
        const result = await getDivisionCertificationResultsCsv({ certificationResults });

        // then
        const expectedResult =
          '\uFEFF' +
          '"Numéro de certification";"Prénom";"Nom";"Date de naissance";"Lieu de naissance";"Identifiant Externe";"Statut";"Nombre de Pix";"1.1";"1.2";"1.3";"2.1";"2.2";"2.3";"2.4";"3.1";"3.2";"3.3";"3.4";"4.1";"4.2";"4.3";"5.1";"5.2";"Commentaire jury pour l’organisation";"Session";"Date de passage de la certification"\n' +
          '123;"Lili";"Oxford";"04/01/1990";"Torreilles";"LOLORD";"Annulée";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"-";"RAS";777;"01/01/2020"';
        expect(result).to.equal(expectedResult);
      });
    });
  });
});
