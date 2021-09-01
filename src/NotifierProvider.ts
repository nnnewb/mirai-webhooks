import { getLogger, Logger } from 'log4js';
import { Notifier } from './notifier';

type NotifierConstructor = (config: Record<string, unknown>, extras?: unknown) => Notifier;

/**
 * 全局 Notifier 工厂
 */
export class NotifierProvider {
  private constructors: Record<string, NotifierConstructor>;
  private instances: Record<string, Notifier>;
  private logger: Logger;

  constructor() {
    this.constructors = {};
    this.instances = {};
    this.logger = getLogger('main.NotifierProvider');
  }

  register(name: string, cons: NotifierConstructor): void {
    this.constructors[name] = cons;
    this.logger.debug(`register notifier: ${name}`);
  }

  getNotifier(name: string, config?: Record<string, unknown>, extras?: unknown): Notifier {
    if (this.instances[name]) {
      return this.instances[name];
    } else if (this.constructors[name]) {
      if (config === undefined) {
        throw new Error('no notifier instance found, need config object to make new one');
      }

      this.logger.debug(`constructing notifier instance ${name} with configuration ${config} and extras ${extras}`);

      this.instances[name] = this.constructors[name](config, extras);
      return this.instances[name];
    } else {
      throw new Error(`no notifier constructor provide for ${name}`);
    }
  }
}
