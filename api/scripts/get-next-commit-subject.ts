/*
 * IF message title:
 * > Doesn't start with square brackets []
 * > Doesn't start with Merge branch
 * > Doesn't start with Merge pull request
 * > Doesn't start with #
 *
 * AND
 * > branch name starts with AA-XXX-something (e.g. pi-123-branch-description)
 * > branch name is not:
 * > - dev
 * > - master
 * > - gh-pages
 * > - release-xxx
 *
 * THEN
 * > prepend the issue tag to the commit message
 *
 * My awesome commit -> [pi-123] My awesome commit
 */

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function getNextCommitSubject(messageTitle: $TSFixMe, branchName: $TSFixMe) {
  const startsWithBraces = (str: $TSFixMe) => str.match(/^\[[^\]]/);
  const startsWithMergeBranch = (str: $TSFixMe) => str.indexOf('Merge branch') === 0;
  const startsWithMergePR = (str: $TSFixMe) => str.indexOf('Merge pull request') === 0;
  const startsWithHash = (str: $TSFixMe) => str.indexOf('#') === 0;

  const isCommitMessageToBePrepended = (str: $TSFixMe) => !startsWithBraces(str) && !startsWithMergeBranch(str) && !startsWithMergePR(str) && !startsWithHash(str);

  const branchesNotToModify = ['dev', 'master', 'gh-pages'];

  const isBranchModifiable = (branchName: $TSFixMe) => !branchesNotToModify.includes(branchName);

  const tagMatcher = new RegExp('^(..-\\d+)', 'i');

  const getIssueTagFromBranchName = (str: $TSFixMe) => {
    const matched = str.match(tagMatcher);
    if (matched && matched[0]) {
      return matched[0];
    }
  };
  const issueTag = getIssueTagFromBranchName(branchName);

  if (issueTag && isCommitMessageToBePrepended(messageTitle) && isBranchModifiable(branchName)) {
    // Apply the issue tag to message title
    const newTitle = `[${issueTag}] ${messageTitle}`;

    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    if (process.env.NODE_ENV !== 'test') {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log(`[prepend-commit-message] New message title: ${newTitle}`);
    }
    return newTitle;
  } else {
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    if (process.env.NODE_ENV !== 'test') {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log('[prepend-commit-message] Commit message not to be modified');
    }
    return messageTitle;
  }
};
