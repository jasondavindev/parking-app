import { RequestMethod } from '@nestjs/common';
import { Params } from 'nestjs-pino';
import { name } from '../../package.json';

const { NODE_ENV } = process.env;

export default {
  pinoHttp: {
    base: {
      _application: name,
      _environment: NODE_ENV,
    },
    customLogLevel: (response, error) => {
      if (response.statusCode >= 400 && response.statusCode < 500) {
        return 'warn';
      } else if (response.statusCode >= 500 || error) {
        return 'error';
      }
      return 'info';
    },
  },
  exclude: [{ method: RequestMethod.GET, path: 'health' }],
} as Params;
