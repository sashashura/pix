// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const improvementService = require('../../../../lib/domain/services/improvement-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../../../../lib/domain/constants');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | ImprovementService', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#filterKnowledgeElementsIfImproving', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment is not improving', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the same list of knowledge-elements if assessment is not improving', function () {
        // given
        const assessment = domainBuilder.buildAssessment({ state: 'started', isImproving: false });
        const knowledgeElements = [domainBuilder.buildKnowledgeElement()];

        // when
        const listOfKnowledgeElements = improvementService.filterKnowledgeElementsIfImproving({
          assessment,
          knowledgeElements,
          isRetrying: false,
        });

        // then
        expect(listOfKnowledgeElements).to.equal(knowledgeElements);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign participation is retrying', function () {
      let assessment: $TSFixMe, knowledgeElements: $TSFixMe;
      let originalConstantValue: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        originalConstantValue = constants.MINIMUM_DELAY_IN_DAYS_BEFORE_RETRYING;
        constants['MINIMUM_DELAY_IN_DAYS_BEFORE_RETRYING'] = 3;
        const assessmentDate = '2020-07-30';

        assessment = domainBuilder.buildAssessment.ofTypeCampaign({
          state: 'started',
          isImproving: true,
          createdAt: assessmentDate,
        });

        knowledgeElements = [
          domainBuilder.buildKnowledgeElement({ status: 'validated', createdAt: '2020-07-26' }),
          domainBuilder.buildKnowledgeElement({ status: 'invalidated', createdAt: '2020-07-27' }),
          domainBuilder.buildKnowledgeElement({ status: 'invalidated', createdAt: '2020-07-28' }),
        ];
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        constants.MINIMUM_DELAY_IN_DAYS_BEFORE_RETRYING = originalConstantValue;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the same list of knowledge-elements if assessment is not improving', function () {
        // when
        const listOfKnowledgeElements = improvementService.filterKnowledgeElementsIfImproving({
          assessment,
          knowledgeElements,
          isRetrying: true,
        });

        // then
        expect(_.map(listOfKnowledgeElements, 'createdAt')).to.exactlyContain(['2020-07-26', '2020-07-28']);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment is improving', function () {
      let assessment: $TSFixMe, oldKnowledgeElementsValidated: $TSFixMe, oldKnowledgeElementsInvalidated: $TSFixMe, recentKnowledgeElements: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const assessmentDate = '2020-07-30';
        const fiveDaysBeforeAssesmentDate = '2020-07-25';
        const fourDaysBeforeAssesmentDate = '2020-07-26';
        const twoDaysBeforeAssesmentDate = '2020-07-28';
        const twoDaysAfterAssesmentDate = '2020-08-02';
        assessment = domainBuilder.buildAssessment.ofTypeCampaign({
          state: 'started',
          isImproving: true,
          createdAt: assessmentDate,
        });
        oldKnowledgeElementsValidated = [
          domainBuilder.buildKnowledgeElement({ status: 'validated', createdAt: fiveDaysBeforeAssesmentDate }),
          domainBuilder.buildKnowledgeElement({ status: 'validated', createdAt: fiveDaysBeforeAssesmentDate }),
          domainBuilder.buildKnowledgeElement({ status: 'validated', createdAt: fiveDaysBeforeAssesmentDate }),
        ];

        oldKnowledgeElementsInvalidated = [
          domainBuilder.buildKnowledgeElement({ status: 'invalidated', createdAt: fiveDaysBeforeAssesmentDate }),
          domainBuilder.buildKnowledgeElement({ status: 'invalidated', createdAt: fiveDaysBeforeAssesmentDate }),
          domainBuilder.buildKnowledgeElement({ status: 'invalidated', createdAt: fiveDaysBeforeAssesmentDate }),
          domainBuilder.buildKnowledgeElement({ status: 'invalidated', createdAt: fourDaysBeforeAssesmentDate }),
        ];
        recentKnowledgeElements = [
          domainBuilder.buildKnowledgeElement({ status: 'validated', createdAt: twoDaysBeforeAssesmentDate }),
          domainBuilder.buildKnowledgeElement({ status: 'invalidated', createdAt: twoDaysBeforeAssesmentDate }),
          domainBuilder.buildKnowledgeElement({ status: 'invalidated', createdAt: twoDaysBeforeAssesmentDate }),
          domainBuilder.buildKnowledgeElement({ status: 'invalidated', createdAt: twoDaysAfterAssesmentDate }),
        ];
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return validated knowledge elements and knowledge elements not validated but created less than 4 days', function () {
        // given
        const knowledgeElements = _.concat(
          oldKnowledgeElementsValidated,
          oldKnowledgeElementsInvalidated,
          recentKnowledgeElements
        );

        // when
        const listOfKnowledgeElements = improvementService.filterKnowledgeElementsIfImproving({
          assessment,
          knowledgeElements,
          isRetrying: false,
        });

        // then
        expect(listOfKnowledgeElements).to.deep.equal(_.concat(oldKnowledgeElementsValidated, recentKnowledgeElements));
      });
    });
  });
});
