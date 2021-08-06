import { ConfigProvider } from '../config';
import { getLogger, Logger } from 'log4js';
import http from 'http';
import createHandler from 'node-gitlab-webhook';
import { GitLabHooks, Handler } from 'node-gitlab-webhook/interfaces';
import MyBot from '../bot';
import Mustache from 'mustache';
import { readFile } from 'fs/promises';
import path from 'path';

export default class WebServer {
  private logger: Logger;
  private handler: Handler & GitLabHooks;

  constructor(public readonly config: ConfigProvider, public bot: MyBot) {
    this.logger = getLogger('web');
    this.logger.level = 'debug';

    // setup handler
    this.handler = createHandler({ path: '/webhook', secret: 'secret' });
    this.handler.on('error', this.logger.error.bind(this.logger));
    this.handler.on('push', async (event) => {
      const tmpl = await readFile(path.resolve(this.config.template_dir, 'push.mustache'));
      const msg = Mustache.render(tmpl.toString('utf-8'), { event });

      this.logger.info(`${event.payload.user_username} pushed ${event.payload.repository.name}`);

      for (const user of this.config.notify_users) {
        await this.bot.sendPrivateMessage(user, msg);
      }

      for (const grp of this.config.notify_groups) {
        await this.bot.sendGroupMessage(grp, msg);
      }
    });
  }

  start(): void {
    http
      .createServer((req, res) => {
        try {
          this.handler(req, res, (err) => {
            res.statusCode = 404;
            res.end('no such location');
            this.logger.error(err);
          });
        } catch (err) {
          this.logger.error(err);
        }
      })
      .listen(this.config.port, this.config.hostname)
      .once('listening', () => {
        this.logger.info(`webhooks server start at ${this.config.hostname}:${this.config.port}/webhook`);
      })
      .on('error', (err) => {
        this.logger.fatal(err);
        process.exit(1);
      });
  }
}
