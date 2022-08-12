// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionJur... Remove this comment to see the full error message
class SessionJuryComment {
  authorId: $TSFixMe;
  comment: $TSFixMe;
  id: $TSFixMe;
  updatedAt: $TSFixMe;
  constructor({
    id,
    comment,
    authorId,
    updatedAt
  }: $TSFixMe) {
    this.id = id;
    this.comment = comment;
    this.authorId = authorId;
    this.updatedAt = updatedAt;
  }

  update({
    comment,
    authorId
  }: $TSFixMe) {
    this.comment = comment;
    this.authorId = authorId;
    this.updatedAt = new Date();
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SessionJuryComment;
