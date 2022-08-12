// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForCreation = require('../../../../lib/domain/models/TargetProfileForCreation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('../../../../lib/domain/models/TargetProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | TargetProfileForCreation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#new', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('creates a target profile', function () {
      const targetProfile = new TargetProfileForCreation({
        name: 'name',
        category: TargetProfile.categories.OTHER,
        skillIds: [1],
        description: 'description',
        comment: 'comment',
        isPublic: true,
        imageUrl: 'url',
        ownerOrganizationId: 1,
        tubes: [{ id: 'tubeId1', level: 6 }],
      });

      expect(targetProfile).to.deep.eq({
        name: 'name',
        category: TargetProfile.categories.OTHER,
        skillIds: [1],
        description: 'description',
        comment: 'comment',
        isPublic: true,
        imageUrl: 'url',
        ownerOrganizationId: 1,
        tubes: [{ id: 'tubeId1', level: 6 }],
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the image url is not given', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('set a value by default', function () {
        const targetProfile = new TargetProfileForCreation({
          name: 'name',
          category: TargetProfile.categories.OTHER,
          skillIds: [1],
          description: 'description',
          comment: 'comment',
          isPublic: true,
          ownerOrganizationId: 1,
        });

        expect(targetProfile.imageUrl).to.eq('https://images.pix.fr/profil-cible/Illu_GEN.svg');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the image url is null', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('set a value by default', function () {
        const targetProfile = new TargetProfileForCreation({
          name: 'name',
          category: TargetProfile.categories.OTHER,
          skillIds: [1],
          description: 'description',
          comment: 'comment',
          isPublic: true,
          imageUrl: null,
          ownerOrganizationId: 1,
        });

        expect(targetProfile.imageUrl).to.eq('https://images.pix.fr/profil-cible/Illu_GEN.svg');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the category is not given', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('set a value by default', function () {
        const targetProfile = new TargetProfileForCreation({
          name: 'name',
          skillIds: [1],
          description: 'description',
          comment: 'comment',
          isPublic: true,
          ownerOrganizationId: 1,
        });

        expect(targetProfile.category).to.eq(TargetProfile.categories.OTHER);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('name validations', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is no name given', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('does not create a target profile', async function () {
          const attributes = {
            name: undefined,
            category: TargetProfile.categories.OTHER,
            ownerOrganizationId: 1,
            skillIds: [1],
          };

          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(() => new TargetProfileForCreation(attributes))();

          expect(error).to.be.an.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes[0].attribute).to.eq('name');
          expect((error as $TSFixMe).invalidAttributes[0].message).to.eq('NAME_IS_REQUIRED');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when name is null', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('does not create a target profile', async function () {
          const attributes = {
            name: null,
            category: TargetProfile.categories.OTHER,
            ownerOrganizationId: 1,
            skillIds: [1],
          };

          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(() => new TargetProfileForCreation(attributes))();

          expect(error).to.be.an.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes[0].attribute).to.eq('name');
          expect((error as $TSFixMe).invalidAttributes[0].message).to.eq('NAME_IS_REQUIRED');
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('category validations', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when category is null', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('does not create the target profile', async function () {
          const attributes = {
            name: 'name',
            category: null,
            ownerOrganizationId: 1,
            skillIds: [1],
          };

          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(() => new TargetProfileForCreation(attributes))();

          expect(error).to.be.an.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes[0].attribute).to.eq('category');
          expect((error as $TSFixMe).invalidAttributes[0].message).to.eq('CATEGORY_IS_REQUIRED');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when category is not an existing category', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('does not create the target profile', async function () {
          const attributes = {
            name: 'name',
            category: 'BadNews',
            ownerOrganizationId: 1,
            skillIds: [1],
          };

          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(() => new TargetProfileForCreation(attributes))();

          expect(error).to.be.an.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes[0].attribute).to.eq('category');
          expect((error as $TSFixMe).invalidAttributes[0].message).to.eq('CATEGORY_IS_REQUIRED');
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('skillIds validations', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is no skill id given', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('does not create a target profile', async function () {
          const attributes = {
            name: 'name',
            category: TargetProfile.categories.OTHER,
            ownerOrganizationId: 1,
            skillIds: undefined,
          };

          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(() => new TargetProfileForCreation(attributes))();

          expect(error).to.be.an.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes[0].attribute).to.eq('skillIds');
          expect((error as $TSFixMe).invalidAttributes[0].message).to.eq('SKILLS_REQUIRED');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is an empty list of skill id', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('does not create a target profile', async function () {
          const attributes = {
            name: 'name',
            category: TargetProfile.categories.OTHER,
            ownerOrganizationId: 1,
            skillIds: [],
          };

          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(() => new TargetProfileForCreation(attributes))();

          expect(error).to.be.an.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes[0].attribute).to.eq('skillIds');
          expect((error as $TSFixMe).invalidAttributes[0].message).to.eq('SKILLS_REQUIRED');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is null as list of skill id', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('does not create a target profile', async function () {
          const attributes = {
            name: 'name',
            category: TargetProfile.categories.OTHER,
            ownerOrganizationId: 1,
            skillIds: null,
          };

          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(() => new TargetProfileForCreation(attributes))();

          expect(error).to.be.an.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes[0].attribute).to.eq('skillIds');
          expect((error as $TSFixMe).invalidAttributes[0].message).to.eq('SKILLS_REQUIRED');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is null in the list of skill ids', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('does not create a target profile', async function () {
          const attributes = {
            name: 'name',
            category: TargetProfile.categories.OTHER,
            ownerOrganizationId: 1,
            skillIds: [null],
          };

          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(() => new TargetProfileForCreation(attributes))();
          expect(error).to.be.an.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes[0].attribute).to.eq(0);
          expect((error as $TSFixMe).invalidAttributes[0].message).to.eq('SKILLS_REQUIRED');
        });
      });
    });
  });
});
