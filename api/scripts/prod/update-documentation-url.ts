// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateDocu... Remove this comment to see the full error message
async function updateDocumentationUrl() {
  await _updateProOrganizations();

  await _updateMedNumOrganizations();

  await _updateSUPOrganizations();

  await _updateSCOOrganizations();

  await _updateAEFEOrganizations();

  await _updateMLFOrganizations();

  await _updateAGRIOrganizations();
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'URL'.
const URL = {
  PRO: 'https://cloud.pix.fr/s/cwZN2GAbqSPGnw4',
  SUP: 'https://cloud.pix.fr/s/DTTo7Lp7p6Ktceo',
  AEFE: 'https://view.genial.ly/5ffb6eed1ac90d0d0daf65d8',
  MLF: 'https://view.genial.ly/5ffb6eed1ac90d0d0daf65d8',
  MEDNUM: 'https://view.genial.ly/6048a0d3757f980dc010d6d4',
  SCO: 'https://view.genial.ly/5f3e7a5ba8ffb90d11ac034f',
  AGRI: 'https://view.genial.ly/5f85a0b87812e90d12b7b593',
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  updateDocumentationUrl,
  URL,
};

async function _updateProOrganizations() {
  await knex('organizations').where('type', 'PRO').update({ documentationUrl: URL.PRO });
}

async function _updateMedNumOrganizations() {
  const ids = await knex
    .select('organizations.id')
    .from('organizations')
    .leftJoin('organization-tags', 'organizationId', 'organizations.id')
    .leftJoin('tags', 'tagId', 'tags.id')
    .where({ type: 'PRO', 'tags.name': 'MEDNUM' })
    .pluck('organizations.id');

  await knex('organizations').whereIn('id', ids).update({ documentationUrl: URL.MEDNUM });
}

async function _updateSUPOrganizations() {
  await knex('organizations').where('type', 'SUP').update({ documentationUrl: URL.SUP });
}

async function _updateSCOOrganizations() {
  const ids = await knex
    .from('organizations')
    .where({ type: 'SCO', isManagingStudents: true })
    .pluck('organizations.id');

  await knex('organizations').whereIn('id', ids).update({ documentationUrl: URL.SCO });
}

async function _updateAEFEOrganizations() {
  const ids = await knex
    .from('organizations')
    .where({ type: 'SCO' })
    .leftJoin('organization-tags', 'organizationId', 'organizations.id')
    .leftJoin('tags', 'tagId', 'tags.id')
    .where({ 'tags.name': 'AEFE' })
    .pluck('organizations.id');

  await knex('organizations').whereIn('id', ids).update({ documentationUrl: URL.AEFE });
}

async function _updateMLFOrganizations() {
  const ids = await knex
    .from('organizations')
    .where({ type: 'SCO' })
    .leftJoin('organization-tags', 'organizationId', 'organizations.id')
    .leftJoin('tags', 'tagId', 'tags.id')
    .where({ 'tags.name': 'MLF' })
    .pluck('organizations.id');

  await knex('organizations').whereIn('id', ids).update({ documentationUrl: URL.MLF });
}

async function _updateAGRIOrganizations() {
  const ids = await knex
    .from('organizations')
    .where({ type: 'SCO', isManagingStudents: true })
    .leftJoin('organization-tags', 'organizationId', 'organizations.id')
    .leftJoin('tags', 'tagId', 'tags.id')
    .where({ 'tags.name': 'AGRICULTURE' })
    .pluck('organizations.id');

  await knex('organizations').whereIn('id', ids).update({ documentationUrl: URL.AGRI });
}

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  updateDocumentationUrl()
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    .then(() => process.exit(0))
    .catch((err) => {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error(err);
      // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
      process.exit(1);
    });
}
