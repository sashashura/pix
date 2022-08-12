// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const deleteUnassociatedBadge = require('../../../../lib/domain/usecases/delete-unassociated-badge');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AcquiredBa... Remove this comment to see the full error message
  AcquiredBadgeForbiddenDeletionError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationBadgeForbiddenDeletionError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | delete-unassociated-badge', function () {
  let badgeId: $TSFixMe;
  let badgeRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    badgeId = 'badgeId';
    badgeRepository = {
      isAssociated: sinon.stub(),
      delete: sinon.stub(),
      isRelatedToCertification: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the badge is not associated to a badge acquisition', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      badgeRepository.isAssociated.withArgs(badgeId).resolves(false);
      badgeRepository.delete.withArgs(badgeId).resolves(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete the badge', async function () {
      // when
      const response = await deleteUnassociatedBadge({
        badgeId,
        badgeRepository,
      });

      // then
      expect(response).to.equal(true);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the badge is associated to a badge acquisition', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      badgeRepository.isAssociated.withArgs(badgeId).resolves(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a forbidden deletion error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const err = await catchErr(deleteUnassociatedBadge)({
        badgeId,
        badgeRepository,
      });

      // then
      expect(err).to.be.instanceOf(AcquiredBadgeForbiddenDeletionError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the badge is related to a certification', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      badgeRepository.isRelatedToCertification.withArgs(badgeId).resolves(true);
      badgeRepository.delete.withArgs(badgeId).resolves(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not delete the badge', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(deleteUnassociatedBadge)({
        badgeId,
        badgeRepository,
      });

      // then
      expect(error).to.be.instanceOf(CertificationBadgeForbiddenDeletionError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the badge is not related to a certification', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      badgeRepository.isRelatedToCertification.withArgs(badgeId).resolves(false);
      badgeRepository.delete.withArgs(badgeId).resolves(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete the badge', async function () {
      // when
      const response = await deleteUnassociatedBadge({
        badgeId,
        badgeRepository,
      });

      // then
      expect(response).to.equal(true);
    });
  });
});
