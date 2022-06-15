const { expect, catchErr } = require('../../../test-helper');
const { BadRequestError } = require('../../../../lib/application/http-errors');
const { validate } = require('../../../../lib/application/campaigns/admin-update-campaign-validation');

describe('PATCH /api/admin/campaigns/{id} validation', function () {
  let request;
  beforeEach(function () {
    request = {
      params: {
        id: 1,
      },
      payload: {
        data: {
          type: 'campaigns',
          attributes: {
            name: 'name',
            title: 'title',
            'custom-landing-page-text': 'landing-page-text',
            'custom-result-page-text': 'result-page-text',
            'custom-result-page-button-text': 'page-button-text',
            'custom-result-page-button-url': 'page-button-url',
            'multiple-sendings': false,
          },
        },
      },
    };
  });

  context('payload validation', function () {
    context('when the payload is valid', function () {
      it('does not throw an exception', function () {
        expect(validate(request)).to.equal(true);
      });
    });

    context('name validations', function () {
      context('when the name is not a string', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes.name = 1;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the name is missing', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes.name = undefined;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the name is a string with a space', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes.name = ' ';
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the name is a string with only space', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes.name = '  ';
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });
    });

    context('title validations', function () {
      context('when the title is not a string', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes.title = 1;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the title is missing', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes.title = undefined;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the title is null', function () {
        it('returns true', async function () {
          request.payload.data.attributes.title = null;
          expect(validate(request)).to.equal(true);
        });
      });
    });

    context('custom-landing-page-text validations', function () {
      context('when the custom-landing-page-text is missing', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes['custom-landing-page-text'] = undefined;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the custom-landing-page-text is not a string', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes['custom-landing-page-text'] = 1;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the custom-landing-page-text has more than 5000 chars', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes['custom-landing-page-text'] = 'a'.repeat(5001);
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the custom-landing-page-text has 5000 chars', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes['custom-landing-page-text'] = 'a'.repeat(5000);
          expect(validate(request)).to.equal(true);
        });
      });

      context('when the custom-landing-page-text is null', function () {
        it('returns true', async function () {
          request.payload.data.attributes['custom-landing-page-text'] = null;
          expect(validate(request)).to.equal(true);
        });
      });
    });

    context('custom-result-page-text validations', function () {
      context('when the custom-result-page-text is missing', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes['custom-result-page-text'] = undefined;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the custom-result-page-text is not a string', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes['custom-result-page-text'] = 2;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the custom-result-page-text is null', function () {
        it('returns true', async function () {
          request.payload.data.attributes['custom-result-page-text'] = null;
          expect(validate(request)).to.equal(true);
        });
      });
    });

    context('custom-result-page-button-text validations', function () {
      context('when the custom-result-page-button-text is missing', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes['custom-result-page-button-text'] = undefined;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the custom-result-page-button-text is not a string', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes['custom-result-page-button-text'] = 2;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the custom-result-page-button-text is null', function () {
        it('returns true', async function () {
          request.payload.data.attributes['custom-result-page-button-text'] = null;
          expect(validate(request)).to.equal(true);
        });
      });
    });

    context('custom-result-page-button-url validations', function () {
      context('when the custom-result-page-button-url is missing', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes['custom-result-page-button-url'] = undefined;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the custom-result-page-button-url is not a string', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes['custom-result-page-button-url'] = 3;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the custom-result-page-button-url is null', function () {
        it('returns true', async function () {
          request.payload.data.attributes['custom-result-page-button-url'] = null;
          expect(validate(request)).to.equal(true);
        });
      });
    });

    context('multiple-sendings validations', function () {
      context('when the multiple-sendings is missing', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes['multiple-sendings'] = undefined;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the multiple-sendings is not a boolean', function () {
        it('throws an exception', async function () {
          request.payload.data.attributes['multiple-sendings'] = 'a';
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });
    });
  });

  context('parameters validation', function () {
    context('id validations', function () {
      context('when the id is missing', function () {
        it('throws an exception', async function () {
          request.params.id = undefined;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the id is not an integer', function () {
        it('throws an exception', async function () {
          request.params.id = 1.8;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the id under 1', function () {
        it('throws an exception', async function () {
          request.params.id = 0;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });

      context('when the id over 2 ** 31 - 1', function () {
        it('throws an exception', async function () {
          request.params.id = 2 ** 31;
          const error = await catchErr(validate)(request);
          expect(error).to.be.an.instanceOf(BadRequestError);
        });
      });
    });
  });
});
