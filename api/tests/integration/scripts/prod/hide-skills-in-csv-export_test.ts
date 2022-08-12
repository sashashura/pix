// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'hideSkills... Remove this comment to see the full error message
const { hideSkills } = require('../../../../scripts/prod/hide-skills-in-csv-export');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('hideSkills', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update showSkills to false', async function () {
    databaseBuilder.factory.buildOrganization({ showSkills: true });
    await databaseBuilder.commit();

    await hideSkills();

    const { showSkills } = await knex('organizations').first();

    expect(showSkills).to.be.false;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should not update showSkills', async function () {
    databaseBuilder.factory.buildOrganization({ showSkills: false });
    await databaseBuilder.commit();

    await hideSkills();

    const { showSkills } = await knex('organizations').first();

    expect(showSkills).to.be.false;
  });
});
