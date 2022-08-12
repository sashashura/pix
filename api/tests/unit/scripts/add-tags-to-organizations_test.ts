// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addTagsToO... Remove this comment to see the full error message
const { addTagsToOrganizations } = require('../../../scripts/add-tags-to-organizations');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationTagRepository = require('../../../lib/infrastructure/repositories/organization-tag-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../../lib/domain/models/Tag');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Scripts | add-tags-to-organizations.js', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When tag already exists for an organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not throw an error', async function () {
      // given
      const tagsByName = new Map([['tagName', new Tag({ name: 'tagName' })]]);
      const checkedData = [{ organizationId: 1, tagName: 'tagName' }];

      organizationTagRepository.create = sinon.stub();
      organizationTagRepository.isExistingByOrganizationIdAndTagId = sinon.stub().resolves(true);

      // when
      await addTagsToOrganizations({ tagsByName, checkedData });

      // then
      expect(organizationTagRepository.create).to.not.have.been.called;
    });
  });
});
