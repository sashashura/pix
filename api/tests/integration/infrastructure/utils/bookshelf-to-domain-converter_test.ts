// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../../../../lib/infrastructure/utils/bookshelf-to-domain-converter');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('../../../../lib/domain/models/TargetProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../../../lib/domain/models/Tag');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfU... Remove this comment to see the full error message
const BookshelfUser = require('../../../../lib/infrastructure/orm-models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfC... Remove this comment to see the full error message
const BookshelfCampaign = require('../../../../lib/infrastructure/orm-models/Campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfC... Remove this comment to see the full error message
const BookshelfCampaignParticipation = require('../../../../lib/infrastructure/orm-models/CampaignParticipation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfO... Remove this comment to see the full error message
const BookshelfOrganization = require('../../../../lib/infrastructure/orm-models/Organization');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Utils | Bookshelf to domain converter', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('buildDomainObject', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Bookshelf object into a domain object', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
      const bookshelfObject = await BookshelfUser.where({ id: userId }).fetch();

      // when
      const domainObject = bookshelfToDomainConverter.buildDomainObject(BookshelfUser, bookshelfObject);

      // then
      expect(domainObject).to.be.an.instanceOf(User);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should populate the domain object with the matching Bookshelf properties', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
      const bookshelfObject = await BookshelfUser.where({ id: userId }).fetch();

      // when
      const domainObject = bookshelfToDomainConverter.buildDomainObject(BookshelfUser, bookshelfObject);

      // then
      for (const property of ['firstName', 'lastName', 'email']) {
        expect(domainObject[property]).to.exist;
      }
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should honor the domain object constructor', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
      const bookshelfObject = await BookshelfUser.where({ id: userId }).fetch();

      // when
      const domainObject = bookshelfToDomainConverter.buildDomainObject(BookshelfUser, bookshelfObject);

      // then
      expect(domainObject.scorecards).to.deep.equal([]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should support has-one relationships', async function () {
      // TODO : Il n'y a pas d'exemple d'objet du Domain qui récupère un autre objet du Domain via hasOne.
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should support has-many relationships', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildMembership({ userId });
      databaseBuilder.factory.buildMembership({ userId });
      await databaseBuilder.commit();
      const bookshelfObject = await BookshelfUser.where({ id: userId }).fetch({
        withRelated: ['memberships'],
      });

      // when
      const domainObject = bookshelfToDomainConverter.buildDomainObject(BookshelfUser, bookshelfObject);

      // then
      expect(domainObject.memberships).to.be.instanceOf(Array);
      expect(domainObject.memberships[0]).to.be.instanceOf(Membership);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should support belongs-to relationships', async function () {
      //given
      const campaignId = databaseBuilder.factory.buildCampaign().id;
      await databaseBuilder.commit();
      const bookshelfObject = await BookshelfCampaign.where({ id: campaignId }).fetch({
        withRelated: ['targetProfile'],
      });

      // when
      const domainObject = bookshelfToDomainConverter.buildDomainObject(BookshelfCampaign, bookshelfObject);

      // then
      expect(domainObject.targetProfile).to.be.instanceOf(TargetProfile);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should support belongs-to-many relationships', async function () {
      //given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const tagId1 = databaseBuilder.factory.buildTag({ name: 'Banane' }).id;
      const tagId2 = databaseBuilder.factory.buildTag({ name: 'Dinde' }).id;
      databaseBuilder.factory.buildOrganizationTag({ organizationId, tagId: tagId1 });
      databaseBuilder.factory.buildOrganizationTag({ organizationId, tagId: tagId2 });
      await databaseBuilder.commit();
      const bookshelfObject = await BookshelfOrganization.where({ id: organizationId }).fetch({
        withRelated: ['tags'],
      });

      // when
      const domainObject = bookshelfToDomainConverter.buildDomainObject(BookshelfOrganization, bookshelfObject);

      // then
      expect(domainObject.tags).to.be.instanceOf(Array);
      expect(domainObject.tags[0]).to.be.instanceOf(Tag);
      expect(domainObject.tags.length).to.equal(2);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should support domain object relationship’s name not matching the corresponding Bookshelf class name', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildKnowledgeElement({ userId });
      databaseBuilder.factory.buildKnowledgeElement({ userId });
      await databaseBuilder.commit();
      const bookshelfObject = await BookshelfUser.where({ id: userId }).fetch({
        withRelated: 'knowledgeElements',
      });

      // when
      const domainObject = bookshelfToDomainConverter.buildDomainObject(BookshelfUser, bookshelfObject);

      // then
      expect(domainObject.knowledgeElements).to.be.instanceOf(Array);
      expect(domainObject.knowledgeElements[0]).to.be.instanceOf(KnowledgeElement);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should support nested relationships', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId }).id;
      await databaseBuilder.commit();
      const bookshelfObject = await BookshelfCampaignParticipation.where({ id: campaignParticipationId }).fetch({
        withRelated: ['campaign.organization'],
      });

      // when
      const domainObject = bookshelfToDomainConverter.buildDomainObject(
        BookshelfCampaignParticipation,
        bookshelfObject
      );

      // then
      expect(domainObject.campaign.organization).to.be.instanceOf(Organization);
    });
  });
});
