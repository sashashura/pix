// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const correctionRepository = require('../../../../lib/infrastructure/repositories/correction-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeD... Remove this comment to see the full error message
const challengeDatasource = require('../../../../lib/infrastructure/datasources/learning-content/challenge-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../../../../lib/infrastructure/datasources/learning-content/skill-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialRe... Remove this comment to see the full error message
const tutorialRepository = require('../../../../lib/infrastructure/repositories/tutorial-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Correction... Remove this comment to see the full error message
const Correction = require('../../../../lib/domain/models/Correction');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const ChallengeLearningContentDataObjectFixture = require('../../../tooling/fixtures/infrastructure/challengeLearningContentDataObjectFixture');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const SkillLearningContentDataObjectFixture = require('../../../tooling/fixtures/infrastructure/skillLearningContentDataObjectFixture');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Repository | correction-repository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(challengeDatasource, 'get');
    sinon.stub(skillDatasource, 'get');
    sinon.stub(tutorialRepository, 'findByRecordIdsForCurrentUser');
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByChallengeId', function () {
    const recordId = 'rec-challengeId';
    const userId = 'userId';
    const locale = 'en';
    let expectedHint: $TSFixMe;
    let expectedTutorials: $TSFixMe;
    let expectedLearningMoreTutorials: $TSFixMe;
    const userTutorial = { id: 'userTutorialId', userId, tutorialId: 'recTuto1' };
    const tutorialEvaluation = { id: 'tutorialEvaluationId', userId, tutorialId: 'recTuto1' };

    const userTutorial3 = { id: 'userTutorialId3', userId, tutorialId: 'recTuto3' };
    const tutorialEvaluation3 = { id: 'tutorialEvaluationId3', userId, tutorialId: 'recTuto3' };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      expectedHint = domainBuilder.buildHint({
        skillName: '@web1',
        value: 'Can we geo-locate a rabbit on the ice floe?',
      });

      expectedTutorials = [
        domainBuilder.buildTutorial({ id: 'recTuto1', title: 'Comment dresser un panda' }),
        domainBuilder.buildTutorial({ id: 'recTuto2', title: 'Comment dresser un chat' }),
      ];

      expectedTutorials[0].userTutorial = userTutorial;
      expectedTutorials[0].tutorialEvaluation = tutorialEvaluation;

      expectedLearningMoreTutorials = [
        domainBuilder.buildTutorial({ id: 'recTuto3', title: 'Comment dresser un tigre du bengale' }),
        domainBuilder.buildTutorial({ id: 'recTuto4', title: 'Comment dresser une belette' }),
      ];
      expectedLearningMoreTutorials[0].userTutorial = userTutorial3;
      expectedLearningMoreTutorials[0].tutorialEvaluation = tutorialEvaluation3;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('normal challenge', function () {
      let challengeDataObject;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        const skillDatas = [
          SkillLearningContentDataObjectFixture({
            name: '@web1',
            hintStatus: 'Validé',
            tutorialIds: ['recTuto1'],
            learningMoreTutorialIds: ['recTuto3'],
          }),
          SkillLearningContentDataObjectFixture({
            name: '@web2',
            hintStatus: 'Proposé',
            tutorialIds: ['recTuto2'],
            learningMoreTutorialIds: ['recTuto4'],
          }),
          SkillLearningContentDataObjectFixture({
            name: '@web3',
            hintStatus: 'pré-validé',
            tutorialIds: [],
            learningMoreTutorialIds: [],
          }),
        ];

        skillDatas.forEach((skillData, index) => skillDatasource.get.onCall(index).resolves(skillData));
        tutorialRepository.findByRecordIdsForCurrentUser
          .withArgs({ ids: ['recTuto1'], userId, locale })
          .resolves(expectedTutorials);
        tutorialRepository.findByRecordIdsForCurrentUser
          .withArgs({ ids: ['recTuto3'], userId, locale })
          .resolves(expectedLearningMoreTutorials);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a correction with the solution and solutionToDisplay', async function () {
        // given
        const expectedCorrection = new Correction({
          id: 'recwWzTquPlvIl4So',
          solution: '1, 5',
          solutionToDisplay: '1',
          hint: expectedHint,
          tutorials: expectedTutorials,
          learningMoreTutorials: expectedLearningMoreTutorials,
        });
        challengeDataObject = ChallengeLearningContentDataObjectFixture({
          skillId: 'recIdSkill003',
          solution: '1, 5',
          solutionToDisplay: '1',
        });
        challengeDatasource.get.resolves(challengeDataObject);

        // when
        const result = await correctionRepository.getByChallengeId({ challengeId: recordId, userId, locale });

        // then
        expect(result).to.be.an.instanceof(Correction);
        expect(result).to.deep.equal(expectedCorrection);
        expect(challengeDatasource.get).to.have.been.calledWith(recordId);
        expect(expectedCorrection.tutorials.map(({
          skillId
        }: $TSFixMe) => skillId)).to.deep.equal([
          'recSK0X22abcdefgh',
          'recSK0X22abcdefgh',
        ]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correction with validated hint', async function () {
        // given
        challengeDataObject = ChallengeLearningContentDataObjectFixture({
          skillId: 'recIdSkill003',
        });
        challengeDatasource.get.resolves(challengeDataObject);

        // when
        const result = await correctionRepository.getByChallengeId({ challengeId: recordId, userId, locale });

        // then
        expect(result.hint).to.deep.equal(expectedHint);
      });
    });
  });
});
