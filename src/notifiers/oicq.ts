import { Client, createClient } from 'oicq';
import { Notifier } from '../notifier';
import Handlebars from 'handlebars/runtime';
import { readFileSync } from 'fs';
import path from 'path';
import { WebhooksEvent } from '../webhooks';

interface OICQNotifierConfig {
  uin?: number;
  pwd?: string;
  platform?: number;
  templateDir?: string;
  sendTo?: number[];
  sendToGroups?: number[];
}

export default class OICQNotifier implements Notifier {
  private client: Client;

  constructor(public readonly config: OICQNotifierConfig) {
    if (config.uin === undefined) {
      throw new Error('uin not specified in oicq notifier config');
    }

    if (config.pwd === undefined) {
      throw new Error('pwd not specified in oicq notifier config');
    }

    this.client = createClient(config.uin, { platform: config.platform });
    // 设备锁回调
    this.client.on('system.login.device', () => process.stdin.once('data', () => this.client.login()));
    // 二维码登陆回调
    this.client.on('system.login.qrcode', () => process.stdin.once('data', () => this.client.login()));
    this.client.login(this.config.pwd || undefined);
  }

  render(event: WebhooksEvent): string {
    const tmpl = readFileSync(
      path.resolve(this.config.templateDir || path.resolve(process.cwd(), 'templates'), event.object_kind + '.hbr'),
      { encoding: 'utf-8' }
    );
    const render = Handlebars.compile(tmpl);
    return render({ payload: event });
  }

  notify(event: WebhooksEvent): void {
    const msg = this.render(event);
    this.config.sendTo?.forEach((to) => this.client.sendPrivateMsg(to, msg));
    this.config.sendToGroups?.forEach((to) => this.client.sendGroupMsg(to, msg));
  }
}
