// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getNextCommitSubject = require('../../../scripts/get-next-commit-subject');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('get-next-commit-subject', function () {
  const commitSubject = 'Add a user repository';
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should prepend [app-abbrev-xxx] when branch name starts with pf, po, pc or pa', function () {
    expect(getNextCommitSubject(commitSubject, 'pf-42-branch')).to.deep.equal('[pf-42] Add a user repository');
    expect(getNextCommitSubject(commitSubject, 'po-42-branch')).to.deep.equal('[po-42] Add a user repository');
    expect(getNextCommitSubject(commitSubject, 'pc-42-branch')).to.deep.equal('[pc-42] Add a user repository');
    expect(getNextCommitSubject(commitSubject, 'pa-42-branch')).to.deep.equal('[pa-42] Add a user repository');
  });
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should xd', function () {
    expect(getNextCommitSubject(commitSubject, 'pf-42')).to.deep.equal('[pf-42] Add a user repository');
  });
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should not add anything when the branch name does not match the minimum required pattern', function () {
    expect(getNextCommitSubject(commitSubject, 'pf')).to.deep.equal(commitSubject);
  });
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should not add anything when the branch is a merge', function () {
    expect(getNextCommitSubject('Merge branch pf-42-branch', 'pf-42-branch')).to.deep.equal(
      'Merge branch pf-42-branch'
    );
    expect(getNextCommitSubject('Merge pull request pf-42-branch', 'pf-42-branch')).to.deep.equal(
      'Merge pull request pf-42-branch'
    );
  });
});
