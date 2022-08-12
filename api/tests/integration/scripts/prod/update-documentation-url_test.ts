// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateDocu... Remove this comment to see the full error message
const { updateDocumentationUrl, URL } = require('../../../../scripts/prod/update-documentation-url');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('updateDocumentationUrl', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the organization is PRO', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uses the PRO documentation', async function () {
      databaseBuilder.factory.buildOrganization({ type: 'PRO' });

      await databaseBuilder.commit();

      await updateDocumentationUrl();

      const { documentationUrl } = await knex('organizations').first();

      expect(documentationUrl).equal(URL.PRO);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the organization is MEDNUM', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uses the MEDNUM documentation', async function () {
      const { id: organizationId } = databaseBuilder.factory.buildOrganization({ type: 'PRO' });
      const { id: tagId } = databaseBuilder.factory.buildTag({ name: 'MEDNUM' });
      databaseBuilder.factory.buildOrganizationTag({ organizationId, tagId });

      await databaseBuilder.commit();

      await updateDocumentationUrl();

      const { documentationUrl } = await knex('organizations').first();

      expect(documentationUrl).equal(URL.MEDNUM);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization is not PRO', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not the MEDNUM documentation', async function () {
        const { id: organizationId } = databaseBuilder.factory.buildOrganization({
          type: 'SCO',
          documentationUrl: 'toto',
        });
        const { id: tagId } = databaseBuilder.factory.buildTag({ name: 'MEDNUM' });
        databaseBuilder.factory.buildOrganizationTag({ organizationId, tagId });

        await databaseBuilder.commit();

        await updateDocumentationUrl();

        const { documentationUrl } = await knex('organizations').first();

        expect(documentationUrl).to.not.equal(URL.MEDNUM);
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the organization is SUP', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uses the SUP documentation', async function () {
      databaseBuilder.factory.buildOrganization({ type: 'SUP' });

      await databaseBuilder.commit();

      await updateDocumentationUrl();

      const { documentationUrl } = await knex('organizations').first();

      expect(documentationUrl).equal(URL.SUP);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the organization is SCO', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uses the SCO documentation', async function () {
      databaseBuilder.factory.buildOrganization({ type: 'SCO', isManagingStudents: true });

      await databaseBuilder.commit();

      await updateDocumentationUrl();

      const { documentationUrl } = await knex('organizations').first();

      expect(documentationUrl).equal(URL.SCO);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization does not manage students', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not update documentation', async function () {
        databaseBuilder.factory.buildOrganization({
          type: 'SCO',
          isManagingStudents: false,
          documentationUrl: 'toto',
        });

        await databaseBuilder.commit();

        await updateDocumentationUrl();

        const { documentationUrl } = await knex('organizations').first();

        expect(documentationUrl).equal('toto');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization is AEFE', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('uses the AEFE documentation', async function () {
        const { id: organizationId } = databaseBuilder.factory.buildOrganization({ type: 'SCO' });
        const { id: tagId } = databaseBuilder.factory.buildTag({ name: 'AEFE' });
        databaseBuilder.factory.buildOrganizationTag({ organizationId, tagId });

        await databaseBuilder.commit();

        await updateDocumentationUrl();

        const { documentationUrl } = await knex('organizations').first();

        expect(documentationUrl).equal(URL.AEFE);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization is MLF', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('uses the MLF documentation', async function () {
        const { id: organizationId } = databaseBuilder.factory.buildOrganization({ type: 'SCO' });
        const { id: tagId } = databaseBuilder.factory.buildTag({ name: 'MLF' });
        databaseBuilder.factory.buildOrganizationTag({ organizationId, tagId });

        await databaseBuilder.commit();

        await updateDocumentationUrl();

        const { documentationUrl } = await knex('organizations').first();

        expect(documentationUrl).equal(URL.MLF);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization is AGRI', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('uses the AGRI documentation', async function () {
        const { id: organizationId } = databaseBuilder.factory.buildOrganization({
          type: 'SCO',
          isManagingStudents: true,
        });
        const { id: tagId } = databaseBuilder.factory.buildTag({ name: 'AGRICULTURE' });
        databaseBuilder.factory.buildOrganizationTag({ organizationId, tagId });

        await databaseBuilder.commit();

        await updateDocumentationUrl();

        const { documentationUrl } = await knex('organizations').first();

        expect(documentationUrl).equal(URL.AGRI);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the organization is not managing students', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('does not update documentation', async function () {
          const { id: organizationId } = databaseBuilder.factory.buildOrganization({
            type: 'SCO',
            isManagingStudents: false,
            documentationUrl: 'toto',
          });
          const { id: tagId } = databaseBuilder.factory.buildTag({ name: 'AGRICULTURE' });
          databaseBuilder.factory.buildOrganizationTag({ organizationId, tagId });

          await databaseBuilder.commit();

          await updateDocumentationUrl();

          const { documentationUrl } = await knex('organizations').first();

          expect(documentationUrl).equal('toto');
        });
      });
    });
  });
});
