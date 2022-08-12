// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'findAssess... Remove this comment to see the full error message
const findAssessmentParticipationResultList = require('../../../../lib/domain/usecases/find-assessment-participation-result-list');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-assessment-participation-result-list', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('return the assessmentParticipationResultMinimal list', async function () {
    const findPaginatedByCampaignId = sinon.stub();
    const campaignId = 1;
    const filters = Symbol('filters');
    const page = Symbol('page');
    const participations = Symbol('participations');
    findPaginatedByCampaignId.resolves(participations);

    const results = await findAssessmentParticipationResultList({
      campaignId,
      filters,
      page,
      campaignAssessmentParticipationResultListRepository: { findPaginatedByCampaignId },
    });

    expect(findPaginatedByCampaignId).to.have.been.calledWith({ page, campaignId, filters });
    expect(results).to.equal(participations);
  });
});
