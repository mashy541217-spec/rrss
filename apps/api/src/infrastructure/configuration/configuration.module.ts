import { Module, Global } from '@nestjs/common';
import { IConfigurationProvider } from '@rrss-auto/configuration';

class EnvConfigProvider implements IConfigurationProvider {
  get<T>(key: string, defaultValue?: T): T {
    const value = process.env[key];
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Configuration key ${key} is missing`);
    }
    return value as any as T;
  }
  
  getString(key: string): string {
    return this.get<string>(key);
  }
  
  getNumber(key: string): number {
    return Number(this.get<string>(key));
  }
  
  getBoolean(key: string): boolean {
    return this.get<string>(key) === 'true';
  }
  
  has(key: string): boolean {
    return process.env[key] !== undefined;
  }
  
  getEnvironment(): any {
    return (process.env.NODE_ENV || 'development') as any;
  }
  
  getOrDefault<T>(key: string, defaultValue: T): T {
    return this.get<T>(key, defaultValue);
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
