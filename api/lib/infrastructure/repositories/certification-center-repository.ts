// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfC... Remove this comment to see the full error message
const BookshelfCertificationCenter = require('../orm-models/CertificationCenter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenter = require('../../domain/models/CertificationCenter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertification = require('../../domain/models/ComplementaryCertification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(bookshelfCertificationCenter: $TSFixMe) {
  const dbCertificationCenter = bookshelfCertificationCenter.toJSON();
  const habilitations = _.map(dbCertificationCenter.habilitations, (dbComplementaryCertification: $TSFixMe) => {
    return new ComplementaryCertification({
      id: dbComplementaryCertification.id,
      key: dbComplementaryCertification.key,
      label: dbComplementaryCertification.label,
    });
  });
  return new CertificationCenter({
    ..._.pick(dbCertificationCenter, [
      'id',
      'name',
      'type',
      'externalId',
      'isSupervisorAccessEnabled',
      'createdAt',
      'updatedAt',
    ]),
    habilitations,
  });
}

function _setSearchFiltersForQueryBuilder(filters: $TSFixMe, qb: $TSFixMe) {
  const { id, name, type, externalId } = filters;

  if (id) {
    qb.whereRaw('CAST(id as TEXT) LIKE ?', `%${id.toString().toLowerCase()}%`);
  }
  if (name) {
    qb.whereRaw('LOWER("name") LIKE ?', `%${name.toLowerCase()}%`);
  }
  if (type) {
    qb.whereRaw('LOWER("type") LIKE ?', `%${type.toLowerCase()}%`);
  }
  if (externalId) {
    qb.whereRaw('LOWER("externalId") LIKE ?', `%${externalId.toLowerCase()}%`);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: $TSFixMe) {
    const certificationCenterBookshelf = await BookshelfCertificationCenter.where({ id }).fetch({
      require: false,
      withRelated: [
        {
          habilitations: function (query: $TSFixMe) {
            query.orderBy('id');
          },
        },
      ],
    });

    if (certificationCenterBookshelf) {
      return _toDomain(certificationCenterBookshelf);
    }
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Certification center with id: ${id} not found`);
  },

  async getBySessionId(sessionId: $TSFixMe) {
    const certificationCenterBookshelf = await BookshelfCertificationCenter.where({ 'sessions.id': sessionId })
      .query((qb: $TSFixMe) => {
        qb.innerJoin('sessions', 'sessions.certificationCenterId', 'certification-centers.id');
      })
      .fetch({
        require: false,
        withRelated: [
          {
            habilitations: function (query: $TSFixMe) {
              query.orderBy('id');
            },
          },
        ],
      });

    if (certificationCenterBookshelf) {
      return _toDomain(certificationCenterBookshelf);
    }
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Could not find certification center for sessionId ${sessionId}.`);
  },

  //to delete when feature toggleisEndTestScreenRemovalEnabled is removed
  async getByCertificationCourseId(certificationCourseId: $TSFixMe) {
    const certificationCenterBookshelf = await BookshelfCertificationCenter.where({
      'certification-courses.id': certificationCourseId,
    })
      .query((qb: $TSFixMe) => {
        qb.innerJoin('sessions', 'sessions.certificationCenterId', 'certification-centers.id');
        qb.innerJoin('certification-courses', 'certification-courses.sessionId', 'sessions.id');
      })
      .fetch({
        require: false,
        withRelated: [
          {
            habilitations: function (query: $TSFixMe) {
              query.orderBy('id');
            },
          },
        ],
      });

    if (certificationCenterBookshelf) {
      return _toDomain(certificationCenterBookshelf);
    }
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Could not find certification center for certificationCourseId ${certificationCourseId}.`);
  },

  async save(certificationCenter: $TSFixMe) {
    const cleanedCertificationCenter = _.omit(certificationCenter, ['createdAt', 'habilitations']);
    const certificationCenterBookshelf = await new BookshelfCertificationCenter(cleanedCertificationCenter).save();
    await certificationCenterBookshelf.related('habilitations').fetch();
    return _toDomain(certificationCenterBookshelf);
  },

  async findPaginatedFiltered({
    filter,
    page
  }: $TSFixMe) {
    const certificationCenterBookshelf = await BookshelfCertificationCenter.query((qb: $TSFixMe) => _setSearchFiltersForQueryBuilder(filter, qb)
    ).fetchPage({
      page: page.number,
      pageSize: page.size,
      withRelated: [
        {
          habilitations: function (query: $TSFixMe) {
            query.orderBy('id');
          },
        },
      ],
    });
    const { models, pagination } = certificationCenterBookshelf;
    return { models: models.map(_toDomain), pagination };
  },

  async findByExternalId({
    externalId
  }: $TSFixMe) {
    const certificationCenterBookshelf = await BookshelfCertificationCenter.where({ externalId }).fetch({
      require: false,
      withRelated: [
        {
          habilitations: function (query: $TSFixMe) {
            query.orderBy('id');
          },
        },
      ],
    });

    return certificationCenterBookshelf ? _toDomain(certificationCenterBookshelf) : null;
  },
};
