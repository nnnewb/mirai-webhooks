import { EnvironmentConfigProvider } from './config';
import { config } from 'dotenv';
import MyBot from './bot';
import { getLogger, Logger } from 'log4js';
const configProvider = new EnvironmentConfigProvider();

config();

async function main() {
  const bot = new MyBot(configProvider);
  await bot.start();
}

main().catch((err) => {
  getLogger('main').fatal(err);
  process.exit(1);
});
