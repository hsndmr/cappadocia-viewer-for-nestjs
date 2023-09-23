import axios from 'axios';
import { ViewerType } from './viewer-type.enum';
import { BadgeType } from './badge-type.enum';

export interface CappadociaViewerClientSendData {
  type: ViewerType;
  message?: string;
  badge?: string;
  badgeType?: BadgeType;
  context?: { [key: string]: any };
}

export class CappadociaViewerClient {
  static send(data: CappadociaViewerClientSendData) {
    return axios.post('http://127.0.0.1:9091/viewers', {
      type: data.type,
      message: data.message ?? '',
      badge: data.badge ?? '',
      badgeType: data.badgeType ?? BadgeType.PRIMARY,
      context: data.context ?? [],
      timestamp: Date.now(),
    });
  }
}
