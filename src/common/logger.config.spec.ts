import loggerConfig from './logger.config';

describe('LoggerConfig', () => {
  it('should return log level info when status code is 2xx', () => {
    const response = { statusCode: 201 };

    const pinoHttp: any = loggerConfig.pinoHttp;
    const logLevel = pinoHttp.customLogLevel(response);

    expect(logLevel).toEqual('info');
  });

  it('should return log level warn when status code is 4xx', () => {
    const response = { statusCode: 400 };

    const pinoHttp: any = loggerConfig.pinoHttp;
    const logLevel = pinoHttp.customLogLevel(response);

    expect(logLevel).toEqual('warn');
  });

  it('should return log level error when status code is 5xx', () => {
    const response = { statusCode: 500 };

    const pinoHttp: any = loggerConfig.pinoHttp;
    const logLevel = pinoHttp.customLogLevel(response);

    expect(logLevel).toEqual('error');
  });

  it('should return log level error when error exists', () => {
    const response = { statusCode: 200 };
    const error = new Error('TEST');

    const pinoHttp: any = loggerConfig.pinoHttp;
    const logLevel = pinoHttp.customLogLevel(response, error);

    expect(logLevel).toEqual('error');
  });
});
