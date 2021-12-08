import Model, { attr } from '@ember-data/model';

export default class BadgeCreation extends Model {
  @attr('string') key;
  @attr('string') title;
  @attr('string') message;
  @attr('string') imageUrl;
  @attr('string') altMessage;
  @attr('boolean') isCertifiable;
  @attr('boolean') isAlwaysVisible;

  @attr('number') targetProfileId;

  @attr('number') campaignParticipationThreshold;

  @attr('number') skillSetThreshold;
  @attr('string') skillSetName;
  @attr('array') skillSetSkillSkillIds;
}
