import mqtt from 'mqtt';
import { getLogger, Logger } from 'log4js';
import { Notifier } from '../notifier';
import { WebhooksEvent } from '../webhooks';

export interface MQTTNotifierConfig {
  broker?: string;
}

export class MQTTNotifier implements Notifier {
  private client: mqtt.MqttClient;
  private logger: Logger;
  constructor(config: MQTTNotifierConfig) {
    this.client = mqtt.connect(config.broker);
    this.client.on('reconnect', () => this.logger.info('reconnecting'));
    this.client.on('disconnect', () => this.logger.info('disconnected'));
    this.client.on('connect', () => this.logger.info('connected'));
    this.client.on('offline', () => this.logger.info('offline'));
    this.client.on('end', () => this.logger.info('end'));
    this.client.on('error', (err) => this.logger.error(err));

    this.logger = getLogger('MQTT Notifier');
    this.logger.level = 'DEBUG';
  }

  notify(event: WebhooksEvent): void {
    this.logger.info('publish', event.object_kind);
    this.client.publish(event.object_kind, JSON.stringify(event, null, 2), { qos: 1 }, (err) => {
      if (err) {
        console.error('publish failed', err);
      }
    });
  }
}
