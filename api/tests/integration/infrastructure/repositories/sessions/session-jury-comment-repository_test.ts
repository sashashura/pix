// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, domainBuilder, catchErr } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../../lib/domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionJuryCommentRepository = require('../../../../../lib/infrastructure/repositories/sessions/session-jury-comment-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | session-jury-comment-repository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#get', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a SessionJuryComment for the given id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the SessionJuryComment', async function () {
        // given
        const juryComment = 'pas interessant';
        const id = 9999;
        const date = new Date('2018-01-12T09:29:16Z');
        const user = databaseBuilder.factory.buildUser();
        const session = databaseBuilder.factory.buildSession({
          id,
          juryComment,
          juryCommentAuthorId: user.id,
          juryCommentedAt: date,
        });
        await databaseBuilder.commit();

        // when
        const sessionJuryComment = await sessionJuryCommentRepository.get(session.id);

        // then
        const expectedSessionJuryComment = domainBuilder.buildSessionJuryComment({
          id,
          updatedAt: date,
          authorId: user.id,
          comment: juryComment,
        });
        expect(sessionJuryComment).to.deepEqualInstance(expectedSessionJuryComment);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the SessionJuryComment even if there are no comment in the given session', async function () {
        // given
        const session = databaseBuilder.factory.buildSession({
          id: 123,
          juryComment: null,
          juryCommentAuthorId: null,
          juryCommentedAt: null,
        });
        await databaseBuilder.commit();

        // when
        const sessionJuryComment = await sessionJuryCommentRepository.get(session.id);

        // then
        const expectedSessionJuryComment = domainBuilder.buildSessionJuryComment({
          id: 123,
          updatedAt: null,
          authorId: null,
          comment: null,
        });
        expect(sessionJuryComment).to.deepEqualInstance(expectedSessionJuryComment);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are no SessionJuryComment for the given id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a NotFoundError', async function () {
        // given
        databaseBuilder.factory.buildSession({ id: 123 });
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(sessionJuryCommentRepository.get)(456);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
        expect((error as $TSFixMe).message).to.equal("La session 456 n'existe pas ou son accès est restreint.");
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#save', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update the session comment', async function () {
        // given
        databaseBuilder.factory.buildUser({ id: 456 });
        databaseBuilder.factory.buildUser({ id: 789 });
        databaseBuilder.factory.buildSession({
          id: 123,
          juryComment: 'commentaire initial',
          juryCommentAuthorId: 456,
          juryCommentedAt: new Date('2018-01-12T09:29:16Z'),
        });
        await databaseBuilder.commit();
        const sessionJuryCommentToSave = domainBuilder.buildSessionJuryComment({
          id: 123,
          updatedAt: new Date('2020-01-12T10:29:16Z'),
          authorId: 789,
          comment: 'commentaire final',
        });

        // when
        await sessionJuryCommentRepository.save(sessionJuryCommentToSave);

        // then
        const expectedSessionJuryComment = await sessionJuryCommentRepository.get(123);
        expect(sessionJuryCommentToSave).to.deepEqualInstance(expectedSessionJuryComment);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a NotFoundError', async function () {
        // given
        databaseBuilder.factory.buildUser({ id: 456 });
        databaseBuilder.factory.buildUser({ id: 789 });
        databaseBuilder.factory.buildSession({
          id: 123,
          juryComment: 'commentaire initial',
          juryCommentAuthorId: 456,
          juryCommentedAt: new Date('2018-01-12T09:29:16Z'),
        });
        await databaseBuilder.commit();
        const sessionJuryCommentToSave = domainBuilder.buildSessionJuryComment({
          id: 456,
          updatedAt: new Date('2020-01-12T10:29:16Z'),
          authorId: 789,
          comment: 'commentaire final',
        });

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(sessionJuryCommentRepository.save)(sessionJuryCommentToSave);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
        expect((error as $TSFixMe).message).to.equal("La session 456 n'existe pas ou son accès est restreint.");
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#delete', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should remove the session comment', async function () {
        // given
        databaseBuilder.factory.buildUser({ id: 456 });
        databaseBuilder.factory.buildSession({
          id: 123,
          juryComment: 'Commentaire à supprimer',
          juryCommentAuthorId: 456,
          juryCommentedAt: new Date('2018-01-12T09:29:16Z'),
        });
        await databaseBuilder.commit();
        const expectedSessionJuryComment = domainBuilder.buildSessionJuryComment({
          id: 123,
          comment: null,
          authorId: null,
          updatedAt: null,
        });

        // when
        await sessionJuryCommentRepository.delete(123);

        // then
        const deletedSessionJuryComment = await sessionJuryCommentRepository.get(123);
        expect(deletedSessionJuryComment).to.deepEqualInstance(expectedSessionJuryComment);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a NotFoundError', async function () {
        // given
        databaseBuilder.factory.buildUser({ id: 456 });
        databaseBuilder.factory.buildUser({ id: 789 });
        databaseBuilder.factory.buildSession({
          id: 123,
          juryComment: 'commentaire initial',
          juryCommentAuthorId: 456,
          juryCommentedAt: new Date('2018-01-12T09:29:16Z'),
        });
        await databaseBuilder.commit();
        const sessionJuryCommentToSave = domainBuilder.buildSessionJuryComment({
          id: 456,
          updatedAt: new Date('2020-01-12T10:29:16Z'),
          authorId: 789,
          comment: 'commentaire final',
        });

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(sessionJuryCommentRepository.save)(sessionJuryCommentToSave);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
        expect((error as $TSFixMe).message).to.equal("La session 456 n'existe pas ou son accès est restreint.");
      });
    });
  });
});
