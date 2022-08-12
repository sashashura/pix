// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, catchErr } = require('../../../test-helper');

const id = 1;
// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | OrganizationsToAttachToTargetProfile', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should store target profile id', function () {
    const targetProfileOrganizations = domainBuilder.buildOrganizationsToAttachToTargetProfile({ id });

    expect(targetProfileOrganizations.id).equal(id);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#attach', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should attach organizations', function () {
      const targetProfileOrganizations = domainBuilder.buildOrganizationsToAttachToTargetProfile({ id });

      targetProfileOrganizations.attach([1, 2]);

      expect(targetProfileOrganizations.organizations).deep.equal([1, 2]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not attach an organization twice', function () {
      const targetProfileOrganizations = domainBuilder.buildOrganizationsToAttachToTargetProfile({ id });

      targetProfileOrganizations.attach([1, 1]);

      expect(targetProfileOrganizations.organizations).deep.equal([1]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if there is no organization to attach', async function () {
      const targetProfileOrganizations = domainBuilder.buildOrganizationsToAttachToTargetProfile({ id });

      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(targetProfileOrganizations.attach)([]);

      expect((error as $TSFixMe).message).equal(`Il n'y a aucune organisation à rattacher.`);
    });
  });
});
