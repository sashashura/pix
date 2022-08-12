// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Course'.
class Course {
  challenges: $TSFixMe;
  competences: $TSFixMe;
  description: $TSFixMe;
  id: $TSFixMe;
  imageUrl: $TSFixMe;
  name: $TSFixMe;
  constructor({
    id,
    description,
    imageUrl,
    name,
    challenges = [],
    competences = []
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.challenges = challenges; // Array of Record IDs
    this.competences = competences; // Array of Record IDs
  }

  get nbChallenges() {
    return this.challenges.length;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Course;
