// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, catchErr } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'retrieveTa... Remove this comment to see the full error message
const { retrieveTagsByName, addTagsToOrganizations } = require('../../../scripts/add-tags-to-organizations');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | add-tags-to-organizations.js', function () {
  let firstTag: $TSFixMe;
  let secondTag: $TSFixMe;
  let thirdTag: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    firstTag = databaseBuilder.factory.buildTag({ name: 'tag1' });
    secondTag = databaseBuilder.factory.buildTag({ name: 'tag2' });
    thirdTag = databaseBuilder.factory.buildTag({ name: 'tag3' });

    return databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#retrieveTagsByName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve tags by tag name', async function () {
      // given
      const checkedData = [
        { organizationId: 1, tagName: firstTag.name },
        { organizationId: 2, tagName: secondTag.name },
        { organizationId: 3, tagName: firstTag.name },
        { organizationId: 4, tagName: thirdTag.name },
        { organizationId: 5, tagName: secondTag.name },
      ];

      // when
      const tagsByName = await retrieveTagsByName({ checkedData });

      // then
      expect(tagsByName.size).to.equal(3);
      expect(tagsByName.get(firstTag.name)).to.deep.equal(firstTag);
      expect(tagsByName.get(secondTag.name)).to.deep.equal(secondTag);
      expect(tagsByName.get(thirdTag.name)).to.deep.equal(thirdTag);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if tag does not exist', async function () {
      // given
      const tagName = 'unknown_tag_name';
      const checkedData = [{ organizationId: 1, tagName }];

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(retrieveTagsByName)({ checkedData });

      // then
expect((error as $TSFixMe).message).to.equal(`The tag with name ${tagName} does not exist.`);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#addTagsToOrganizations', function () {
    let firstOrganizationId: $TSFixMe;
    let secondOrganizationId: $TSFixMe;
    let thirdOrganizationId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      firstOrganizationId = databaseBuilder.factory.buildOrganization().id;
      secondOrganizationId = databaseBuilder.factory.buildOrganization().id;
      thirdOrganizationId = databaseBuilder.factory.buildOrganization().id;

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('organization-tags').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should add tags to organizations', async function () {
      // given
      const tagsByName = new Map([
        [firstTag.name, firstTag],
        [secondTag.name, secondTag],
        [thirdTag.name, thirdTag],
      ]);

      const checkedData = [
        { organizationId: firstOrganizationId, tagName: firstTag.name },
        { organizationId: secondOrganizationId, tagName: secondTag.name },
        { organizationId: thirdOrganizationId, tagName: thirdTag.name },
      ];

      // when
      await addTagsToOrganizations({ tagsByName, checkedData });

      // then
      const organizationTagsInDB = await knex('organization-tags');
      expect(organizationTagsInDB.length).to.equal(3);
      expect(await knex('organization-tags').where({ organizationId: firstOrganizationId, tagId: firstTag.id })).to
        .exist;
      expect(await knex('organization-tags').where({ organizationId: secondOrganizationId, tagId: secondTag.id })).to
        .exist;
      expect(await knex('organization-tags').where({ organizationId: thirdOrganizationId, tagId: thirdTag.id })).to
        .exist;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When tag already exists for an organization', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildOrganizationTag({ organizationId: firstOrganizationId, tagId: firstTag.id });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not throw an error', async function () {
        // given
        const tagsByName = new Map([[firstTag.name, firstTag]]);

        const checkedData = [{ organizationId: firstOrganizationId, tagName: firstTag.name }];

        // when
        await addTagsToOrganizations({ tagsByName, checkedData });

        // then
        expect(true).to.be.true;
      });
    });
  });
});
