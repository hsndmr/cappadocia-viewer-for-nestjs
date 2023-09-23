import { CappadociaViewerInterceptor } from './cappadocia-viewer-interceptor';
import { CappadociaViewerClient } from './cappadocia-viewer-client';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('CappadociaViewerInterceptor', () => {
  let interceptor: CappadociaViewerInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    interceptor = new CappadociaViewerInterceptor();

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
          query: {},
          body: {},
          headers: {},
          ip: '127.0.0.1',
        }),
        getResponse: jest.fn().mockReturnValue({
          statusCode: 200,
        }),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
    };

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of('test response')),
    };

    jest.spyOn(CappadociaViewerClient, 'send').mockImplementation(jest.fn());
  });

  it('should capture request and response details and call CappadociaViewerClient.send', () => {
    // Arrange & Act
    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe();

    // Assert
    expect(CappadociaViewerClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.any(String),
        message: '/test',
        badge: 'GET',
        context: expect.objectContaining({
          status: expect.any(Array),
          query: expect.any(Object),
          body: expect.any(Object),
          response: 'test response',
          headers: expect.any(Object),
          duration: expect.any(String),
          ip: '127.0.0.1',
          memory: expect.any(String),
          method: 'GET',
        }),
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
