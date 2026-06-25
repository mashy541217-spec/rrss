import { ActionDefinition } from '../entities/ActionDefinition';

export class ActionPolicy {
  public static isPluginFriendly(action: ActionDefinition): boolean {
    const badKeywords = ['instagram', 'telegram', 'facebook', 'googleads'];
    const configurationString = JSON.stringify(action.configuration).toLowerCase();
    return !badKeywords.some(keyword => configurationString.includes(keyword));
  }
}
