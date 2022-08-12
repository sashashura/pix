// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const ChallengeRepository = require('../../../../lib/infrastructure/repositories/challenge-repository');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const ChallengeSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/challenge-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/challenges');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | challenge-controller', function () {
  let httpTestServer: $TSFixMe;

  let ChallengeRepoStub: $TSFixMe;
  let ChallengeSerializerStub: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    ChallengeRepoStub = sinon.stub(ChallengeRepository, 'get');
    ChallengeSerializerStub = sinon.stub(ChallengeSerializer, 'serialize');

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const challenge = Symbol('someChallenge');

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fetch and return the given challenge, serialized as JSONAPI', async function () {
      // given
      ChallengeRepoStub.resolves(challenge);
      ChallengeSerializerStub.resolves({ serialized: challenge });

      // when
      const response = await httpTestServer.request('GET', '/api/challenges/challenge_id');

      // then
      expect(response.result).to.deep.equal({ serialized: challenge });
    });
  });
});
