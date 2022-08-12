const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex('complementary-certifications').update({ name: 'Pix+ Édu 2nd degré' }).where({ name: 'Pix+ Édu' });

  const [{ id: pixEdu1erDegreComplementaryCertificationId }] = await knex('complementary-certifications')
    .insert({ name: 'Pix+ Édu 1er degré' })
    .returning('id');

  const pixEdu1erDegreComplementaryCertificationCourseIds = await knex('complementary-certification-course-results')
    .select('complementaryCertificationCourseId')
    .distinct()
    .whereIn('partnerKey', [
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
    ]);

  await knex('complementary-certification-courses')
    .update({
      complementaryCertificationId: pixEdu1erDegreComplementaryCertificationId,
    })
    .whereIn(
      'id',
      pixEdu1erDegreComplementaryCertificationCourseIds.map(
        ({
          complementaryCertificationCourseId
        }: $TSFixMe) => complementaryCertificationCourseId
      )
    );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  const pixEdu1erDegreComplementaryCertificationCourseIds = await knex('complementary-certification-course-results')
    .select('complementaryCertificationCourseId')
    .distinct()
    .whereIn('partnerKey', [
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
    ]);

  const { id: pixEdu2ndDegreComplementaryCertificationId } = await knex('complementary-certifications')
    .select('id')
    .where({
      name: 'Pix+ Édu 2nd degré',
    })
    .first();

  await knex('complementary-certification-courses')
    .update({
      complementaryCertificationId: pixEdu2ndDegreComplementaryCertificationId,
    })
    .whereIn(
      'id',
      pixEdu1erDegreComplementaryCertificationCourseIds.map(
        ({
          complementaryCertificationCourseId
        }: $TSFixMe) => complementaryCertificationCourseId
      )
    );

  await knex('complementary-certifications').where({ name: 'Pix+ Édu 1er degré' }).delete();

  await knex('complementary-certifications').update({ name: 'Pix+ Édu' }).where({ name: 'Pix+ Édu 2nd degré' });
};
