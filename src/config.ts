export interface ConfigProvider {
  uin: number;
  pwd: string | null;
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
}
