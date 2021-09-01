import { connectLogger, getLogger } from 'log4js';
import express from 'express';
import bodyParser from 'body-parser';
import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import path from 'path';
import { Config } from './config';
import { NotifierProvider } from './NotifierProvider';
import OICQNotifier from './notifiers/oicq';
import { MQTTNotifier, MQTTNotifierConfig } from './notifiers/mqtt';
import { Notifier } from './notifier';

function readConfig(): Config {
  const _loaded = yaml.load(readFileSync(path.resolve(process.cwd(), 'config.yml'), { encoding: 'utf-8' }));
  return _loaded as Record<string, unknown>;
}

async function server(config: Config, notifiers: Notifier[]): Promise<void> {
  const logger = getLogger('main.web');

  const app = express();
  app.use(connectLogger(logger, { level: 'auto' }));
  app.use(bodyParser.json());
  app.post('/webhook', (req, res) => {
    logger.info(`incoming webhook event: ${req.body.object_kind}`);
    notifiers.forEach((notifier) => notifier.notify(req.body));
    res.end(JSON.stringify({ status: 'ok' }));
  });

  const port = config.port || 6543;
  const host = config.host || '127.0.0.1';
  app.listen(port, host, () => {
    logger.info(`server listening at http://${host}:${port}/webhook`);
  });
}

function notifierProvider(): NotifierProvider {
  const provider = new NotifierProvider();
  provider.register('oicq', (config) => new OICQNotifier(config));
  provider.register('mqtt', (config) => new MQTTNotifier(config as MQTTNotifierConfig));
  return provider;
}

async function main() {
  const config = readConfig();
  const logger = getLogger('main');
  logger.level = config.logging?.level || 'info';
  const provider = notifierProvider();
  const notifiers = config.notifiers?.map((item) => provider.getNotifier(item.type, item.config)) || [];

  await server(config, notifiers);
}

main().catch((err) => {
  getLogger('main').fatal(err);
  process.exit(1);
});
