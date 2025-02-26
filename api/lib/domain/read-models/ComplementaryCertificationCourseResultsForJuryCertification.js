const complementaryCertificationStatus = {
  ACQUIRED: 'Validée',
  REJECTED: 'Rejetée',
};

class ComplementaryCertificationCourseResultsForJuryCertification {
  constructor({ id, partnerKey, acquired, label }) {
    this.id = id;
    this.partnerKey = partnerKey;
    this.acquired = acquired;
    this.label = label;
  }

  get status() {
    return this.acquired ? complementaryCertificationStatus.ACQUIRED : complementaryCertificationStatus.REJECTED;
  }
}

ComplementaryCertificationCourseResultsForJuryCertification.statuses = complementaryCertificationStatus;

module.exports = ComplementaryCertificationCourseResultsForJuryCertification;
