// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, databaseBuilder, expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfT... Remove this comment to see the full error message
const BookshelfTargetProfile = require('../../../../lib/infrastructure/orm-models/TargetProfile');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfTargetProfileShare = require('../../../../lib/infrastructure/orm-models/TargetProfileShare');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('../../../../lib/domain/models/TargetProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileAdapter = require('../../../../lib/infrastructure/adapters/target-profile-adapter');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Adapter | targetProfileAdapter', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should adapt TargetProfile object to domain', function () {
    // given
    const bookshelfTargetProfile = new BookshelfTargetProfile(databaseBuilder.factory.buildTargetProfile());
    const organizationWhichShared = new BookshelfTargetProfileShare(databaseBuilder.factory.buildTargetProfileShare());
    bookshelfTargetProfile.related = sinon.stub().onCall('sharedWithOrganizations').resolves([organizationWhichShared]);
    const skillLearningContentDataObject = domainBuilder.buildSkillLearningContentDataObject();
    const associatedSkillDatasourceObjects = [skillLearningContentDataObject];
    const skill = domainBuilder.buildSkill({
      id: skillLearningContentDataObject.id,
      name: skillLearningContentDataObject.name,
      pixValue: skillLearningContentDataObject.pixValue,
      competenceId: skillLearningContentDataObject.competenceId,
      tutorialIds: ['recCO0X22abcdefgh'],
      tubeId: skillLearningContentDataObject.tubeId,
    });
    const expectedTargetProfile = domainBuilder.buildTargetProfile({
      id: bookshelfTargetProfile.get('id'),
      name: bookshelfTargetProfile.get('name'),
      imageUrl: bookshelfTargetProfile.get('imageUrl'),
      isPublic: Boolean(bookshelfTargetProfile.get('isPublic')),
      isSimplifiedAccess: Boolean(bookshelfTargetProfile.get('isSimplifiedAccess')),
      ownerOrganizationId: bookshelfTargetProfile.get('ownerOrganizationId'),
      skills: [skill],
      sharedWithOrganizationIds: [organizationWhichShared.get('organizationId')],
    });

    // when
    const targetProfile = targetProfileAdapter.fromDatasourceObjects({
      bookshelfTargetProfile,
      associatedSkillDatasourceObjects,
    });

    // then
    expect(targetProfile).to.be.an.instanceOf(TargetProfile);
    expect(targetProfile).to.be.deep.equal(expectedTargetProfile);
  });
});
