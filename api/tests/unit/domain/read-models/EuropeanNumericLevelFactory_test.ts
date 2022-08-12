// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EuropeanNu... Remove this comment to see the full error message
const EuropeanNumericLevelFactory = require('../../../../lib/domain/read-models/EuropeanNumericLevelFactory');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EuropeanNu... Remove this comment to see the full error message
const EuropeanNumericLevel = require('../../../../lib/domain/read-models/EuropeanNumericLevel');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Read-models | EuropeanNumericLevelFactory', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('static #buildFromCompetenceMarks', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    ['3.4', '4.1', '4.2', '5.1', '5.2'].forEach((competenceCode) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should build an EuropeanNumericLevel with for competence '${competenceCode}'`, function () {
        // given
        const competenceMark = { competenceCode, level: 4 };

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks([competenceMark]);

        // then
        const [domainCompetenceId, competenceId] = competenceCode.split('.');
        expect(europeanNumericLevels).to.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId,
            competenceId,
            level: 4,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when competence code is '1.1'`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return two EuropeanNumericLevel for competence '1.1' and '1.2'`, function () {
        // given
        const competenceMark = { competenceCode: '1.1', level: 4 };

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks([competenceMark]);

        // then
        expect(europeanNumericLevels).to.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId: '1',
            competenceId: '1',
            level: 4,
          }),
          new EuropeanNumericLevel({
            domainCompetenceId: '1',
            competenceId: '2',
            level: 4,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when competence code is '2.1'`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return two EuropeanNumericLevel for competence '2.1' and '2.5'`, function () {
        // given
        const competenceMark = { competenceCode: '2.1', level: 4 };

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks([competenceMark]);

        // then
        expect(europeanNumericLevels).to.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId: '2',
            competenceId: '1',
            level: 4,
          }),
          new EuropeanNumericLevel({
            domainCompetenceId: '2',
            competenceId: '5',
            level: 4,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when competence code is '2.3'`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return an EuropeanNumericLevel for competence '2.4'`, function () {
        // given
        const competenceMark = { competenceCode: '2.3', level: 4 };

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks([competenceMark]);

        // then
        expect(europeanNumericLevels).to.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId: '2',
            competenceId: '4',
            level: 4,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when competence code is '2.4'`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return two EuropeanNumericLevel for competences '2.3', '2.6' and '5.4'`, function () {
        // given
        const competenceMark = { competenceCode: '2.4', level: 4 };

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks([competenceMark]);

        // then
        expect(europeanNumericLevels).to.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId: '2',
            competenceId: '3',
            level: 4,
          }),
          new EuropeanNumericLevel({
            domainCompetenceId: '2',
            competenceId: '6',
            level: 4,
          }),
          new EuropeanNumericLevel({
            domainCompetenceId: '5',
            competenceId: '4',
            level: 4,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when competence code is '3.3'`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return two EuropeanNumericLevel for competences '3.2' and '3.3'`, function () {
        // given
        const competenceMark = { competenceCode: '3.3', level: 4 };

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks([competenceMark]);

        // then
        expect(europeanNumericLevels).to.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId: '3',
            competenceId: '2',
            level: 4,
          }),
          new EuropeanNumericLevel({
            domainCompetenceId: '3',
            competenceId: '3',
            level: 4,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when competence code is '4.3'`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return two EuropeanNumericLevel for competences '4.3' and '4.4'`, function () {
        // given
        const competenceMark = { competenceCode: '4.3', level: 4 };

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks([competenceMark]);

        // then
        expect(europeanNumericLevels).to.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId: '4',
            competenceId: '3',
            level: 4,
          }),
          new EuropeanNumericLevel({
            domainCompetenceId: '4',
            competenceId: '4',
            level: 4,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when there are competence marks for competence '1.2' and '1.3'`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return an EuropeanNumericLevel for competence '1.3' with the level equals to the average of both levels`, function () {
        // given
        const competenceMarks = [
          { competenceCode: '1.2', level: 4 },
          { competenceCode: '1.3', level: 8 },
        ];

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks(competenceMarks);

        // then
        expect(europeanNumericLevels).to.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId: '1',
            competenceId: '3',
            level: 6,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when there is a competence mark for competence '1.2' but none for competence '1.3'`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should not return an EuropeanNumericLevel for competence '1.3'`, function () {
        // given
        const competenceMarks = [{ competenceCode: '1.2', level: 4 }];

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks(competenceMarks);

        // then
        expect(europeanNumericLevels).to.not.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId: '1',
            competenceId: '3',
            level: 6,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when there is a competence mark for competence '1.3' but none for competence '1.2'`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should not return an EuropeanNumericLevel for competence '1.3'`, function () {
        // given
        const competenceMarks = [{ competenceCode: '1.3', level: 4 }];

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks(competenceMarks);

        // then
        expect(europeanNumericLevels).to.not.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId: '1',
            competenceId: '3',
            level: 6,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when there are competence marks for competence '3.1' and '3.2'`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return an EuropeanNumericLevel for competence '3.1' with the level equals to the average of both levels `, function () {
        // given
        const competenceMarks = [
          { competenceCode: '3.1', level: 4 },
          { competenceCode: '3.2', level: 8 },
        ];

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks(competenceMarks);

        // then
        expect(europeanNumericLevels).to.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId: '3',
            competenceId: '1',
            level: 6,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when there is a competence mark for competence '3.1' but none for competence '3.2'`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should not return an EuropeanNumericLevel for competence '3.1'`, function () {
        // given
        const competenceMarks = [{ competenceCode: '3.1', level: 4 }];

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks(competenceMarks);

        // then
        expect(europeanNumericLevels).to.not.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId: '3',
            competenceId: '1',
            level: 6,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when there is a competence mark for competence '3.2' but none for competence '3.1'`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should not return an EuropeanNumericLevel for competence '3.1'`, function () {
        // given
        const competenceMarks = [{ competenceCode: '3.2', level: 4 }];

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks(competenceMarks);

        // then
        expect(europeanNumericLevels).to.not.deep.contains(
          new EuropeanNumericLevel({
            domainCompetenceId: '3',
            competenceId: '1',
            level: 6,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are competence marks', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return an EuropeanNumericLevel for competence '5.3' with level equal to the average of all competence marks levels`, function () {
        // given
        const competenceMarks = [
          { competenceCode: '3.4', level: 8 },
          { competenceCode: '4.1', level: 5 },
          { competenceCode: '4.2', level: 3 },
        ];

        // when
        const europeanNumericLevels = EuropeanNumericLevelFactory.buildFromCompetenceMarks(competenceMarks);

        // then
        expect(europeanNumericLevels).to.deep.contains(
          new EuropeanNumericLevel({ domainCompetenceId: '5', competenceId: '3', level: 5 })
        );
      });
    });
  });
});
