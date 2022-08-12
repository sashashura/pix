// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../../../lib/domain/models/Tag');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Organization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build an Organization from raw JSON', function () {
      // given
      const rawData = {
        id: 1,
        name: 'Lycée Jean Rostand',
        type: 'SCO',
        email: 'jr@lycee.fr',
        showSkills: false,
      };

      // when
      const organization = new Organization(rawData);

      // then
      expect(organization.id).to.equal(1);
      expect(organization.type).to.equal('SCO');
      expect(organization.name).to.equal('Lycée Jean Rostand');
      expect(organization.showSkills).to.equal(false);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build an Organization with targetProfile related', function () {
      // given
      const rawData = {
        id: 1,
        name: 'Lycée Jean Rostand',
        type: 'SCO',
        email: 'jr@lycee.fr',
        targetProfileShares: [
          {
            targetProfile: [],
          },
        ],
      };
      // when
      const organization = new Organization(rawData);

      // then
      expect(organization.id).to.equal(1);
      expect(organization.targetProfileShares.length).to.equal(1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build an Organization with default values for credit when not specified', function () {
      // given
      const rawData = {
        id: 1,
        name: 'Lycée Jean Rostand',
        type: 'SCO',
      };
      // when
      const organization = new Organization(rawData);
      // then
      expect(organization.credit).to.equal(0);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('get#isSco', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when organization is of type SCO', function () {
      // given
      const organization = domainBuilder.buildOrganization({ type: 'SCO' });

      // when / then
      expect(organization.isSco).is.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when organization is not of type SCO', function () {
      // given
      const organization = domainBuilder.buildOrganization({ type: 'SUP' });

      // when / then
      expect(organization.isSco).is.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('get#isSup', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when organization is of type SUP', function () {
      // given
      const organization = domainBuilder.buildOrganization({ type: 'SUP' });

      // when / then
      expect(organization.isSup).is.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when organization is not of type SUP', function () {
      // given
      const organization = domainBuilder.buildOrganization({ type: 'PRO' });

      // when / then
      expect(organization.isSup).is.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('get#isPro', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when organization is of type PRO', function () {
      // given
      const organization = domainBuilder.buildOrganization({ type: 'PRO' });

      // when / then
      expect(organization.isPro).is.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when organization is not of type PRO', function () {
      // given
      const organization = domainBuilder.buildOrganization({ type: 'SCO' });

      // when / then
      expect(organization.isPro).is.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('get#isAgriculture', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when organization is not SCO', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return false when the organization has the "AGRICULTURE" tag', function () {
        // given
        const tag = domainBuilder.buildTag({ name: Tag.AGRICULTURE });
        const organization = domainBuilder.buildOrganization({ type: 'SUP', tags: [tag] });

        // when / then
        expect(organization.isAgriculture).is.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when organization is SCO', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true when organization is of type SCO and has the "AGRICULTURE" tag', function () {
        // given
        const tag1 = domainBuilder.buildTag({ name: Tag.AGRICULTURE });
        const tag2 = domainBuilder.buildTag({ name: 'OTHER' });
        const organization = domainBuilder.buildOrganization({ type: 'SCO', tags: [tag1, tag2] });

        // when / then
        expect(organization.isAgriculture).is.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return false when when organization is of type SCO and has not the "AGRICULTURE" tag', function () {
        // given
        const tag1 = domainBuilder.buildTag({ name: 'To infinity…and beyond!' });
        const tag2 = domainBuilder.buildTag({ name: 'OTHER' });
        const organization = domainBuilder.buildOrganization({ type: 'SCO', tags: [tag1, tag2] });

        // when / then
        expect(organization.isAgriculture).is.false;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('get#isPoleEmploi', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when the organization has not the "POLE_EMPLOI" tag', function () {
      // given
      const tag = domainBuilder.buildTag({ name: Tag.AGRICULTURE });
      const organization = domainBuilder.buildOrganization({ tags: [tag] });

      // when / then
      expect(organization.isPoleEmploi).is.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when organization has the "POLE_EMPLOI" tag', function () {
      // given
      const tag1 = domainBuilder.buildTag({ name: Tag.POLE_EMPLOI });
      const tag2 = domainBuilder.buildTag({ name: 'OTHER' });
      const organization = domainBuilder.buildOrganization({ tags: [tag1, tag2] });

      // when / then
      expect(organization.isPoleEmploi).is.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('get#isScoAngManagingStudents', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when organization is of type SCO and is managing student', function () {
      // given
      const organization = domainBuilder.buildOrganization({ type: 'SCO', isManagingStudents: true });

      // when / then
      expect(organization.isScoAndManagingStudents).is.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when organization is not of type SCO', function () {
      // given
      const organization = domainBuilder.buildOrganization({ type: 'SUP' });

      // when / then
      expect(organization.isScoAndManagingStudents).is.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when organization is not managingStudent', function () {
      // given
      const organization = domainBuilder.buildOrganization({ type: 'SCO', isManagingStudents: false });

      // when / then
      expect(organization.isScoAndManagingStudents).is.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('get#isScoAndHasExternalId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when organization is of type SCO and has an externalId', function () {
      // given
      const organization = domainBuilder.buildOrganization({ type: 'SCO', externalId: '1237457A' });

      // when / then
      expect(organization.isScoAndHasExternalId).is.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when organization is not of type SCO', function () {
      // given
      const organization = domainBuilder.buildOrganization({ type: 'SUP', externalId: '1237457A' });

      // when / then
      expect(organization.isScoAndHasExternalId).is.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when organization has no external id', function () {
      // given
      const organization = domainBuilder.buildOrganization({ type: 'SCO', externalId: null });

      // when / then
      expect(organization.isScoAndHasExternalId).is.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('get#isArchived', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when organization has an archive date', function () {
      // given
      const organization = domainBuilder.buildOrganization({ archivedAt: new Date('2013-05-22T23:42:00Z') });

      // when / then
      expect(organization.isArchived).is.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when organization does not have an archive date', function () {
      // given
      const organization = domainBuilder.buildOrganization({ archivedAt: null });

      // when / then
      expect(organization.isArchived).is.false;
    });
  });
});
