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

  friend_secret: string | null;
  agree_group_invite: boolean;
  template_dir: string;
}

export class ConfigError extends Error {}

export class EnvironmentConfigProvider implements ConfigProvider {
  get_env_boolean(name: string): boolean {
    if (!process.env[name] || process.env[name]?.toLowerCase() === 'false') {
      return false;
    }
    return true;
  }

  get_env_number(name: string): number | null {
    const num = parseInt(process.env[name] as string);
    return isNaN(num) ? null : num;
  }

  get_env_number_with_default(name: string, defaultValue: number): number {
    return this.get_env_number(name) || defaultValue;
  }

  get_env_string(name: string): string | null {
    return (process.env[name] as string) || null;
  }

  get_env_string_with_default(name: string, defaultValue: string): string {
    return this.get_env_string(name) || defaultValue;
  }

  public get uin(): number {
    const uin = this.get_env_number('MIRAI_WEBHOOKS_UIN');
    if (uin === null) {
      throw new ConfigError('environment variable MIRAI_WEBHOOKS_UIN not set');
    }
    return uin;
  }

  public get pwd(): string | null {
    return this.get_env_string('MIRAI_WEBHOOKS_PWD');
  }

  public get platform(): number | null {
    return this.get_env_number('MIRAI_WEBHOOKS_PLATFORM');
  }

  public get data_dir(): string {
    return this.get_env_string_with_default('MIRAI_WEBHOOKS_DATA_DIR', path.resolve(process.cwd(), 'oicq-data'));
  }

  public get port(): number {
    return this.get_env_number_with_default('MIRAI_WEBHOOKS_PORT', 6543);
  }

  public get hostname(): string {
    return this.get_env_string_with_default('MIRAI_WEBHOOKS_HOSTNAME', '127.0.0.1');
  }

  public get administrator(): number | null {
    return this.get_env_number('MIRAI_WEBHOOKS_ADMINISTRATOR');
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
    const env_string = this.get_env_string('MIRAI_WEBHOOKS_NOTIFY_USERS');
    if (env_string) {
      return env_string
        .split(',')
        .map((value) => parseInt(value))
        .filter((r) => r);
    }
    return [];
  }

  public get friend_secret(): string | null {
    return this.get_env_string('MIRAI_WEBHOOKS_FRIEND_SECRET');
  }

  public get template_dir(): string {
    return this.get_env_string_with_default('MIRAI_WEBHOOKS_TEMPLATE_DIR', path.resolve(__dirname, '../templates'));
  }

  public get agree_group_invite(): boolean {
    return this.get_env_boolean('MIRAI_WEBHOOKS_AGREE_GROUP_INVITE');
  }
}
