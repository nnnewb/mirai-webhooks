import { createClient } from 'oicq';
import jsQr from 'jsqr';
import Jimp from 'jimp';
import QrCodeTerminal from 'qrcode-terminal';
import path from 'path';
import { EnvironmentConfigProvider } from './config';
import { config } from 'dotenv';
import { getLogger } from 'log4js';
const configProvider = new EnvironmentConfigProvider();

const logger = getLogger('main');

config();

// 准备
const client = createClient(configProvider.uin, {
  data_dir: path.resolve(process.cwd(), 'oicq-data'),
  platform: 5,
});

// 设备锁回调
client.on('system.login.device', (event) => {
  QrCodeTerminal.generate(event.url, { small: true }, console.log);
  process.stdin.once('data', () => client.login());
});

// 二维码登陆回调
client.on('system.login.qrcode', (data) => {
  Jimp.read(data.image).then((img) => {
    const qrcode = jsQr(new Uint8ClampedArray(img.bitmap.data), img.bitmap.width, img.bitmap.height);
    if (qrcode) {
      QrCodeTerminal.generate(qrcode.data, { small: true }, (str) => console.log(str));
    }
  });

  process.stdin.once('data', () => client.login());
});

// 上线成功
client.on('system.online', () => {
  logger.info("I'm online!");
});

client.login(configProvider.pwd || undefined);
