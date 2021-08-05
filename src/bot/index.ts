import { Client, createClient } from 'oicq';
import { ConfigProvider } from '../config';
import QrCodeTerminal from 'qrcode-terminal';
import jsQr from 'jsqr';
import Jimp from 'jimp';
import { getLogger, Logger } from 'log4js';

export default class MyBot {
  private client: Client;
  private logger: Logger;

  constructor(public readonly config: ConfigProvider) {
    this.client = createClient(config.uin, { platform: config.platform || undefined });
    this.logger = getLogger(`bot(${config.uin})`);
    this.logger.level = 'debug';

    // 设备锁回调
    this.client.on('system.login.device', (event) => {
      QrCodeTerminal.generate(event.url, { small: true }, console.log);
      process.stdin.once('data', () => this.client.login());
    });

    // 二维码登陆回调
    this.client.on('system.login.qrcode', (data) => {
      Jimp.read(data.image).then((img) => {
        const qrcode = jsQr(new Uint8ClampedArray(img.bitmap.data), img.bitmap.width, img.bitmap.height);
        if (qrcode) {
          QrCodeTerminal.generate(qrcode.data, { small: true }, (str) => console.log(str));
        }
      });

      process.stdin.once('data', () => this.client.login());
    });

    // 上线成功
    this.client.on('system.online', () => {
      this.logger.info("I'm online!");
    });
  }

  start(): void {
    this.client.login(this.config.pwd || undefined);
  }
}
