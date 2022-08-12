// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserCantBe... Remove this comment to see the full error message
const { UserCantBeCreatedError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const authenticateAnonymousUser = require('../../../../lib/domain/usecases/authenticate-anonymous-user');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | authenticate-anonymous-user', function () {
  let campaignCode: $TSFixMe;
  let lang: $TSFixMe;
  let campaignToJoinRepository: $TSFixMe;
  let userToCreateRepository: $TSFixMe;
  let tokenService: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignCode = 'SIMPLIFIE';
    lang = 'en';
    campaignToJoinRepository = {
      getByCode: sinon.stub(),
    };
    userToCreateRepository = {
      create: sinon.stub(),
    };
    tokenService = {
      createAccessTokenFromUser: sinon.stub(),
    };
    campaignToJoinRepository.getByCode.withArgs(campaignCode).resolves({ isSimplifiedAccess: true });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create an anonymous user', async function () {
    // given
    userToCreateRepository.create.resolves({ id: 1 });
    tokenService.createAccessTokenFromUser.returns({ accessToken: 'access-token', expirationDelaySeconds: 123 });

    // when
    await authenticateAnonymousUser({
      campaignCode,
      lang,
      campaignToJoinRepository,
      userToCreateRepository,
      tokenService,
    });

    // then
    const expectedUser = {
      firstName: '',
      lastName: '',
      cgu: false,
      isAnonymous: true,
      lang: lang,
      hasSeenAssessmentInstructions: false,
    };
    expect(campaignToJoinRepository.getByCode).to.have.been.calledWith(campaignCode);
    expect(userToCreateRepository.create).to.have.been.calledWithMatch({ user: expectedUser });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create and return an access token', async function () {
    // given
    const userId = 1;
    const accessToken = 'access.token';

    userToCreateRepository.create.resolves({ id: userId });
    tokenService.createAccessTokenFromUser
      .withArgs(userId, 'pix')
      .returns({ accessToken, expirationDelaySeconds: 1000 });

    // when
    const result = await authenticateAnonymousUser({
      campaignCode,
      campaignToJoinRepository,
      userToCreateRepository,
      tokenService,
    });

    // then
    expect(result).to.equal(accessToken);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a UserCantBeCreatedError', async function () {
    // given
    const userId = 1;
    campaignCode = 'RANDOM123';

    userToCreateRepository.create.resolves({ id: userId });
    campaignToJoinRepository.getByCode.withArgs(campaignCode).resolves({ isSimplifiedAccess: false });

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const actualError = await catchErr(authenticateAnonymousUser)({
      campaignCode,
      campaignToJoinRepository,
      userToCreateRepository,
      tokenService,
    });

    // then
    expect(actualError).to.be.an.instanceOf(UserCantBeCreatedError);
  });
});
