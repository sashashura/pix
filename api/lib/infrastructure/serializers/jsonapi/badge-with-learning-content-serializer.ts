// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

const mapType = {
  badgeCriteria: 'badge-criteria',
  skillSets: 'skill-sets',
  badgePartnerCompetences: 'badge-partner-competences',
  partnerCompetences: 'badge-partner-competences',
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(badgeWithLearningContent = {}) {
    return new Serializer('badge', {
      ref: 'id',
      attributes: [
        'altMessage',
        'imageUrl',
        'message',
        'key',
        'title',
        'isCertifiable',
        'isAlwaysVisible',
        'badgeCriteria',
        'skillSets',
        'badgePartnerCompetences',
      ],
      badgeCriteria: {
        include: true,
        ref: 'id',
        attributes: ['threshold', 'scope', 'skillSets', 'partnerCompetences'],
        skillSets: {
          include: false,
          ref: 'id',
        },
        partnerCompetences: {
          include: false,
          ref: 'id',
        },
      },
      skillSets: {
        include: true,
        ref: 'id',
        attributes: ['name', 'skills'],
        skills: {
          include: true,
          ref: 'id',
          attributes: ['name', 'difficulty', 'tube'],
          tube: {
            include: true,
            ref: 'id',
            attributes: ['practicalTitle'],
          },
        },
      },
      badgePartnerCompetences: {
        include: true,
        ref: 'id',
        attributes: ['name', 'skills'],
        skills: {
          include: true,
          ref: 'id',
          attributes: ['name', 'difficulty', 'tube'],
          tube: {
            include: true,
            ref: 'id',
            attributes: ['practicalTitle'],
          },
        },
      },
      typeForAttribute(attribute: $TSFixMe) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        return mapType[attribute];
      },
      transform(record: $TSFixMe) {
        const badge = record.badge;
        badge.badgeCriteria.forEach((badgeCriterion: $TSFixMe) => {
          badgeCriterion.skillSets = badgeCriterion.skillSetIds?.map((skillSetId: $TSFixMe) => {
            return { id: skillSetId };
          });
          badgeCriterion.partnerCompetences = badgeCriterion.skillSets;
        });
        badge.skillSets.forEach((skillSet: $TSFixMe) => {
          const skills = skillSet.skillIds.map((skillId: $TSFixMe) => {
            return record.skills.find(({
              id
            }: $TSFixMe) => skillId === id);
          });
          skillSet.skills = _.compact(skills);
          skillSet.skills.forEach((skill: $TSFixMe) => {
            skill.tube = { ...record.tubes.find(({
              id
            }: $TSFixMe) => id === skill.tubeId) };
          });
        });
        badge.badgePartnerCompetences = badge.skillSets;
        return { ...badge };
      },
    }).serialize(badgeWithLearningContent);
  },
};
