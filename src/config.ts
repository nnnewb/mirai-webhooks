export interface NotifierConfig {
  type: string;
  config: Record<string, unknown>;
}

export interface LoggingConfig {
  level?: string;
}

export interface Config {
  host?: string;
  port?: number;
  logging?: LoggingConfig;
  notifiers?: NotifierConfig[];
}
