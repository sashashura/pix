const COMPLEMENTARY_CERTIFICATIONS_TABLE = 'complementary-certifications';
const COMPLEMENTARY_CERTIFICATION_COURSES_TABLE = 'complementary-certification-courses';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COMPLEMENT... Remove this comment to see the full error message
const COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE = 'complementary-certification-course-results';
const COMPLEMENTARY_CERTIFICATION_COURSE_ID_COLUMN = 'complementaryCertificationCourseId';
const CERTIFICATION_COURSE_ID = 'certificationCourseId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uniqBy'.
const uniqBy = require('lodash/uniqBy');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V2,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../lib/domain/models/Badge').keys;

const PIX_PLUS_EDU = 'Pix+ Édu';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
const PIX_PLUS_DROIT = 'Pix+ Droit';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA'.
const CLEA = 'CléA Numérique';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  const complementaryCertifications = await knex(COMPLEMENTARY_CERTIFICATIONS_TABLE).select('*');
  await _alterComplementaryCertificationCourseResultsForeignKey();
  await _addMissingComplementaryCertificationCourses();
  await _updateComplementaryCertificationCourseResultsForeignKeys();
  await _dropColumnCertificationCourse();
  await _setForeignKeyNotNullable();

  async function _setForeignKeyNotNullable() {
    await knex.schema.alterTable(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE, (table: $TSFixMe) => {
      table.bigInteger(COMPLEMENTARY_CERTIFICATION_COURSE_ID_COLUMN).notNullable().alter();
    });
  }

  async function _alterComplementaryCertificationCourseResultsForeignKey() {
    await knex.schema.table(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE, async (table: $TSFixMe) => {
      table.increments('id').primary();
      table
        .bigInteger(COMPLEMENTARY_CERTIFICATION_COURSE_ID_COLUMN)
        .nullable()
        .references('complementary-certification-courses.id');
    });
  }

  async function _updateComplementaryCertificationCourseResultsForeignKeys() {
    const complementaryCertifCourseIdForComplementaryCertifCourseResultIds =
      await _getComplementaryCertifCourseIdForComplementaryCertifCourseResultId();

    return bluebird.mapSeries(
      complementaryCertifCourseIdForComplementaryCertifCourseResultIds,
      async ({
        complementaryCertificationCourseResultId,
        complementaryCertificationCourseId
      }: $TSFixMe) => {
        await knex(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE)
          .update(COMPLEMENTARY_CERTIFICATION_COURSE_ID_COLUMN, complementaryCertificationCourseId)
          .where({ id: complementaryCertificationCourseResultId });
      }
    );
  }

  async function _addMissingComplementaryCertificationCourses() {
    const missingComplementaryCertifCourses = await _buildMissingComplementaryCertificationCourses();

    return knex
      .batchInsert(COMPLEMENTARY_CERTIFICATION_COURSES_TABLE, missingComplementaryCertifCourses)
      .returning(['id', CERTIFICATION_COURSE_ID]);
  }

  async function _getComplementaryCertifCourseIdForComplementaryCertifCourseResultId() {
    const complementaryCertificationCourses = await knex(COMPLEMENTARY_CERTIFICATION_COURSES_TABLE).select('*');
    const complementaryCertificationCourseResults = await knex(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE).select(
      '*'
    );

    return complementaryCertificationCourseResults.map((cccr: $TSFixMe) => {
      const complementaryCertificationCourseResultId = cccr.id;
      const certificationCourseId = cccr.certificationCourseId;
      const complementaryCertificationId = _getComplementaryCertificationId({
        partnerKey: cccr.partnerKey || cccr.temporaryPartnerKey,
      });

      const complementaryCertificationCourseId = complementaryCertificationCourses.find(
        (ccc: $TSFixMe) => ccc.complementaryCertificationId === complementaryCertificationId &&
        ccc.certificationCourseId === certificationCourseId
      ).id;

      return { complementaryCertificationCourseResultId, complementaryCertificationCourseId };
    });
  }

  async function _buildMissingComplementaryCertificationCourses() {
    const complementaryCertifCourseResults =
      await _getComplementaryCertifCourseResultsWithoutComplementaryCertifCourse();

    const missingComplementaryCertificationCourses = complementaryCertifCourseResults
      .map(({
      certificationCourseId,
      partnerKey,
      temporaryPartnerKey
    }: $TSFixMe) => {
        return {
          certificationCourseId,
          complementaryCertificationId: _getComplementaryCertificationId({
            partnerKey: partnerKey || temporaryPartnerKey,
          }),
        };
      })
      .filter(({
      complementaryCertificationId
    }: $TSFixMe) => Boolean(complementaryCertificationId));

    return uniqBy(missingComplementaryCertificationCourses, ({
      certificationCourseId
    }: $TSFixMe) => certificationCourseId);
  }

  function _getComplementaryCertifCourseResultsWithoutComplementaryCertifCourse() {
    return (
      knex
        .select('*')
        .from(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE)
        // eslint-disable-next-line knex/avoid-injections
        .whereRaw(
          `"${CERTIFICATION_COURSE_ID}" not in (select "${CERTIFICATION_COURSE_ID}" from "complementary-certification-courses")`
        )
    );
  }

  function _getComplementaryCertificationId({
    partnerKey
  }: $TSFixMe) {
    const getIdFromName = (searchName: $TSFixMe) => complementaryCertifications.find(({
      name
    }: $TSFixMe) => name === searchName).id;
    switch (partnerKey) {
      case PIX_EMPLOI_CLEA:
        return getIdFromName(CLEA);
      case PIX_EMPLOI_CLEA_V2:
        return getIdFromName(CLEA);
      case PIX_DROIT_EXPERT_CERTIF:
        return getIdFromName(PIX_PLUS_DROIT);
      case PIX_DROIT_MAITRE_CERTIF:
        return getIdFromName(PIX_PLUS_DROIT);
      case PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE:
        return getIdFromName(PIX_PLUS_EDU);
      case PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME:
        return getIdFromName(PIX_PLUS_EDU);
      case PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT:
        return getIdFromName(PIX_PLUS_EDU);
      case PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME:
        return getIdFromName(PIX_PLUS_EDU);
      case PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE:
        return getIdFromName(PIX_PLUS_EDU);
    }
  }

  async function _dropColumnCertificationCourse() {
    await knex.schema.table(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE, async (table: $TSFixMe) => {
      table.dropColumn(CERTIFICATION_COURSE_ID);
    });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex.schema.table(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE, async (table: $TSFixMe) => {
    table
      .dropColumn(COMPLEMENTARY_CERTIFICATION_COURSE_ID_COLUMN)
      .nullable()
      .references('complementary-certification-courses.id');
  });
};
