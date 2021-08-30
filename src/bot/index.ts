import { Client, createClient, MessageElem } from 'oicq';
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

    // 好友申请回调
    this.client.on('request.friend.add', async (event) => {
      this.logger.debug(`好友申请备注： ${event.comment}，需要匹配 ${this.config.friend_secret}`);

      if (this.config.friend_secret && config.friend_secret === event.comment) {
        await this.client.setFriendAddRequest(event.flag, true);
      }
      await this.client.setFriendAddRequest(event.flag, false);
    });

    // 群邀请
    this.client.on('request.group.invite', async (event) => {
      await this.client.setGroupAddRequest(event.flag, this.config.agree_group_invite);
    });

    // 上线成功
    this.client.once('system.online', () => {
      this.logger.info("I'm online!");
    });
  }

  async start(): Promise<MyBot> {
    this.client.login(this.config.pwd || undefined);
    return new Promise<MyBot>((resolve, reject) => {
      this.client.once('system.online', () => resolve(this));
      this.client.once('system.login.error', reject);
    });
  }

  async sendPrivateMessage(
    to: number,
    msg: MessageElem | Iterable<MessageElem> | string,
    auto_escape?: boolean
  ): Promise<void> {
    await this.client.sendPrivateMsg(to, msg, auto_escape);
  }

  async sendGroupMessage(
    to: number,
    msg: MessageElem | Iterable<MessageElem> | string,
    auto_escape?: boolean
  ): Promise<void> {
    await this.client.sendGroupMsg(to, msg, auto_escape);
  }
}
