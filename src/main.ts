import { EnvironmentConfigProvider } from './config';
import { config } from 'dotenv';
import MyBot from './bot';
import { getLogger } from 'log4js';
import WebServer from './web';
const configProvider = new EnvironmentConfigProvider();

config();

async function main() {
  const server = new WebServer(configProvider);
  server.start();

  const bot = new MyBot(configProvider);
  bot.start();
}

main().catch((err) => {
  getLogger('main').fatal(err);
  process.exit(1);
});
