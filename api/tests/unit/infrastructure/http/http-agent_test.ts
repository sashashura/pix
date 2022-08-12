// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'axios'.
const axios = require('axios');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'get'.
const { post, get } = require('../../../../lib/infrastructure/http/http-agent');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | http | http-agent', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#post', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      axios.post.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the response status and success from the http call when successful', async function () {
      // given
      const url = 'someUrl';
      const payload = 'somePayload';
      const headers = { a: 'someHeaderInfo' };
      const axiosResponse = {
        data: Symbol('data'),
        status: 'someStatus',
      };
      sinon.stub(axios, 'post').withArgs(url, payload, { headers }).resolves(axiosResponse);

      // when
      const actualResponse = await post({ url, payload, headers });

      // then
      expect(actualResponse).to.deep.equal({
        isSuccessful: true,
        code: axiosResponse.status,
        data: axiosResponse.data,
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when an error occurs', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when error.response exists', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it("should return the error's response status and data from the http call when failed", async function () {
          // given
          sinon.stub(logger, 'error');

          const url = 'someUrl';
          const payload = 'somePayload';
          const headers = { a: 'someHeaderInfo' };
          const axiosError = {
            response: {
              data: Symbol('data'),
              status: 'someStatus',
            },
          };
          sinon.stub(axios, 'post').withArgs(url, payload, { headers }).rejects(axiosError);

          // when
          const actualResponse = await post({ url, payload, headers });

          // then
          expect(actualResponse).to.deep.equal({
            isSuccessful: false,
            code: axiosError.response.status,
            data: axiosError.response.data,
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context("when error.response doesn't exists", function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it("should log error and return the error's response status and success from the http call when failed", async function () {
          // given
          sinon.stub(logger, 'error');

          const url = 'someUrl';
          const payload = 'somePayload';
          const headers = { a: 'someHeaderInfo' };

          const axiosError = {
            response: {
              data: { error: 'HTTP error' },
              status: 400,
            },
          };
          sinon.stub(axios, 'post').withArgs(url, payload, { headers }).rejects(axiosError);

          const expectedResponse = {
            isSuccessful: false,
            code: axiosError.response.status,
            data: axiosError.response.data,
          };

          // when
          const actualResponse = await post({ url, payload, headers });

          // then
          expect(actualResponse).to.deep.equal(expectedResponse);
        });
      });
    });
  });
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      axios.get.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the response status and success from the http call when successful', async function () {
      // given
      const url = 'someUrl';
      const payload = 'somePayload';
      const headers = { a: 'someHeaderInfo' };
      const axiosResponse = {
        data: Symbol('data'),
        status: 'someStatus',
      };
      sinon.stub(axios, 'get').withArgs(url, { data: payload, headers }).resolves(axiosResponse);

      // when
      const actualResponse = await get({ url, payload, headers });

      // then
      expect(actualResponse).to.deep.equal({
        isSuccessful: true,
        code: axiosResponse.status,
        data: axiosResponse.data,
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when an error occurs', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when error.response exists', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it("should return the error's response status and data from the http call when failed", async function () {
          // given
          const url = 'someUrl';
          const payload = 'somePayload';
          const headers = { a: 'someHeaderInfo' };
          const axiosError = {
            response: {
              data: Symbol('data'),
              status: 'someStatus',
            },
          };
          sinon.stub(axios, 'get').withArgs(url, { data: payload, headers }).rejects(axiosError);

          // when
          const actualResponse = await get({ url, payload, headers });

          // then
          expect(actualResponse).to.deep.equal({
            isSuccessful: false,
            code: axiosError.response.status,
            data: axiosError.response.data,
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context("when error.response doesn't exists", function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it("should return the error's response status and success from the http call when failed", async function () {
          // given
          const url = 'someUrl';
          const payload = 'somePayload';
          const headers = { a: 'someHeaderInfo' };

          const axiosError = {
            name: 'error name',
          };
          sinon.stub(axios, 'get').withArgs(url, { data: payload, headers }).rejects(axiosError);

          const expectedResponse = {
            isSuccessful: false,
            code: '500',
            data: null,
          };

          // when
          const actualResponse = await get({ url, payload, headers });

          // then
          expect(actualResponse).to.deep.equal(expectedResponse);
        });
      });
    });
  });
});
