import { ConfigProvider } from '../config';
import Koa from 'koa';
import { getLogger, Logger } from 'log4js';

export default class WebServer {
  private app: Koa;
  private logger: Logger;

  constructor(public readonly config: ConfigProvider) {
    this.app = new Koa();
    this.logger = getLogger('web');
    this.logger.level = 'debug';
    this.app.use(async (ctx, next) => {
      ctx.body = 'hello world';
      return await next();
    });
  }

  start(): void {
    this.app.listen(this.config.port, this.config.hostname, () => {
      this.logger.info(`web server start listen at ${this.config.hostname}:${this.config.port}`);
    });
  }
}
