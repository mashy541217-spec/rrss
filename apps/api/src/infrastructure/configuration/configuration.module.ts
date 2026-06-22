import { Module, Global } from '@nestjs/common';
import { IConfigurationProvider } from '@rrss-auto/configuration';

class EnvConfigProvider implements IConfigurationProvider {
  get<T>(key: string, defaultValue?: T): T {
    const value = process.env[key];
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Configuration key ${key} is missing`);
    }
    // simple parsing for boolean/number could go here, omitting for simplicity
    return value as any as T;
  }
}

@Global()
@Module({
  providers: [
    {
      provide: 'IConfigurationProvider',
      useClass: EnvConfigProvider,
    },
  ],
  exports: ['IConfigurationProvider'],
})
export class AppConfigModule {}
