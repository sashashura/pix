// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, catchErr, domainBuilder } = require('../../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA'.
  CLEA,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
  PIX_PLUS_DROIT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
  PIX_PLUS_EDU_1ER_DEGRE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
  PIX_PLUS_EDU_2ND_DEGRE,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../../lib/domain/models/ComplementaryCertification');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCandidatesOdsService = require('../../../../../lib/domain/services/certification-candidates-ods-service');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCpfService = require('../../../../../lib/domain/services/certification-cpf-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCpfCountryRepository = require('../../../../../lib/infrastructure/repositories/certification-cpf-country-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCpfCityRepository = require('../../../../../lib/infrastructure/repositories/certification-cpf-city-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterRepository = require('../../../../../lib/infrastructure/repositories/certification-center-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'complement... Remove this comment to see the full error message
const complementaryCertificationRepository = require('../../../../../lib/infrastructure/repositories/complementary-certification-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../../../../../lib/domain/models/CertificationCandidate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCandidatesImportError } = require('../../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'readFile'.
const { readFile } = require('fs').promises;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Services | extractCertificationCandidatesFromCandidatesImportSheet', function () {
  let userId;
  let sessionId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({}).id;
    userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
    sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;

    databaseBuilder.factory.buildCertificationCpfCountry({
      code: '99100',
      commonName: 'FRANCE',
      originalName: 'FRANCE',
      matcher: 'ACEFNR',
    });
    databaseBuilder.factory.buildCertificationCpfCountry({
      code: '99132',
      commonName: 'ANGLETERRE',
      originalName: 'ANGLETERRE',
      matcher: 'AEEEGLNRRT',
    });

    databaseBuilder.factory.buildCertificationCpfCity({ name: 'AJACCIO', INSEECode: '2A004', isActualName: true });
    databaseBuilder.factory.buildCertificationCpfCity({ name: 'PARIS 18', postalCode: '75018', isActualName: true });
    databaseBuilder.factory.buildCertificationCpfCity({
      name: 'SAINT-ANNE',
      postalCode: '97180',
      isActualName: true,
    });
    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a CertificationCandidatesImportError if there is an error in the file', async function () {
    // given
    // @ts-expect-error TS(2304): Cannot find name '__dirname'.
    const odsFilePath = `${__dirname}/attendance_sheet_extract_mandatory_ko_test.ods`;
    const odsBuffer = await readFile(odsFilePath);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(
      certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet
    )({
      sessionId,
      odsBuffer,
      certificationCpfService,
      certificationCpfCountryRepository,
      certificationCpfCityRepository,
      certificationCenterRepository,
      complementaryCertificationRepository,
      isSco: true,
    });

    // then
    expect(error).to.be.instanceOf(CertificationCandidatesImportError);
    expect((error as $TSFixMe).message).to.equal('Ligne 13 : Le champ “Prénom” est obligatoire.');
    expect((error as $TSFixMe).code).to.be.null;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a CertificationCandidatesImportError if there is an error in the birth information', async function () {
    // given
    // @ts-expect-error TS(2304): Cannot find name '__dirname'.
    const odsFilePath = `${__dirname}/attendance_sheet_extract_birth_ko_test.ods`;
    const odsBuffer = await readFile(odsFilePath);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(
      certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet
    )({
      sessionId,
      odsBuffer,
      certificationCpfService,
      certificationCpfCountryRepository,
      certificationCpfCityRepository,
      certificationCenterRepository,
      complementaryCertificationRepository,
      isSco: true,
    });

    // then
    expect(error).to.be.instanceOf(CertificationCandidatesImportError);
    expect((error as $TSFixMe).message).to.equal('Ligne 13 : La valeur du code INSEE doit être "99" pour un pays étranger.');
    expect((error as $TSFixMe).code).to.be.null;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return extracted and validated certification candidates', async function () {
    // given
    const isSco = true;
    // @ts-expect-error TS(2304): Cannot find name '__dirname'.
    const odsFilePath = `${__dirname}/attendance_sheet_extract_ok_test.ods`;
    const odsBuffer = await readFile(odsFilePath);

    // when
    const actualCertificationCandidates =
      await certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet({
        sessionId,
        isSco,
        odsBuffer,
        certificationCpfService,
        certificationCpfCountryRepository,
        certificationCpfCityRepository,
        certificationCenterRepository,
        complementaryCertificationRepository,
      });

    // then
    const expectedCertificationCandidates = _.map(
      [
        {
          lastName: 'Gallagher',
          firstName: 'Jack',
          birthdate: '1980-08-10',
          sex: 'M',
          birthCity: 'Londres',
          birthCountry: 'ANGLETERRE',
          birthINSEECode: '99132',
          birthPostalCode: null,
          resultRecipientEmail: 'destinataire@gmail.com',
          email: 'jack@d.it',
          externalId: null,
          extraTimePercentage: 0.15,
          sessionId,
        },
        {
          lastName: 'Jackson',
          firstName: 'Janet',
          birthdate: '2005-12-05',
          sex: 'F',
          birthCity: 'AJACCIO',
          birthCountry: 'FRANCE',
          birthINSEECode: '2A004',
          birthPostalCode: null,
          resultRecipientEmail: 'destinataire@gmail.com',
          email: 'jaja@hotmail.fr',
          externalId: 'DEF456',
          extraTimePercentage: null,
          sessionId,
        },
        {
          lastName: 'Jackson',
          firstName: 'Michael',
          birthdate: '2004-04-04',
          sex: 'M',
          birthCity: 'PARIS 18',
          birthCountry: 'FRANCE',
          birthINSEECode: null,
          birthPostalCode: '75018',
          resultRecipientEmail: 'destinataire@gmail.com',
          email: 'jackson@gmail.com',
          externalId: 'ABC123',
          extraTimePercentage: 0.6,
          sessionId,
        },
        {
          lastName: 'Mercury',
          firstName: 'Freddy',
          birthdate: '1925-06-28',
          sex: 'M',
          birthCity: 'SAINT-ANNE',
          birthCountry: 'FRANCE',
          birthINSEECode: null,
          birthPostalCode: '97180',
          resultRecipientEmail: null,
          email: null,
          externalId: 'GHI789',
          extraTimePercentage: 1.5,
          sessionId,
        },
      ],
      (candidate: $TSFixMe) => new CertificationCandidate(candidate)
    );
    expect(actualCertificationCandidates).to.deep.equal(expectedCertificationCandidates);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when certification center has habilitations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return extracted and validated certification candidates with complementary certifications', async function () {
      // given
      const cleaComplementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
        label: 'CléA Numérique',
        key: CLEA,
      });
      const pixPlusDroitComplementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
        label: 'Pix+ Droit',
        key: PIX_PLUS_DROIT,
      });
      const pixPlusEdu1erDegreComplementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
        label: 'Pix+ Édu 1er degré',
        key: PIX_PLUS_EDU_1ER_DEGRE,
      });
      const pixPlusEdu2ndDegreComplementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
        label: 'Pix+ Édu 2nd degré',
        key: PIX_PLUS_EDU_2ND_DEGRE,
      });

      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({}).id;
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId,
        complementaryCertificationId: cleaComplementaryCertification.id,
      });
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId,
        complementaryCertificationId: pixPlusDroitComplementaryCertification.id,
      });
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId,
        complementaryCertificationId: pixPlusEdu1erDegreComplementaryCertification.id,
      });
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId,
        complementaryCertificationId: pixPlusEdu2ndDegreComplementaryCertification.id,
      });

      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
      const sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;

      await databaseBuilder.commit();

      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      const odsFilePath = `${__dirname}/attendance_sheet_extract_with_complementary_certifications_ok_test.ods`;
      const odsBuffer = await readFile(odsFilePath);
      const expectedCertificationCandidates = _.map(
        [
          {
            lastName: 'Gallagher',
            firstName: 'Jack',
            birthdate: '1980-08-10',
            sex: 'M',
            birthCity: 'Londres',
            birthCountry: 'ANGLETERRE',
            birthINSEECode: '99132',
            birthPostalCode: null,
            resultRecipientEmail: 'destinataire@gmail.com',
            email: 'jack@d.it',
            externalId: null,
            extraTimePercentage: 0.15,
            sessionId,
            billingMode: 'FREE',
            complementaryCertifications: [
              domainBuilder.buildComplementaryCertification(cleaComplementaryCertification),
              domainBuilder.buildComplementaryCertification(pixPlusEdu1erDegreComplementaryCertification),
            ],
          },
          {
            lastName: 'Jackson',
            firstName: 'Janet',
            birthdate: '2005-12-05',
            sex: 'F',
            birthCity: 'AJACCIO',
            birthCountry: 'FRANCE',
            birthINSEECode: '2A004',
            birthPostalCode: null,
            resultRecipientEmail: 'destinataire@gmail.com',
            email: 'jaja@hotmail.fr',
            externalId: 'DEF456',
            extraTimePercentage: null,
            sessionId,
            billingMode: 'FREE',
            complementaryCertifications: [
              domainBuilder.buildComplementaryCertification(pixPlusDroitComplementaryCertification),
            ],
          },
          {
            lastName: 'Jackson',
            firstName: 'Michael',
            birthdate: '2004-04-04',
            sex: 'M',
            birthCity: 'PARIS 18',
            birthCountry: 'FRANCE',
            birthINSEECode: null,
            birthPostalCode: '75018',
            resultRecipientEmail: 'destinataire@gmail.com',
            email: 'jackson@gmail.com',
            externalId: 'ABC123',
            extraTimePercentage: 0.6,
            sessionId,
            billingMode: 'FREE',
            complementaryCertifications: [
              domainBuilder.buildComplementaryCertification(cleaComplementaryCertification),
              domainBuilder.buildComplementaryCertification(pixPlusDroitComplementaryCertification),
              domainBuilder.buildComplementaryCertification(pixPlusEdu1erDegreComplementaryCertification),
              domainBuilder.buildComplementaryCertification(pixPlusEdu2ndDegreComplementaryCertification),
            ],
          },
          {
            lastName: 'Mercury',
            firstName: 'Freddy',
            birthdate: '1925-06-28',
            sex: 'M',
            birthCity: 'SAINT-ANNE',
            birthCountry: 'FRANCE',
            birthINSEECode: null,
            birthPostalCode: '97180',
            resultRecipientEmail: null,
            email: null,
            externalId: 'GHI789',
            extraTimePercentage: 1.5,
            sessionId,
            billingMode: 'FREE',
            complementaryCertifications: [
              domainBuilder.buildComplementaryCertification(pixPlusEdu2ndDegreComplementaryCertification),
            ],
          },
        ],
        (candidate: $TSFixMe) => new CertificationCandidate(candidate)
      );

      // when
      const actualCertificationCandidates =
        await certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet({
          sessionId,
          odsBuffer,
          certificationCpfService,
          certificationCpfCountryRepository,
          certificationCpfCityRepository,
          certificationCenterRepository,
          complementaryCertificationRepository,
          isSco: false,
        });

      // then
      expect(actualCertificationCandidates).to.deep.equal(expectedCertificationCandidates);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return extracted and validated certification candidates with billing information', async function () {
    // given
    const isSco = false;

    const userId = databaseBuilder.factory.buildUser().id;
    const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
    databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
    const sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;

    await databaseBuilder.commit();

    // @ts-expect-error TS(2304): Cannot find name '__dirname'.
    const odsFilePath = `${__dirname}/attendance_sheet_extract_with_billing_ok_test.ods`;
    const odsBuffer = await readFile(odsFilePath);
    const expectedCertificationCandidates = _.map(
      [
        {
          lastName: 'Gallagher',
          firstName: 'Jack',
          birthdate: '1980-08-10',
          sex: 'M',
          birthCity: 'Londres',
          birthCountry: 'ANGLETERRE',
          birthINSEECode: '99132',
          birthPostalCode: null,
          resultRecipientEmail: 'destinataire@gmail.com',
          email: 'jack@d.it',
          externalId: null,
          extraTimePercentage: 0.15,
          sessionId,
          billingMode: 'PAID',
        },
        {
          lastName: 'Jackson',
          firstName: 'Janet',
          birthdate: '2005-12-05',
          sex: 'F',
          birthCity: 'AJACCIO',
          birthCountry: 'FRANCE',
          birthINSEECode: '2A004',
          birthPostalCode: null,
          resultRecipientEmail: 'destinataire@gmail.com',
          email: 'jaja@hotmail.fr',
          externalId: 'DEF456',
          extraTimePercentage: null,
          sessionId,
          billingMode: 'FREE',
        },
        {
          lastName: 'Jackson',
          firstName: 'Michael',
          birthdate: '2004-04-04',
          sex: 'M',
          birthCity: 'PARIS 18',
          birthCountry: 'FRANCE',
          birthINSEECode: null,
          birthPostalCode: '75018',
          resultRecipientEmail: 'destinataire@gmail.com',
          email: 'jackson@gmail.com',
          externalId: 'ABC123',
          extraTimePercentage: 0.6,
          sessionId,
          billingMode: 'FREE',
        },
        {
          lastName: 'Mercury',
          firstName: 'Freddy',
          birthdate: '1925-06-28',
          sex: 'M',
          birthCity: 'SAINT-ANNE',
          birthCountry: 'FRANCE',
          birthINSEECode: null,
          birthPostalCode: '97180',
          resultRecipientEmail: null,
          email: null,
          externalId: 'GHI789',
          extraTimePercentage: 1.5,
          sessionId,
          billingMode: 'PREPAID',
          prepaymentCode: 'CODE1',
        },
      ],
      (candidate: $TSFixMe) => new CertificationCandidate(candidate)
    );

    // when
    const actualCertificationCandidates =
      await certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet({
        sessionId,
        isSco,
        odsBuffer,
        certificationCpfService,
        certificationCpfCountryRepository,
        certificationCpfCityRepository,
        certificationCenterRepository,
        complementaryCertificationRepository,
      });

    // then
    expect(actualCertificationCandidates).to.deep.equal(expectedCertificationCandidates);
  });
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return extracted and validated certification candidates without billing information when certification center is AEFE', async function () {
    // given
    const isSco = true;
    // @ts-expect-error TS(2304): Cannot find name '__dirname'.
    const odsFilePath = `${__dirname}/attendance_sheet_extract_ok_test.ods`;
    const odsBuffer = await readFile(odsFilePath);

    // when
    const actualCertificationCandidates =
      await certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet({
        sessionId,
        isSco,
        odsBuffer,
        certificationCpfService,
        certificationCpfCountryRepository,
        certificationCpfCityRepository,
        certificationCenterRepository,
        complementaryCertificationRepository,
      });

    // then
    const expectedCertificationCandidates = _.map(
      [
        {
          lastName: 'Gallagher',
          firstName: 'Jack',
          birthdate: '1980-08-10',
          sex: 'M',
          birthCity: 'Londres',
          birthCountry: 'ANGLETERRE',
          birthINSEECode: '99132',
          birthPostalCode: null,
          resultRecipientEmail: 'destinataire@gmail.com',
          email: 'jack@d.it',
          externalId: null,
          extraTimePercentage: 0.15,
          sessionId,
        },
        {
          lastName: 'Jackson',
          firstName: 'Janet',
          birthdate: '2005-12-05',
          sex: 'F',
          birthCity: 'AJACCIO',
          birthCountry: 'FRANCE',
          birthINSEECode: '2A004',
          birthPostalCode: null,
          resultRecipientEmail: 'destinataire@gmail.com',
          email: 'jaja@hotmail.fr',
          externalId: 'DEF456',
          extraTimePercentage: null,
          sessionId,
        },
        {
          lastName: 'Jackson',
          firstName: 'Michael',
          birthdate: '2004-04-04',
          sex: 'M',
          birthCity: 'PARIS 18',
          birthCountry: 'FRANCE',
          birthINSEECode: null,
          birthPostalCode: '75018',
          resultRecipientEmail: 'destinataire@gmail.com',
          email: 'jackson@gmail.com',
          externalId: 'ABC123',
          extraTimePercentage: 0.6,
          sessionId,
        },
        {
          lastName: 'Mercury',
          firstName: 'Freddy',
          birthdate: '1925-06-28',
          sex: 'M',
          birthCity: 'SAINT-ANNE',
          birthCountry: 'FRANCE',
          birthINSEECode: null,
          birthPostalCode: '97180',
          resultRecipientEmail: null,
          email: null,
          externalId: 'GHI789',
          extraTimePercentage: 1.5,
          sessionId,
        },
      ],
      (candidate: $TSFixMe) => new CertificationCandidate(candidate)
    );
    expect(actualCertificationCandidates).to.deep.equal(expectedCertificationCandidates);
  });
});
