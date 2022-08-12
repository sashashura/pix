// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserCompet... Remove this comment to see the full error message
const UserCompetence = require('../../../../lib/domain/models/UserCompetence');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | UserCompetence', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should construct a model UserCompetence from attributes', function () {
      // given
      const userCompetenceRawData = {
        id: 1,
        index: '1',
        name: 'UCName',
        area: 'area',
        pixScore: 10,
        estimatedLevel: 5,
        skills: ['some skills'],
      };

      // when
      const actualUserCompetence = new UserCompetence(userCompetenceRawData);

      // then
      expect(actualUserCompetence).to.be.an.instanceof(UserCompetence);
      expect(actualUserCompetence).to.deep.equal(userCompetenceRawData);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isCertifiable', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when the user competence is not certifiable', function () {
      // given
      const userCompetence = new UserCompetence({ estimatedLevel: 0 });

      // when
      const result = userCompetence.isCertifiable();

      // then
      expect(result).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when the user competence is certifiable', function () {
      // given
      const userCompetence = new UserCompetence({ estimatedLevel: 1 });

      // when
      const result = userCompetence.isCertifiable();

      // then
      expect(result).to.be.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getSkillsAtLatestVersion', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return only the latest versions', function () {
      // given
      const skill1 = domainBuilder.buildSkill({ name: '@url4', version: 1 });
      const skill2 = domainBuilder.buildSkill({ name: '@web2', version: 1 });
      const skill3 = domainBuilder.buildSkill({ name: '@url4', version: 2 });
      const userCompetence = domainBuilder.buildUserCompetence({ skills: [skill1, skill2, skill3] });

      // when
      const result = userCompetence.getSkillsAtLatestVersion();
      // then
      expect(result).to.deepEqualArray([skill3, skill2]);
    });
  });
});
