// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'iconv'.
const iconv = require('iconv-lite');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('events').EventEmitter.defaultMaxListeners = 60;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearnerColumns = require('../../../../lib/infrastructure/serializers/csv/organization-learner-columns');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../tooling/i18n/i18n');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'i18n'.
const i18n = getI18n();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerCsvColumns = new OrganizationLearnerColumns(i18n).columns
  .map((column: $TSFixMe) => column.label)
  .join(';');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Application | organization-controller-import-sco-organization-learners', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organizations/{id}/schooling-registrations/import-siecle', function () {
    const externalId = 'UAI123ABC';
    let organizationId: $TSFixMe;
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const connectedUser = databaseBuilder.factory.buildUser();
      organizationId = databaseBuilder.factory.buildOrganization({
        type: 'SCO',
        isManagingStudents: true,
        externalId,
      }).id;
      databaseBuilder.factory.buildMembership({
        organizationId,
        userId: connectedUser.id,
        organizationRole: Membership.roles.ADMIN,
      });
      await databaseBuilder.commit();

      options = {
        method: 'POST',
        url: `/api/organizations/${organizationId}/schooling-registrations/import-siecle`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(connectedUser.id),
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('organization-learners').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When a XML SIECLE file is loaded', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when no organizationLearner has been imported yet, and the file is well formatted', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          const buffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              '<ELEVE ELEVE_ID="0001">' +
              '<ID_NATIONAL>0000000001X</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>HANDMADE</NOM_DE_FAMILLE>' +
              '<NOM_USAGE></NOM_USAGE>' +
              '<PRENOM>Luciole</PRENOM>' +
              '<PRENOM2>Léa</PRENOM2>' +
              '<PRENOM3>Lucy</PRENOM3>' +
              '<DATE_NAISS>31/12/1994</DATE_NAISS>' +
              '<CODE_PAYS>100</CODE_PAYS>' +
              '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
              '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
              '<CODE_MEF>123456789</CODE_MEF>' +
              '<CODE_STATUT>AP</CODE_STATUT>' +
              '</ELEVE>' +
              '<ELEVE ELEVE_ID="0002">' +
              '<ID_NATIONAL>00000000124</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
              '<NOM_USAGE>COJAUNE</NOM_USAGE>' +
              '<PRENOM>Harry</PRENOM>' +
              '<PRENOM2>Coco</PRENOM2>' +
              '<PRENOM3></PRENOM3>' +
              '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
              '<CODE_PAYS>132</CODE_PAYS>' +
              '<VILLE_NAISS>LONDRES</VILLE_NAISS>' +
              '<CODE_MEF>12341234</CODE_MEF>' +
              '<CODE_STATUT>ST</CODE_STATUT>' +
              '</ELEVE>' +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0002">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );
          options.payload = buffer;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 204 - no content', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create all organizationLearners', async function () {
          // when
          await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(2);
          expect(_.map(organizationLearners, 'firstName')).to.have.members(['Luciole', 'Harry']);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when organizationLearners have been already imported, and the file is well formatted', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          databaseBuilder.factory.buildOrganizationLearner({ nationalStudentId: '0000000001Y', organizationId });
          await databaseBuilder.commit();

          const buffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              '<ELEVE ELEVE_ID="0001">' +
              '<ID_NATIONAL>0000000001X</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>HANDMADE</NOM_DE_FAMILLE>' +
              '<NOM_USAGE></NOM_USAGE>' +
              '<PRENOM>Luciole</PRENOM>' +
              '<PRENOM2>Léa</PRENOM2>' +
              '<PRENOM3>Lucy</PRENOM3>' +
              '<DATE_NAISS>31/12/1994</DATE_NAISS>' +
              '<CODE_PAYS>100</CODE_PAYS>' +
              '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
              '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
              '<CODE_MEF>123456789</CODE_MEF>' +
              '<CODE_STATUT>AP</CODE_STATUT>' +
              '</ELEVE>' +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );
          options.payload = buffer;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 204 - no content', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should disable old organization learners', async function () {
          // when
          await server.inject(options);

          // then
          const organizationLearner = await knex('organization-learners')
            .where({ nationalStudentId: '0000000001Y' })
            .first();
          expect(organizationLearner.isDisabled).to.be.true;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when some organizationLearners data are not well formatted', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // given
          const wellFormattedStudent =
            '<ELEVE ELEVE_ID="0001">' +
            '<ID_NATIONAL>00000000123</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>HANDMADE</NOM_DE_FAMILLE>' +
            '<NOM_USAGE></NOM_USAGE>' +
            '<PRENOM>Luciole</PRENOM>' +
            '<PRENOM2>Léa</PRENOM2>' +
            '<PRENOM3>Lucy</PRENOM3>' +
            '<DATE_NAISS>31/12/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>123456789</CODE_MEF>' +
            '<CODE_STATUT>AP</CODE_STATUT>' +
            '</ELEVE>';

          const malformedStudentsBuffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              wellFormattedStudent +
              '<ELEVE ELEVE_ID="0002">' +
              '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
              '<NOM_USAGE>COJAUNE</NOM_USAGE>' +
              '<PRENOM>Harry</PRENOM>' +
              '<PRENOM2>Coco</PRENOM2>' +
              '<PRENOM3></PRENOM3>' +
              '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
              '<CODE_PAYS>100</CODE_PAYS>' +
              '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
              '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
              '<CODE_MEF>12341234</CODE_MEF>' +
              '<CODE_STATUT>ST</CODE_STATUT>' +
              '</ELEVE>' +
              '<ELEVE ELEVE_ID="0003">' +
              '<ID_NATIONAL>00000000124</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>DAUMUR</NOM_DE_FAMILLE>' +
              '<PRENOM>Bran</PRENOM>' +
              '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
              '<CODE_PAYS>100</CODE_PAYS>' +
              '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
              '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
              '<CODE_MEF>12341234</CODE_MEF>' +
              '<CODE_STATUT>ST</CODE_STATUT>' +
              '</ELEVE>' +
              '<ELEVE ELEVE_ID="0004">' +
              '<ID_NATIONAL>00000000125</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>FRAS</NOM_DE_FAMILLE>' +
              '<PRENOM>Valentin</PRENOM>' +
              '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
              '<CODE_PAYS>100</CODE_PAYS>' +
              '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
              '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
              '<CODE_MEF>12341234</CODE_MEF>' +
              '<CODE_STATUT>ST</CODE_STATUT>' +
              '</ELEVE>' +
              '<ELEVE ELEVE_ID="0005">' +
              '<ID_NATIONAL>00000000126</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>VANDOU</NOM_DE_FAMILLE>' +
              '<PRENOM>Hubert</PRENOM>' +
              '<DATE_NAISS>31/08/2009</DATE_NAISS>' +
              '<DATE_SORTIE>01/09/2019</DATE_SORTIE>' +
              '<CODE_PAYS>100</CODE_PAYS>' +
              '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
              '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
              '<CODE_MEF>12341234</CODE_MEF>' +
              '<CODE_STATUT>ST</CODE_STATUT>' +
              '</ELEVE>' +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0002">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0004">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>Inactifs</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0005">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>5B</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );

          options.payload = malformedStudentsBuffer;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should save well formatted organizationLearners only', async function () {
          // when
          await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(1);
          expect(organizationLearners[0].lastName).to.equal('HANDMADE');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the organizationLearner has already been imported, but in another organization', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildOrganizationLearner({
            nationalStudentId: '00000000124',
            organizationId: otherOrganizationId,
          });
          await databaseBuilder.commit();

          const buffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              '<ELEVE ELEVE_ID="0001">' +
              '<ID_NATIONAL>00000000124</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
              '<NOM_USAGE>COJAUNE</NOM_USAGE>' +
              '<PRENOM>Harry</PRENOM>' +
              '<PRENOM2>Coco</PRENOM2>' +
              '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
              '<CODE_PAYS>132</CODE_PAYS>' +
              '<VILLE_NAISS>LONDRES</VILLE_NAISS>' +
              '<CODE_MEF>12341234</CODE_MEF>' +
              '<CODE_STATUT>ST</CODE_STATUT>' +
              '</ELEVE>' +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );

          options.payload = buffer;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should save the organizationLearner in the current organization', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({
            nationalStudentId: '00000000124',
          });
          expect(organizationLearners).to.have.lengthOf(2);
          expect(response.statusCode).to.equal(204);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organizationLearneris present twice in the file', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationLearner1 =
            '<ELEVE ELEVE_ID="0001">' +
            '<ID_NATIONAL>00000000123</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
            '<PRENOM>Harry</PRENOM>' +
            '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const organizationLearner2 =
            '<ELEVE ELEVE_ID="0002">' +
            '<ID_NATIONAL>00000000123</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
            '<PRENOM>Harry</PRENOM>' +
            '<DATE_NAISS>02/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const bufferWithMalformedStudent = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              organizationLearner1 +
              organizationLearner2 +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0002">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );

          options.payload = bufferWithMalformedStudent;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not import any organizationLearner and return a 412', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(0);
          expect(response.statusCode).to.equal(412);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organizationLearnercant be updated', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationLearnerThatCantBeUpdatedBecauseBirthdateIsMissing =
            '<ELEVE ELEVE_ID="0001">' +
            '<ID_NATIONAL>00000000456</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
            '<NOM_USAGE>COJAUNE</NOM_USAGE>' +
            '<PRENOM>Harry</PRENOM>' +
            '<PRENOM2>Coco</PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS></DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const organizationLearnerThatCouldBeUpdated =
            '<ELEVE ELEVE_ID="0002">' +
            '<ID_NATIONAL>00000000123</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>JAUNE</NOM_DE_FAMILLE>' +
            '<NOM_USAGE></NOM_USAGE>' +
            '<PRENOM>ATTEND</PRENOM>' +
            '<PRENOM2></PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const bufferWithMalformedStudent = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              organizationLearnerThatCantBeUpdatedBecauseBirthdateIsMissing +
              organizationLearnerThatCouldBeUpdated +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0002">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0003">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );

          options.payload = bufferWithMalformedStudent;

          databaseBuilder.factory.buildOrganizationLearner({
            lastName: 'LALOUX',
            firstName: 'RENE',
            nationalStudentId: '123',
            organizationId,
          });
          databaseBuilder.factory.buildOrganizationLearner({
            lastName: 'UEMATSU',
            firstName: 'NOBUO',
            nationalStudentId: '456',
            organizationId,
          });

          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not update any organizationLearner and return a 400 - Bad Request', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(_.map(organizationLearners, 'lastName')).to.have.members(['LALOUX', 'UEMATSU']);
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organizationLearnercant be updated but another could be created', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationLearnerThatCouldBeCreated =
            '<ELEVE ELEVE_ID="0001">' +
            '<ID_NATIONAL>123</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COLAGRECO</NOM_DE_FAMILLE>' +
            '<NOM_USAGE>PEPSIGRECO</NOM_USAGE>' +
            '<PRENOM>ARNAUD</PRENOM>' +
            '<PRENOM2></PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const organizationLearnerThatCantBeUpdatedBecauseBirthdateIsMissing =
            '<ELEVE ELEVE_ID="0002">' +
            '<ID_NATIONAL>456</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
            '<NOM_USAGE>COJAUNE</NOM_USAGE>' +
            '<PRENOM>Harry</PRENOM>' +
            '<PRENOM2>Coco</PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS></DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const organizationLearnerThatCouldBeUpdated =
            '<ELEVE ELEVE_ID="0003">' +
            '<ID_NATIONAL>789</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>JAUNE</NOM_DE_FAMILLE>' +
            '<NOM_USAGE></NOM_USAGE>' +
            '<PRENOM>ATTEND</PRENOM>' +
            '<PRENOM2></PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const buffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              organizationLearnerThatCouldBeCreated +
              organizationLearnerThatCantBeUpdatedBecauseBirthdateIsMissing +
              organizationLearnerThatCouldBeUpdated +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0002">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );

          options.payload = buffer;

          databaseBuilder.factory.buildOrganizationLearner({
            lastName: 'LALOUX',
            firstName: 'RENE',
            nationalStudentId: '456',
            organizationId,
          });
          databaseBuilder.factory.buildOrganizationLearner({
            lastName: 'UEMATSU',
            firstName: 'NOBUO',
            nationalStudentId: '789',
            organizationId,
          });

          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not update and create anyone, and return a 400 - Bad Request', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(2);
          expect(_.map(organizationLearners, 'lastName')).to.have.members(['LALOUX', 'UEMATSU']);
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organizationLearnercant be created but another could be updated', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationLearnerThatCantBeCreatedBecauseBirthdateIsMissing =
            '<ELEVE ELEVE_ID="0001">' +
            '<ID_NATIONAL>123</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COLAGRECO</NOM_DE_FAMILLE>' +
            '<NOM_USAGE>PEPSIGRECO</NOM_USAGE>' +
            '<PRENOM>ARNAUD</PRENOM>' +
            '<PRENOM2></PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS></DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const organizationLearnerThatCouldBeCreated =
            '<ELEVE ELEVE_ID="0002">' +
            '<ID_NATIONAL>456</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
            '<NOM_USAGE>COJAUNE</NOM_USAGE>' +
            '<PRENOM>Harry</PRENOM>' +
            '<PRENOM2>Coco</PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const organizationLearnerThatCouldBeUpdated =
            '<ELEVE ELEVE_ID="0003">' +
            '<ID_NATIONAL>789</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>JAUNE</NOM_DE_FAMILLE>' +
            '<NOM_USAGE></NOM_USAGE>' +
            '<PRENOM>ATTEND</PRENOM>' +
            '<PRENOM2></PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const buffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              organizationLearnerThatCantBeCreatedBecauseBirthdateIsMissing +
              organizationLearnerThatCouldBeCreated +
              organizationLearnerThatCouldBeUpdated +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0002">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0003">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );

          options.payload = buffer;

          databaseBuilder.factory.buildOrganizationLearner({
            lastName: 'LALOUX',
            firstName: 'RENE',
            nationalStudentId: '789',
            organizationId,
          });

          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not update and create anyone, and return a 400 - Bad Request', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(1);
          expect(_.map(organizationLearners, 'lastName')).to.have.members(['LALOUX']);
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organizationLearner cant be imported', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // given
          const malformedStudentsBuffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              '<ELEVE ELEVE_ID="0001">' +
              '<ID_NATIONAL>123</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>WRONG</NOM_DE_FAMILLE>' +
              '<PRENOM>Person</PRENOM>' +
              '</ELEVE>' +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );
          options.payload = malformedStudentsBuffer;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not import the organizationLearner and return a 400 - Bad Request', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(0);
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when file in not properly formatted', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // given
          const malformedBuffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );
          options.payload = malformedBuffer;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 412 - Precondition Failed', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(0);
          expect(response.statusCode).to.equal(412);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when file is too large', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // given
          options.payload = Buffer.alloc(1048576 * 21, 'B'); // > 20 Mo buffer
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 413 - Payload too large', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(413);
          expect(response.result.errors[0].code).to.equal('PAYLOAD_TOO_LARGE');
          expect(response.result.errors[0].meta.maxSize).to.equal('20');
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When a CSV SIECLE file is loaded', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('SCO : when no organization learner has been imported yet, and the file is well formatted', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          const input = `${organizationLearnerCsvColumns}
          123F;Beatrix;The;Bride;Kiddo;Black Mamba;;01/01/1970;97422;;200;99100;ST;MEF1;Division 1;
          456F;O-Ren;;;Ishii;Cottonmouth;;01/01/1980;;Shangai;99;99132;ST;MEF1;Division 2;
          `;
          const buffer = iconv.encode(input, 'UTF-8');

          (options.url = `/api/organizations/${organizationId}/schooling-registrations/import-siecle?format=csv`),
            (options.payload = buffer);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 204 - no content', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create all organizationLearners', async function () {
          // when
          await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(2);
          expect(_.map(organizationLearners, 'firstName')).to.have.members(['Beatrix', 'O-Ren']);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('SCO : when no organization learner has been imported yet', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          const input = `${organizationLearnerCsvColumns}
            123F;Beatrix;The;Bride;Kiddo;Black Mamba;f;01/01/1970;97422;;200;99100;ST;MEF1;Division 1;
            456F;O-Ren;;;Ishii;Cottonmouth;M;01/01/1980;;Shangai;99;99132;ST;MEF1;Division 2;
            `;
          const buffer = iconv.encode(input, 'UTF-8');

          (options.url = `/api/organizations/${organizationId}/schooling-registrations/import-siecle?format=csv`),
            (options.payload = buffer);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 204 - no content', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create all organizationLearners', async function () {
          // when
          await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(2);
          expect(_.map(organizationLearners, 'firstName')).to.have.members(['Beatrix', 'O-Ren']);
          expect(_.map(organizationLearners, 'sex')).to.have.members(['F', 'M']);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when some organization learners data are not well formatted', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not save any organization learner with missing family name', async function () {
          // given
          const input = `${organizationLearnerCsvColumns}
           123F;Beatrix;The;Bride;Kiddo;Black Mamba;;01/01/1970;97422;;200;99100;ST;MEF1;Division 1;
           456F;O-Ren;;;;Cottonmouth;;01/01/1980;;Shangai;99;99132;ST;MEF1;Division 2;
           `;
          const buffer = iconv.encode(input, 'UTF-8');

          (options.url = `/api/organizations/${organizationId}/schooling-registrations/import-siecle?format=csv`),
            (options.payload = buffer);

          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(0);
          expect(response.statusCode).to.equal(412);
          expect(response.result.errors[0].code).to.equal('FIELD_REQUIRED');
          expect(response.result.errors[0].meta.field).to.equal('Nom de famille*');
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not save any organization learner with wrong birthCountryCode', async function () {
          const wrongData = 'FRANC';
          // given
          const input = `${organizationLearnerCsvColumns}
           123F;Beatrix;The;Bride;Kiddo;Black Mamba;;01/01/1970;51430;Reims;200;${wrongData};ST;MEF1;Division 1;
           `;
          const buffer = iconv.encode(input, 'UTF-8');

          (options.url = `/api/organizations/${organizationId}/schooling-registrations/import-siecle?format=csv`),
            (options.payload = buffer);

          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });

          expect(organizationLearners).to.have.lengthOf(0);
          expect(response.statusCode).to.equal(412);
          expect(response.result.errors[0].code).to.equal('INSEE_CODE_INVALID');
          expect(response.result.errors[0].meta.field).to.equal('Code pays naissance*');
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not save any organization learner with wrong birthCityCode', async function () {
          const wrongData = 'A1234';
          // given
          const input = `${organizationLearnerCsvColumns}
           123F;Beatrix;The;Bride;Kiddo;Black Mamba;;01/01/1970;${wrongData};Reims;200;99100;ST;MEF1;Division 1;
           `;
          const buffer = iconv.encode(input, 'UTF-8');

          (options.url = `/api/organizations/${organizationId}/schooling-registrations/import-siecle?format=csv`),
            (options.payload = buffer);

          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });

          expect(organizationLearners).to.have.lengthOf(0);
          expect(response.statusCode).to.equal(412);
          expect(response.result.errors[0].code).to.equal('INSEE_CODE_INVALID');
          expect(response.result.errors[0].meta.field).to.equal('Code commune naissance**');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context(
        'when an organization learner has the same national student id than an other one in the file',
        function () {
          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            const input = `${organizationLearnerCsvColumns}
          123F;Beatrix;The;Bride;Kiddo;Black Mamba;;01/01/1970;97422;;200;99100;ST;MEF1;Division 1;
          123F;O-Ren;;;Ishii;Cottonmouth;;01/01/1980;;Shangai;99;99132;ST;MEF1;Division 2;
          `;
            const buffer = iconv.encode(input, 'UTF-8');

            (options.url = `/api/organizations/${organizationId}/schooling-registrations/import-siecle?format=csv`),
              (options.payload = buffer);
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should not import any organizationLearner and return a 412', async function () {
            // when
            const response = await server.inject(options);

            // then
            const organizationLearners = await knex('organization-learners').where({ organizationId });

            expect(organizationLearners).to.have.lengthOf(0);
            expect(response.statusCode).to.equal(412);
            expect(response.result.errors[0].code).to.equal('IDENTIFIER_UNIQUE');
          });
        }
      );
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Resource access management', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const buffer = iconv.encode(
          '<?xml version="1.0" encoding="ISO-8859-15"?>' +
            '<BEE_ELEVES VERSION="2.1">' +
            '<PARAMETRES>' +
            '<UAJ>UAI123ABC</UAJ>' +
            '</PARAMETRES>' +
            '</BEE_ELEVES>',
          'ISO-8859-15'
        );
        options.payload = buffer;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user is not authenticated', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // given
          options.headers.authorization = 'invalid.access.token';
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 401 - unauthorized access', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(401);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user user does not belong to Organization', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const userId = databaseBuilder.factory.buildUser.withMembership().id;
          await databaseBuilder.commit();

          options.headers.authorization = generateValidRequestAuthorizationHeader(userId);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 403 - Forbidden access', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(403);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when Organization does not manage organizationLearners', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationId = databaseBuilder.factory.buildOrganization({
            type: 'SCO',
            isManagingStudents: false,
          }).id;
          const userId = databaseBuilder.factory.buildUser.withMembership({
            organizationId,
            organizationRole: Membership.roles.ADMIN,
          }).id;
          await databaseBuilder.commit();

          options.headers.authorization = generateValidRequestAuthorizationHeader(userId);
          options.url = `/api/organizations/${organizationId}/schooling-registrations/import-siecle`;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 403 - Forbidden access', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(403);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when Organization is not a SCO organization', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationId = databaseBuilder.factory.buildOrganization({
            type: 'SUP',
            isManagingStudents: true,
          }).id;
          const userId = databaseBuilder.factory.buildUser.withMembership({
            organizationId,
            organizationRole: Membership.roles.ADMIN,
          }).id;
          await databaseBuilder.commit();

          options.headers.authorization = generateValidRequestAuthorizationHeader(userId);
          options.url = `/api/organizations/${organizationId}/schooling-registrations/import-siecle`;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 403 - Forbidden access', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(403);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user is not ADMIN', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationId = databaseBuilder.factory.buildOrganization({
            type: 'SCO',
            isManagingStudents: true,
          }).id;
          const userId = databaseBuilder.factory.buildUser.withMembership({
            organizationId,
            organizationRole: Membership.roles.MEMBER,
          }).id;
          await databaseBuilder.commit();

          options.headers.authorization = generateValidRequestAuthorizationHeader(userId);
          options.url = `/api/organizations/${organizationId}/schooling-registrations/import-siecle`;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 403 - Forbidden access', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/organizations/{id}/sco-organization-learners/import-siecle', function () {
    const externalId = 'UAI123ABC';
    let organizationId: $TSFixMe;
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const connectedUser = databaseBuilder.factory.buildUser();
      organizationId = databaseBuilder.factory.buildOrganization({
        type: 'SCO',
        isManagingStudents: true,
        externalId,
      }).id;
      databaseBuilder.factory.buildMembership({
        organizationId,
        userId: connectedUser.id,
        organizationRole: Membership.roles.ADMIN,
      });
      await databaseBuilder.commit();

      options = {
        method: 'POST',
        url: `/api/organizations/${organizationId}/sco-organization-learners/import-siecle`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(connectedUser.id),
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('organization-learners').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When a XML SIECLE file is loaded', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when no organizationLearner has been imported yet, and the file is well formatted', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          const buffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              '<ELEVE ELEVE_ID="0001">' +
              '<ID_NATIONAL>0000000001X</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>HANDMADE</NOM_DE_FAMILLE>' +
              '<NOM_USAGE></NOM_USAGE>' +
              '<PRENOM>Luciole</PRENOM>' +
              '<PRENOM2>Léa</PRENOM2>' +
              '<PRENOM3>Lucy</PRENOM3>' +
              '<DATE_NAISS>31/12/1994</DATE_NAISS>' +
              '<CODE_PAYS>100</CODE_PAYS>' +
              '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
              '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
              '<CODE_MEF>123456789</CODE_MEF>' +
              '<CODE_STATUT>AP</CODE_STATUT>' +
              '</ELEVE>' +
              '<ELEVE ELEVE_ID="0002">' +
              '<ID_NATIONAL>00000000124</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
              '<NOM_USAGE>COJAUNE</NOM_USAGE>' +
              '<PRENOM>Harry</PRENOM>' +
              '<PRENOM2>Coco</PRENOM2>' +
              '<PRENOM3></PRENOM3>' +
              '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
              '<CODE_PAYS>132</CODE_PAYS>' +
              '<VILLE_NAISS>LONDRES</VILLE_NAISS>' +
              '<CODE_MEF>12341234</CODE_MEF>' +
              '<CODE_STATUT>ST</CODE_STATUT>' +
              '</ELEVE>' +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0002">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );
          options.payload = buffer;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 204 - no content', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create all organizationLearners', async function () {
          // when
          await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(2);
          expect(_.map(organizationLearners, 'firstName')).to.have.members(['Luciole', 'Harry']);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when organizationLearners have been already imported, and the file is well formatted', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          databaseBuilder.factory.buildOrganizationLearner({ nationalStudentId: '0000000001Y', organizationId });
          await databaseBuilder.commit();

          const buffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              '<ELEVE ELEVE_ID="0001">' +
              '<ID_NATIONAL>0000000001X</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>HANDMADE</NOM_DE_FAMILLE>' +
              '<NOM_USAGE></NOM_USAGE>' +
              '<PRENOM>Luciole</PRENOM>' +
              '<PRENOM2>Léa</PRENOM2>' +
              '<PRENOM3>Lucy</PRENOM3>' +
              '<DATE_NAISS>31/12/1994</DATE_NAISS>' +
              '<CODE_PAYS>100</CODE_PAYS>' +
              '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
              '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
              '<CODE_MEF>123456789</CODE_MEF>' +
              '<CODE_STATUT>AP</CODE_STATUT>' +
              '</ELEVE>' +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );
          options.payload = buffer;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 204 - no content', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should disable old organization learners', async function () {
          // when
          await server.inject(options);

          // then
          const organizationLearner = await knex('organization-learners')
            .where({ nationalStudentId: '0000000001Y' })
            .first();
          expect(organizationLearner.isDisabled).to.be.true;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when some organizationLearners data are not well formatted', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // given
          const wellFormattedStudent =
            '<ELEVE ELEVE_ID="0001">' +
            '<ID_NATIONAL>00000000123</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>HANDMADE</NOM_DE_FAMILLE>' +
            '<NOM_USAGE></NOM_USAGE>' +
            '<PRENOM>Luciole</PRENOM>' +
            '<PRENOM2>Léa</PRENOM2>' +
            '<PRENOM3>Lucy</PRENOM3>' +
            '<DATE_NAISS>31/12/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>123456789</CODE_MEF>' +
            '<CODE_STATUT>AP</CODE_STATUT>' +
            '</ELEVE>';

          const malformedStudentsBuffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              wellFormattedStudent +
              '<ELEVE ELEVE_ID="0002">' +
              '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
              '<NOM_USAGE>COJAUNE</NOM_USAGE>' +
              '<PRENOM>Harry</PRENOM>' +
              '<PRENOM2>Coco</PRENOM2>' +
              '<PRENOM3></PRENOM3>' +
              '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
              '<CODE_PAYS>100</CODE_PAYS>' +
              '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
              '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
              '<CODE_MEF>12341234</CODE_MEF>' +
              '<CODE_STATUT>ST</CODE_STATUT>' +
              '</ELEVE>' +
              '<ELEVE ELEVE_ID="0003">' +
              '<ID_NATIONAL>00000000124</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>DAUMUR</NOM_DE_FAMILLE>' +
              '<PRENOM>Bran</PRENOM>' +
              '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
              '<CODE_PAYS>100</CODE_PAYS>' +
              '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
              '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
              '<CODE_MEF>12341234</CODE_MEF>' +
              '<CODE_STATUT>ST</CODE_STATUT>' +
              '</ELEVE>' +
              '<ELEVE ELEVE_ID="0004">' +
              '<ID_NATIONAL>00000000125</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>FRAS</NOM_DE_FAMILLE>' +
              '<PRENOM>Valentin</PRENOM>' +
              '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
              '<CODE_PAYS>100</CODE_PAYS>' +
              '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
              '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
              '<CODE_MEF>12341234</CODE_MEF>' +
              '<CODE_STATUT>ST</CODE_STATUT>' +
              '</ELEVE>' +
              '<ELEVE ELEVE_ID="0005">' +
              '<ID_NATIONAL>00000000126</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>VANDOU</NOM_DE_FAMILLE>' +
              '<PRENOM>Hubert</PRENOM>' +
              '<DATE_NAISS>31/08/2009</DATE_NAISS>' +
              '<DATE_SORTIE>01/09/2019</DATE_SORTIE>' +
              '<CODE_PAYS>100</CODE_PAYS>' +
              '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
              '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
              '<CODE_MEF>12341234</CODE_MEF>' +
              '<CODE_STATUT>ST</CODE_STATUT>' +
              '</ELEVE>' +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0002">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0004">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>Inactifs</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0005">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>5B</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );

          options.payload = malformedStudentsBuffer;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should save well formatted organizationLearners only', async function () {
          // when
          await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(1);
          expect(organizationLearners[0].lastName).to.equal('HANDMADE');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the organizationLearner has already been imported, but in another organization', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildOrganizationLearner({
            nationalStudentId: '00000000124',
            organizationId: otherOrganizationId,
          });
          await databaseBuilder.commit();

          const buffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              '<ELEVE ELEVE_ID="0001">' +
              '<ID_NATIONAL>00000000124</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
              '<NOM_USAGE>COJAUNE</NOM_USAGE>' +
              '<PRENOM>Harry</PRENOM>' +
              '<PRENOM2>Coco</PRENOM2>' +
              '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
              '<CODE_PAYS>132</CODE_PAYS>' +
              '<VILLE_NAISS>LONDRES</VILLE_NAISS>' +
              '<CODE_MEF>12341234</CODE_MEF>' +
              '<CODE_STATUT>ST</CODE_STATUT>' +
              '</ELEVE>' +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );

          options.payload = buffer;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should save the organizationLearner in the current organization', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({
            nationalStudentId: '00000000124',
          });
          expect(organizationLearners).to.have.lengthOf(2);
          expect(response.statusCode).to.equal(204);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organizationLearneris present twice in the file', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationLearner1 =
            '<ELEVE ELEVE_ID="0001">' +
            '<ID_NATIONAL>00000000123</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
            '<PRENOM>Harry</PRENOM>' +
            '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const organizationLearner2 =
            '<ELEVE ELEVE_ID="0002">' +
            '<ID_NATIONAL>00000000123</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
            '<PRENOM>Harry</PRENOM>' +
            '<DATE_NAISS>02/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const bufferWithMalformedStudent = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              organizationLearner1 +
              organizationLearner2 +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0002">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );

          options.payload = bufferWithMalformedStudent;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not import any organizationLearner and return a 412', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(0);
          expect(response.statusCode).to.equal(412);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organizationLearnercant be updated', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationLearnerThatCantBeUpdatedBecauseBirthdateIsMissing =
            '<ELEVE ELEVE_ID="0001">' +
            '<ID_NATIONAL>00000000456</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
            '<NOM_USAGE>COJAUNE</NOM_USAGE>' +
            '<PRENOM>Harry</PRENOM>' +
            '<PRENOM2>Coco</PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS></DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const organizationLearnerThatCouldBeUpdated =
            '<ELEVE ELEVE_ID="0002">' +
            '<ID_NATIONAL>00000000123</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>JAUNE</NOM_DE_FAMILLE>' +
            '<NOM_USAGE></NOM_USAGE>' +
            '<PRENOM>ATTEND</PRENOM>' +
            '<PRENOM2></PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const bufferWithMalformedStudent = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              organizationLearnerThatCantBeUpdatedBecauseBirthdateIsMissing +
              organizationLearnerThatCouldBeUpdated +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0002">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0003">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );

          options.payload = bufferWithMalformedStudent;

          databaseBuilder.factory.buildOrganizationLearner({
            lastName: 'LALOUX',
            firstName: 'RENE',
            nationalStudentId: '123',
            organizationId,
          });
          databaseBuilder.factory.buildOrganizationLearner({
            lastName: 'UEMATSU',
            firstName: 'NOBUO',
            nationalStudentId: '456',
            organizationId,
          });

          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not update any organizationLearner and return a 400 - Bad Request', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(_.map(organizationLearners, 'lastName')).to.have.members(['LALOUX', 'UEMATSU']);
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organizationLearnercant be updated but another could be created', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationLearnerThatCouldBeCreated =
            '<ELEVE ELEVE_ID="0001">' +
            '<ID_NATIONAL>123</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COLAGRECO</NOM_DE_FAMILLE>' +
            '<NOM_USAGE>PEPSIGRECO</NOM_USAGE>' +
            '<PRENOM>ARNAUD</PRENOM>' +
            '<PRENOM2></PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const organizationLearnerThatCantBeUpdatedBecauseBirthdateIsMissing =
            '<ELEVE ELEVE_ID="0002">' +
            '<ID_NATIONAL>456</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
            '<NOM_USAGE>COJAUNE</NOM_USAGE>' +
            '<PRENOM>Harry</PRENOM>' +
            '<PRENOM2>Coco</PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS></DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const organizationLearnerThatCouldBeUpdated =
            '<ELEVE ELEVE_ID="0003">' +
            '<ID_NATIONAL>789</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>JAUNE</NOM_DE_FAMILLE>' +
            '<NOM_USAGE></NOM_USAGE>' +
            '<PRENOM>ATTEND</PRENOM>' +
            '<PRENOM2></PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const buffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              organizationLearnerThatCouldBeCreated +
              organizationLearnerThatCantBeUpdatedBecauseBirthdateIsMissing +
              organizationLearnerThatCouldBeUpdated +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0002">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );

          options.payload = buffer;

          databaseBuilder.factory.buildOrganizationLearner({
            lastName: 'LALOUX',
            firstName: 'RENE',
            nationalStudentId: '456',
            organizationId,
          });
          databaseBuilder.factory.buildOrganizationLearner({
            lastName: 'UEMATSU',
            firstName: 'NOBUO',
            nationalStudentId: '789',
            organizationId,
          });

          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not update and create anyone, and return a 400 - Bad Request', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(2);
          expect(_.map(organizationLearners, 'lastName')).to.have.members(['LALOUX', 'UEMATSU']);
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organizationLearnercant be created but another could be updated', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationLearnerThatCantBeCreatedBecauseBirthdateIsMissing =
            '<ELEVE ELEVE_ID="0001">' +
            '<ID_NATIONAL>123</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COLAGRECO</NOM_DE_FAMILLE>' +
            '<NOM_USAGE>PEPSIGRECO</NOM_USAGE>' +
            '<PRENOM>ARNAUD</PRENOM>' +
            '<PRENOM2></PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS></DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const organizationLearnerThatCouldBeCreated =
            '<ELEVE ELEVE_ID="0002">' +
            '<ID_NATIONAL>456</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>COVERT</NOM_DE_FAMILLE>' +
            '<NOM_USAGE>COJAUNE</NOM_USAGE>' +
            '<PRENOM>Harry</PRENOM>' +
            '<PRENOM2>Coco</PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const organizationLearnerThatCouldBeUpdated =
            '<ELEVE ELEVE_ID="0003">' +
            '<ID_NATIONAL>789</ID_NATIONAL>' +
            '<NOM_DE_FAMILLE>JAUNE</NOM_DE_FAMILLE>' +
            '<NOM_USAGE></NOM_USAGE>' +
            '<PRENOM>ATTEND</PRENOM>' +
            '<PRENOM2></PRENOM2>' +
            '<PRENOM3></PRENOM3>' +
            '<DATE_NAISS>01/07/1994</DATE_NAISS>' +
            '<CODE_PAYS>100</CODE_PAYS>' +
            '<CODE_DEPARTEMENT_NAISS>033</CODE_DEPARTEMENT_NAISS>' +
            '<CODE_COMMUNE_INSEE_NAISS>33318</CODE_COMMUNE_INSEE_NAISS>' +
            '<CODE_MEF>12341234</CODE_MEF>' +
            '<CODE_STATUT>ST</CODE_STATUT>' +
            '</ELEVE>';

          const buffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              organizationLearnerThatCantBeCreatedBecauseBirthdateIsMissing +
              organizationLearnerThatCouldBeCreated +
              organizationLearnerThatCouldBeUpdated +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0002">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0003">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );

          options.payload = buffer;

          databaseBuilder.factory.buildOrganizationLearner({
            lastName: 'LALOUX',
            firstName: 'RENE',
            nationalStudentId: '789',
            organizationId,
          });

          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not update and create anyone, and return a 400 - Bad Request', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(1);
          expect(_.map(organizationLearners, 'lastName')).to.have.members(['LALOUX']);
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an organizationLearner cant be imported', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // given
          const malformedStudentsBuffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '<DONNEES>' +
              '<ELEVES>' +
              '<ELEVE ELEVE_ID="0001">' +
              '<ID_NATIONAL>123</ID_NATIONAL>' +
              '<NOM_DE_FAMILLE>WRONG</NOM_DE_FAMILLE>' +
              '<PRENOM>Person</PRENOM>' +
              '</ELEVE>' +
              '</ELEVES>' +
              '<STRUCTURES>' +
              '<STRUCTURES_ELEVE ELEVE_ID="0001">' +
              '<STRUCTURE>' +
              '<CODE_STRUCTURE>4A</CODE_STRUCTURE>' +
              '<TYPE_STRUCTURE>D</TYPE_STRUCTURE>' +
              '</STRUCTURE>' +
              '</STRUCTURES_ELEVE>' +
              '</STRUCTURES>' +
              '</DONNEES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );
          options.payload = malformedStudentsBuffer;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not import the organizationLearner and return a 400 - Bad Request', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(0);
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when file in not properly formatted', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // given
          const malformedBuffer = iconv.encode(
            '<?xml version="1.0" encoding="ISO-8859-15"?>' +
              '<BEE_ELEVES VERSION="2.1">' +
              '<PARAMETRES>' +
              '<UAJ>UAI123ABC</UAJ>' +
              '</PARAMETRES>' +
              '</BEE_ELEVES>',
            'ISO-8859-15'
          );
          options.payload = malformedBuffer;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 412 - Precondition Failed', async function () {
          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(0);
          expect(response.statusCode).to.equal(412);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when file is too large', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // given
          options.payload = Buffer.alloc(1048576 * 21, 'B'); // > 20 Mo buffer
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 413 - Payload too large', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(413);
          expect(response.result.errors[0].code).to.equal('PAYLOAD_TOO_LARGE');
          expect(response.result.errors[0].meta.maxSize).to.equal('20');
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When a CSV SIECLE file is loaded', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('SCO : when no organization learner has been imported yet, and the file is well formatted', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          const input = `${organizationLearnerCsvColumns}
          123F;Beatrix;The;Bride;Kiddo;Black Mamba;;01/01/1970;97422;;200;99100;ST;MEF1;Division 1;
          456F;O-Ren;;;Ishii;Cottonmouth;;01/01/1980;;Shangai;99;99132;ST;MEF1;Division 2;
          `;
          const buffer = iconv.encode(input, 'UTF-8');

          (options.url = `/api/organizations/${organizationId}/sco-organization-learners/import-siecle?format=csv`),
            (options.payload = buffer);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 204 - no content', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create all organizationLearners', async function () {
          // when
          await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(2);
          expect(_.map(organizationLearners, 'firstName')).to.have.members(['Beatrix', 'O-Ren']);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('SCO : when no organization learner has been imported yet', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          const input = `${organizationLearnerCsvColumns}
            123F;Beatrix;The;Bride;Kiddo;Black Mamba;f;01/01/1970;97422;;200;99100;ST;MEF1;Division 1;
            456F;O-Ren;;;Ishii;Cottonmouth;M;01/01/1980;;Shangai;99;99132;ST;MEF1;Division 2;
            `;
          const buffer = iconv.encode(input, 'UTF-8');

          (options.url = `/api/organizations/${organizationId}/sco-organization-learners/import-siecle?format=csv`),
            (options.payload = buffer);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 204 - no content', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create all organizationLearners', async function () {
          // when
          await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(2);
          expect(_.map(organizationLearners, 'firstName')).to.have.members(['Beatrix', 'O-Ren']);
          expect(_.map(organizationLearners, 'sex')).to.have.members(['F', 'M']);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when some organization learners data are not well formatted', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not save any organization learner with missing family name', async function () {
          // given
          const input = `${organizationLearnerCsvColumns}
           123F;Beatrix;The;Bride;Kiddo;Black Mamba;;01/01/1970;97422;;200;99100;ST;MEF1;Division 1;
           456F;O-Ren;;;;Cottonmouth;;01/01/1980;;Shangai;99;99132;ST;MEF1;Division 2;
           `;
          const buffer = iconv.encode(input, 'UTF-8');

          (options.url = `/api/organizations/${organizationId}/sco-organization-learners/import-siecle?format=csv`),
            (options.payload = buffer);

          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });
          expect(organizationLearners).to.have.lengthOf(0);
          expect(response.statusCode).to.equal(412);
          expect(response.result.errors[0].code).to.equal('FIELD_REQUIRED');
          expect(response.result.errors[0].meta.field).to.equal('Nom de famille*');
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not save any organization learner with wrong birthCountryCode', async function () {
          const wrongData = 'FRANC';
          // given
          const input = `${organizationLearnerCsvColumns}
           123F;Beatrix;The;Bride;Kiddo;Black Mamba;;01/01/1970;51430;Reims;200;${wrongData};ST;MEF1;Division 1;
           `;
          const buffer = iconv.encode(input, 'UTF-8');

          (options.url = `/api/organizations/${organizationId}/sco-organization-learners/import-siecle?format=csv`),
            (options.payload = buffer);

          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });

          expect(organizationLearners).to.have.lengthOf(0);
          expect(response.statusCode).to.equal(412);
          expect(response.result.errors[0].code).to.equal('INSEE_CODE_INVALID');
          expect(response.result.errors[0].meta.field).to.equal('Code pays naissance*');
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not save any organization learner with wrong birthCityCode', async function () {
          const wrongData = 'A1234';
          // given
          const input = `${organizationLearnerCsvColumns}
           123F;Beatrix;The;Bride;Kiddo;Black Mamba;;01/01/1970;${wrongData};Reims;200;99100;ST;MEF1;Division 1;
           `;
          const buffer = iconv.encode(input, 'UTF-8');

          (options.url = `/api/organizations/${organizationId}/sco-organization-learners/import-siecle?format=csv`),
            (options.payload = buffer);

          // when
          const response = await server.inject(options);

          // then
          const organizationLearners = await knex('organization-learners').where({ organizationId });

          expect(organizationLearners).to.have.lengthOf(0);
          expect(response.statusCode).to.equal(412);
          expect(response.result.errors[0].code).to.equal('INSEE_CODE_INVALID');
          expect(response.result.errors[0].meta.field).to.equal('Code commune naissance**');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context(
        'when an organization learner has the same national student id than an other one in the file',
        function () {
          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            const input = `${organizationLearnerCsvColumns}
          123F;Beatrix;The;Bride;Kiddo;Black Mamba;;01/01/1970;97422;;200;99100;ST;MEF1;Division 1;
          123F;O-Ren;;;Ishii;Cottonmouth;;01/01/1980;;Shangai;99;99132;ST;MEF1;Division 2;
          `;
            const buffer = iconv.encode(input, 'UTF-8');

            (options.url = `/api/organizations/${organizationId}/sco-organization-learners/import-siecle?format=csv`),
              (options.payload = buffer);
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should not import any organizationLearner and return a 412', async function () {
            // when
            const response = await server.inject(options);

            // then
            const organizationLearners = await knex('organization-learners').where({ organizationId });

            expect(organizationLearners).to.have.lengthOf(0);
            expect(response.statusCode).to.equal(412);
            expect(response.result.errors[0].code).to.equal('IDENTIFIER_UNIQUE');
          });
        }
      );
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Resource access management', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const buffer = iconv.encode(
          '<?xml version="1.0" encoding="ISO-8859-15"?>' +
            '<BEE_ELEVES VERSION="2.1">' +
            '<PARAMETRES>' +
            '<UAJ>UAI123ABC</UAJ>' +
            '</PARAMETRES>' +
            '</BEE_ELEVES>',
          'ISO-8859-15'
        );
        options.payload = buffer;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user is not authenticated', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          // given
          options.headers.authorization = 'invalid.access.token';
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 401 - unauthorized access', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(401);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user user does not belong to Organization', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const userId = databaseBuilder.factory.buildUser.withMembership().id;
          await databaseBuilder.commit();

          options.headers.authorization = generateValidRequestAuthorizationHeader(userId);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 403 - Forbidden access', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(403);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when Organization does not manage organizationLearners', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationId = databaseBuilder.factory.buildOrganization({
            type: 'SCO',
            isManagingStudents: false,
          }).id;
          const userId = databaseBuilder.factory.buildUser.withMembership({
            organizationId,
            organizationRole: Membership.roles.ADMIN,
          }).id;
          await databaseBuilder.commit();

          options.headers.authorization = generateValidRequestAuthorizationHeader(userId);
          options.url = `/api/organizations/${organizationId}/sco-organization-learners/import-siecle`;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 403 - Forbidden access', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(403);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when Organization is not a SCO organization', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationId = databaseBuilder.factory.buildOrganization({
            type: 'SUP',
            isManagingStudents: true,
          }).id;
          const userId = databaseBuilder.factory.buildUser.withMembership({
            organizationId,
            organizationRole: Membership.roles.ADMIN,
          }).id;
          await databaseBuilder.commit();

          options.headers.authorization = generateValidRequestAuthorizationHeader(userId);
          options.url = `/api/organizations/${organizationId}/sco-organization-learners/import-siecle`;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 403 - Forbidden access', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(403);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user is not ADMIN', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          // given
          const organizationId = databaseBuilder.factory.buildOrganization({
            type: 'SCO',
            isManagingStudents: true,
          }).id;
          const userId = databaseBuilder.factory.buildUser.withMembership({
            organizationId,
            organizationRole: Membership.roles.MEMBER,
          }).id;
          await databaseBuilder.commit();

          options.headers.authorization = generateValidRequestAuthorizationHeader(userId);
          options.url = `/api/organizations/${organizationId}/sco-organization-learners/import-siecle`;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 403 - Forbidden access', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });
});
