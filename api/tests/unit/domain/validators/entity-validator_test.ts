// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
const { ObjectValidationError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../../../../lib/domain/validators/entity-validator');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Validators | entity-validator', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validateEntity', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when entity is valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not throw', function () {
        expect(() => new EntityForValidatorTest({ id: 3, name: 'salut' })).not.to.throw(ObjectValidationError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when entity is not valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw', function () {
        expect(() => new EntityForValidatorTest({ id: 'coucou', name: 'salut' })).to.throw(ObjectValidationError);
      });
    });
  });
});

const entitySchemaForValidatorTest = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

class EntityForValidatorTest {
  id: $TSFixMe;
  name: $TSFixMe;
  constructor({
    id,
    name
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;

    validateEntity(entitySchemaForValidatorTest, this);
  }
}
