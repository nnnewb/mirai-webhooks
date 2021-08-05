import path from 'path';

export interface ConfigProvider {
  uin: number;
  pwd: string | null;
  platform: number | null;
  data_dir: string | null;
}

export class ConfigError extends Error {}

export class EnvironmentConfigProvider implements ConfigProvider {
  public get uin(): number {
    if (!process.env.MIRAI_WEBHOOKS_UIN) {
      throw new ConfigError('environment variable MIRAI_WEBHOOKS_UIN not set');
    }
    return parseInt(process.env.MIRAI_WEBHOOKS_UIN || '');
  }

  public get pwd(): string | null {
    return process.env.MIRAI_WEBHOOKS_PWD || null;
  }

  public get platform(): number | null {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return process.env.MIRAI_WEBHOOKS_PLATFORM ? parseInt(process.env.MIRAI_WEBHOOKS_PLATFORM!) : null;
  }

  public get data_dir(): string {
    return process.env.MIRAI_WEBHOOKS_DATA_DIR || path.resolve(process.cwd(), 'oicq-data');
  }
}
