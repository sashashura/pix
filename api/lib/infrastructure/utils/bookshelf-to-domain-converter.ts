// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Models = require('../../domain/models');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  buildDomainObjects,
  buildDomainObject,
};

function buildDomainObjects(BookshelfClass: $TSFixMe, bookshelfObjects: $TSFixMe) {
  return bookshelfObjects.map((bookshelfObject: $TSFixMe) => buildDomainObject(BookshelfClass, bookshelfObject));
}

function buildDomainObject(BookshelfClass: $TSFixMe, bookshelfObject: $TSFixMe) {
  if (bookshelfObject) {
    return _buildDomainObject(BookshelfClass, bookshelfObject.toJSON());
  }
  return null;
}

function _buildDomainObject(BookshelfClass: $TSFixMe, bookshelfObjectJson: $TSFixMe) {
  const Model = Models[BookshelfClass.modelName];
  const domainObject = new Model();

  const mappedObject = _.mapValues(domainObject, (value: $TSFixMe, key: $TSFixMe) => {
    const { relationshipType, relationshipClass } = _getBookshelfRelationshipInfo(BookshelfClass, key);

    if ((relationshipType === 'belongsTo' || relationshipType === 'hasOne') && _.isObject(bookshelfObjectJson[key])) {
      return _buildDomainObject(relationshipClass, bookshelfObjectJson[key]);
    }

    if (
      (relationshipType === 'hasMany' || relationshipType === 'belongsToMany') &&
      _.isArray(bookshelfObjectJson[key])
    ) {
      return bookshelfObjectJson[key].map((bookshelfObject: $TSFixMe) => _buildDomainObject(relationshipClass, bookshelfObject));
    }

    return bookshelfObjectJson[key];
  });

  return new Model(mappedObject);
}

function _getBookshelfRelationshipInfo(BookshelfClass: $TSFixMe, key: $TSFixMe) {
  const relatedData =
    typeof BookshelfClass.prototype[key] === 'function' && BookshelfClass.prototype[key]().relatedData;

  if (relatedData) {
    return { relationshipType: relatedData.type, relationshipClass: relatedData.target };
  } else {
    return {};
  }
}
