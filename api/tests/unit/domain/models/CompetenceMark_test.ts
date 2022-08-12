// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../../../../lib/domain/models/CompetenceMark');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
const { ObjectValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Competence Mark', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build a Competence Mark from raw JSON', function () {
      // given
      const rawData = {
        level: 2,
        score: 13,
        area_code: '1',
        competence_code: '1.1',
      };

      // when
      const competenceMark = new CompetenceMark(rawData);

      // then
      expect(competenceMark.level).to.equal(2);
      expect(competenceMark.score).to.equal(13);
      expect(competenceMark.area_code).to.equal('1');
      expect(competenceMark.competence_code).to.equal('1.1');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('validate', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a resolved promise when the object is valid', function () {
      // given
      const competenceMark = domainBuilder.buildCompetenceMark();

      // when
      const valid = competenceMark.validate();

      // then
      expect(valid).not.to.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an error if level is > 8', async function () {
      // given
      const competenceMark = domainBuilder.buildCompetenceMark({ level: 10 });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(competenceMark.validate.bind(competenceMark))();
      // then
      expect(error).to.be.instanceOf(ObjectValidationError);
      expect((error as $TSFixMe).message).to.be.equal('ValidationError: "level" must be less than or equal to 8');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an error if level is < -1', async function () {
      // given
      const competenceMark = domainBuilder.buildCompetenceMark({ level: -2 });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(competenceMark.validate.bind(competenceMark))();

      // then
      expect(error).to.be.instanceOf(ObjectValidationError);
      expect((error as $TSFixMe).message).to.be.equal('ValidationError: "level" must be greater than or equal to -1');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an error if score > 64', async function () {
      // when
      const competenceMark = domainBuilder.buildCompetenceMark({ score: 65 });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(competenceMark.validate.bind(competenceMark))();

      // then
      expect(error).to.be.instanceOf(ObjectValidationError);
      expect((error as $TSFixMe).message).to.be.equal('ValidationError: "score" must be less than or equal to 64');
    });
  });
});
