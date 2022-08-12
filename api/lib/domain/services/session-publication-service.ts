// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SendingEma... Remove this comment to see the full error message
const { SendingEmailToResultRecipientError, SessionAlreadyPublishedError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailServic... Remove this comment to see the full error message
const mailService = require('../../domain/services/mail-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uniqBy'.
const uniqBy = require('lodash/uniqBy');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const some = require('lodash/some');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'publishSes... Remove this comment to see the full error message
async function publishSession({
  sessionId,
  certificationRepository,
  finalizedSessionRepository,
  sessionRepository,
  publishedAt = new Date()
}: $TSFixMe) {
  const session = await sessionRepository.getWithCertificationCandidates(sessionId);
  if (session.isPublished()) {
    throw new SessionAlreadyPublishedError();
  }

  await certificationRepository.publishCertificationCoursesBySessionId(sessionId);

  await sessionRepository.updatePublishedAt({ id: sessionId, publishedAt });

  await _updateFinalizedSession(finalizedSessionRepository, sessionId, publishedAt);

  const emailingAttempts = await _sendPrescriberEmails(session);
  if (_someHaveSucceeded(emailingAttempts) && _noneHaveFailed(emailingAttempts)) {
    await sessionRepository.flagResultsAsSentToPrescriber({
      id: sessionId,
      resultsSentToPrescriberAt: publishedAt,
    });
  }
  if (_someHaveFailed(emailingAttempts)) {
    const failedEmailsRecipients = _failedAttemptsRecipients(emailingAttempts);
    throw new SendingEmailToResultRecipientError(failedEmailsRecipients);
  }
}

async function _sendPrescriberEmails(session: $TSFixMe) {
  const recipientEmails = _distinctCandidatesResultRecipientEmails(session.certificationCandidates);

  const emailingAttempts = [];
  for (const recipientEmail of recipientEmails) {
    const emailingAttempt = await mailService.sendCertificationResultEmail({
      email: recipientEmail,
      sessionId: session.id,
      sessionDate: session.date,
      certificationCenterName: session.certificationCenter,
      resultRecipientEmail: recipientEmail,
      daysBeforeExpiration: 30,
    });
    emailingAttempts.push(emailingAttempt);
  }
  return emailingAttempts;
}

function _distinctCandidatesResultRecipientEmails(certificationCandidates: $TSFixMe) {
  return uniqBy(certificationCandidates, 'resultRecipientEmail')
    .map((candidate: $TSFixMe) => candidate.resultRecipientEmail)
    .filter(Boolean);
}

function _someHaveSucceeded(emailingAttempts: $TSFixMe) {
  return some(emailingAttempts, (emailAttempt: $TSFixMe) => emailAttempt.hasSucceeded());
}

function _noneHaveFailed(emailingAttempts: $TSFixMe) {
  return !some(emailingAttempts, (emailAttempt: $TSFixMe) => emailAttempt.hasFailed());
}

function _someHaveFailed(emailingAttempts: $TSFixMe) {
  return some(emailingAttempts, (emailAttempt: $TSFixMe) => emailAttempt.hasFailed());
}

function _failedAttemptsRecipients(emailingAttempts: $TSFixMe) {
  return emailingAttempts
    .filter((emailAttempt: $TSFixMe) => emailAttempt.hasFailed())
    .map((emailAttempt: $TSFixMe) => emailAttempt.recipientEmail);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function _updateFinalizedSession(finalizedSessionRepository: $TSFixMe, sessionId: $TSFixMe, publishedAt: $TSFixMe) {
  const finalizedSession = await finalizedSessionRepository.get({ sessionId });
  finalizedSession.publish(publishedAt);
  await finalizedSessionRepository.save(finalizedSession);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  publishSession,
};
