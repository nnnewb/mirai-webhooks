import { EnvironmentConfigProvider } from './config';
import { config } from 'dotenv';
import MyBot from './bot';
import { getLogger } from 'log4js';
import WebServer from './web';
const configProvider = new EnvironmentConfigProvider();

config();

async function main() {
  const bot = new MyBot(configProvider);
  await bot.start();

  const server = new WebServer(configProvider, bot);
  server.start();
}

main().catch((err) => {
  getLogger('main').fatal(err);
  process.exit(1);
});
