// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const replaceSupOrganizationLearners = require('../../../../lib/domain/usecases/replace-sup-organization-learner');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | ImportSupOrganizationLearner', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('parses the csv received and replace the SupOrganizationLearner', async function () {
    const organizationId = 1;
    const learners = Symbol('learners');
    const warnings = Symbol('warnings');
    const supOrganizationLearnerParser = {
      parse: sinon.stub().returns({ learners, warnings }),
    };
    const supOrganizationLearnerRepository = {
      replaceStudents: sinon.stub(),
    };

    await replaceSupOrganizationLearners({
      organizationId,
      supOrganizationLearnerParser,
      supOrganizationLearnerRepository,
    });

    expect(supOrganizationLearnerRepository.replaceStudents).to.have.been.calledWith(organizationId, learners);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return warnings about the import', async function () {
    const organizationId = 1;
    const learners = Symbol('learners');
    const expectedWarnings = Symbol('warnings');
    const supOrganizationLearnerParser = {
      parse: sinon.stub().returns({ learners, warnings: expectedWarnings }),
    };
    const supOrganizationLearnerRepository = {
      replaceStudents: sinon.stub(),
    };

    const warnings = await replaceSupOrganizationLearners({
      organizationId,
      supOrganizationLearnerParser,
      supOrganizationLearnerRepository,
    });

    expect(warnings).to.equal(expectedWarnings);
  });
});
