export class FeatureFlag {
  constructor(
    public readonly name: string,
    public readonly isEnabled: boolean,
    public readonly description?: string
  ) {}
}

export const DefaultFeatureFlags: FeatureFlag[] = [
  new FeatureFlag('ENABLE_AI_STUDIO', true, 'Enable the AI Assistant in the Builder'),
  new FeatureFlag('ENABLE_TIME_TRAVEL', true, 'Enable Time Travel Debugger'),
  new FeatureFlag('ENABLE_CUSTOM_PLUGINS', false, 'Allow users to upload custom plugins')
];
