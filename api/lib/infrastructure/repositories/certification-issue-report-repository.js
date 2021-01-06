const { NotFoundError } = require('../../domain/errors');
const CertificationIssueReportBookshelf = require('../data/certification-issue-report');
const CertificationIssueReportFactory = require('../../domain/models/CertificatitonIssueReportFactory');

function toDomain(bookshelfCertificationIssueReport) {
  if (!bookshelfCertificationIssueReport) {
    return null;
  }
  return CertificationIssueReportFactory.build(bookshelfCertificationIssueReport.attributes);
}

module.exports = {
  toDomain,
  async save(certificationIssueReport) {
    const newCertificationIssueReport = await new CertificationIssueReportBookshelf(certificationIssueReport).save();
    return toDomain(newCertificationIssueReport);
  },

  async get(id) {
    try {
      const certificationIssueReport = await CertificationIssueReportBookshelf
        .where({ id })
        .fetch({ require: true });
      return toDomain(certificationIssueReport);
    } catch (err) {
      if (err instanceof CertificationIssueReportBookshelf.NotFoundError) {
        throw new NotFoundError('Le signalement n\'existe pas');
      }
      throw err;
    }
  },

  async delete(id) {
    try {
      await CertificationIssueReportBookshelf
        .where({ id })
        .destroy({ require: true });
      return true;
    } catch (err) {
      if (err instanceof CertificationIssueReportBookshelf.NoRowsDeletedError) {
        return false;
      }
    }
  },
};
