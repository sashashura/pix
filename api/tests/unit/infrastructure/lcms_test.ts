// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, nock, catchErr } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../../lib/infrastructure/lcms');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | LCMS', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getLatestRelease', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('calls LCMS API to get learning content latest release', async function () {
      // given
      const lcmsCall = nock('https://lcms-test.pix.fr/api')
        .get('/releases/latest')
        .matchHeader('Authorization', 'Bearer test-api-key')
        .reply(200);

      // when
      await lcms.getLatestRelease();

      // then
      expect(lcmsCall.isDone()).to.equal(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns learning content release', async function () {
      // given
      const learningContent = { models: [{ id: 'recId' }] };
      nock('https://lcms-test.pix.fr/api')
        .get('/releases/latest')
        .matchHeader('Authorization', 'Bearer test-api-key')
        .reply(200, { content: learningContent });

      // when
      const response = await lcms.getLatestRelease();

      // then
      expect(response).to.deep.equal(learningContent);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('rejects when learning content release failed to get', async function () {
      // given
      nock('https://lcms-test.pix.fr/api')
        .get('/releases/latest')
        .matchHeader('Authorization', 'Bearer test-api-key')
        .reply(500);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(lcms.getLatestRelease)();

      // then
      expect(error).to.be.not.null;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createRelease', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('calls LCMS API endpoint', async function () {
      // given
      const lcmsCall = nock('https://lcms-test.pix.fr/api')
        .post('/releases')
        .matchHeader('Authorization', 'Bearer test-api-key')
        .reply(201);

      // when
      await lcms.createRelease();

      // then
      expect(lcmsCall.isDone()).to.equal(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns created release', async function () {
      // given
      const learningContent = { models: [{ id: 'recId' }] };
      nock('https://lcms-test.pix.fr/api')
        .post('/releases')
        .matchHeader('Authorization', 'Bearer test-api-key')
        .reply(201, { content: learningContent });

      // when
      const response = await lcms.createRelease();

      // then
      expect(response).to.deep.equal(learningContent);
    });
  });
});
