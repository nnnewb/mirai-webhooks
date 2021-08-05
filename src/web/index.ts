import { ConfigProvider } from '../config';
import { getLogger, Logger } from 'log4js';
import http from 'http';
import createHandler from 'node-gitlab-webhook';
import { GitLabHooks, Handler } from 'node-gitlab-webhook/interfaces';
import MyBot from '../bot';

export default class WebServer {
  private logger: Logger;
  private handler: Handler & GitLabHooks;

  constructor(public readonly config: ConfigProvider, public bot: MyBot) {
    this.logger = getLogger('web');
    this.logger.level = 'debug';
    this.handler = createHandler({ path: '/webhook', secret: 'secret' });
    this.handler.on('error', this.logger.error.bind(this.logger));
    this.handler.on('push', (event) => {
      const msg = event.payload.commits.map((commit) => `${commit.author.name} - ${commit.message}`).join('\n');
      this.logger.info('new push event\n' + msg);
    });
  }

  start(): void {
    http.createServer((req, res) => {
      this.handler(req, res, (err) => {
        res.statusCode = 404;
        res.end('no such location');
        this.logger.error(err);
      });
    });
  }
}
