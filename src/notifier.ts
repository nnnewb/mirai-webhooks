import { WebhooksEvent } from './webhooks';

export interface Notifier {
  notify(event: WebhooksEvent): void;
}
