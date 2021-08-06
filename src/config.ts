import path from 'path';

export interface ConfigProvider {
  uin: number;
  pwd: string | null;
  platform: number | null;
  data_dir: string | null;
  port: number;
  hostname: string;

  administrator: number | null;
  notify_groups: number[];
  notify_users: number[];

  friend_secret: string;
  template_dir: string;
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

  public get port(): number {
    return process.env.MIRAI_WEBHOOKS_PORT ? parseInt(process.env.MIRAI_WEBHOOKS_PORT) : 6543;
  }

  public get hostname(): string {
    return process.env.MIRAI_WEBHOOKS_HOSTNAME ? process.env.MIRAI_WEBHOOKS_HOSTNAME : '0.0.0.0';
  }

  public get administrator(): number | null {
    return process.env.MIRAI_WEBHOOKS_ADMINISTRATOR ? parseInt(process.env.MIRAI_WEBHOOKS_ADMINISTRATOR) : null; // todo
  }

  public get notify_groups(): number[] {
    if (process.env.MIRAI_WEBHOOKS_NOTIFY_GROUPS) {
      return process.env.MIRAI_WEBHOOKS_NOTIFY_GROUPS.split(',')
        .map((value) => parseInt(value))
        .filter((result) => result);
    }
    return [];
  }

  public get notify_users(): number[] {
    if (process.env.MIRAI_WEBHOOKS_NOTIFY_USERS) {
      return process.env.MIRAI_WEBHOOKS_NOTIFY_USERS.split(',')
        .map((value) => parseInt(value))
        .filter((r) => r);
    }
    return [];
  }

  public get friend_secret(): string {
    return process.env.MIRAI_WEBHOOKS_FRIEND_SECRET || '';
  }

  public get template_dir(): string {
    return process.env.MIRAI_WEBHOOKS_TEMPLATE_DIR || path.resolve(__dirname, '../templates');
  }
}
