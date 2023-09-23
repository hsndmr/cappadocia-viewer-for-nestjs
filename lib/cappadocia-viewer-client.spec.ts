import axios from 'axios';
import { ViewerType } from './viewer-type.enum';
import { BadgeType } from './badge-type.enum';
import { CappadociaViewerClient } from './cappadocia-viewer-client';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CappadociaViewerClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send data correctly', async () => {
    // Arrange
    const data = {
      type: ViewerType.REQUEST,
      message: 'Test message',
      badge: 'Test badge',
      badgeType: BadgeType.PRIMARY,
      context: { key: 'value' },
    };

    // Act
    await CappadociaViewerClient.send(data);

    // Assert
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://127.0.0.1:9091/viewers',
      {
        type: data.type,
        message: data.message,
        badge: data.badge,
        badgeType: data.badgeType,
        context: data.context,
        timestamp: expect.any(Number),
      },
    );
  });
});
