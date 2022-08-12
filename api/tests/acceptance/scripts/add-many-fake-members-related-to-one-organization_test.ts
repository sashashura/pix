// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, knex, databaseBuilder, catchErr } = require('../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addManyMem... Remove this comment to see the full error message
  addManyMembersToExistingOrganization,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/data-generation/add-many-fake-members-related-to-one-organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Scripts | add-many-divisions-and-students-to-sco-organization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an error when env is production', async function () {
    // given
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    const stub = sinon.stub(process.env, 'NODE_ENV').value('production');

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(addManyMembersToExistingOrganization)({ numberOfUsers: 1 });

    // then
    expect(error).to.be.an.instanceOf(ForbiddenAccess);
    stub.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create an user and the membership related to the organization', async function () {
    // given
    const numberOfUsers = 2;
    const organizationRole = 'MEMBER';
    const userId = 45678902;
    const userId2 = 45678903;
    const organizationId = 234567890;

    databaseBuilder.factory.buildOrganization({ id: organizationId });
    await databaseBuilder.commit();

    const stub = sinon
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      .stub(process, 'argv')
      .value(['One argument', 'Another argument', numberOfUsers, organizationId, organizationRole, userId]);

    // when
    await addManyMembersToExistingOrganization({ numberOfUsers });

    // then
    const user = await knex('users').where('id', userId).first();
    expect(user.firstName).to.equal('firstName45678902');
    expect(user.lastName).to.equal('lastName45678902');
    expect(user.email).to.equal('firstname.lastname-45678902@example.net');

    const memberShip = await knex('memberships').where('userId', userId).first();
    expect(memberShip.organizationRole).to.equal(organizationRole);
    expect(memberShip.organizationId).to.equal(organizationId);

    await knex('memberships').whereIn('userId', [userId, userId2]).delete();
    await knex('users').whereIn('id', [userId, userId2]).delete();
    stub.restore();
  });
});
