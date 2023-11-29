import winston from 'winston';
import TelegramTransport from './telegramTransport';
import Transport from 'winston-transport';
import { WinstonModule } from 'nest-winston';

const { format } = winston;

export const setupLogger = (
  environment: string,
  serviceName: string,
  telegramToken?: string,
  telegramChannel?: string,
) => {
  const consoleTransport = new winston.transports.Console();
  const transports: Transport[] = [consoleTransport];

  const logger = winston.createLogger({
    level: environment === 'DEV' ? 'silly' : 'warn',
    format: format.combine(
      format.timestamp(),
      format.json(),
      format.prettyPrint(),
    ),
    defaultMeta: {
      service: serviceName,
      node_version: process.version,
      env: environment,
    },
    transports: transports,
  });

  if (!telegramToken) {
    console.warn('No telegram token provided. Use console logger only');
    return logger;
  }

  if (!telegramChannel) {
    console.warn('No telegram channel provided. Use console logger only');
    return logger;
  }

  const telegramTransport = new TelegramTransport({
    token: telegramToken,
    chatId: telegramChannel,
    level: environment === 'DEV' ? 'silly' : 'warn',
    disableNotification: false,
  });

  transports.push(telegramTransport);

  return logger;
};

export const setupLoggerModule = (
  environment: string,
  serviceName: string,
  telegramToken?: string,
  telegramChannel?: string,
) => {
  const consoleTransport = new winston.transports.Console();
  const transports: Transport[] = [consoleTransport];

  const logger = WinstonModule.createLogger({
    level: environment === 'DEV' ? 'silly' : 'warn',
    format: format.combine(
      format.timestamp(),
      format.json(),
      format.prettyPrint(),
    ),
    defaultMeta: {
      service: serviceName,
      node_version: process.version,
      env: environment,
    },
    transports: transports,
  });

  if (!telegramToken) {
    console.warn('No telegram token provided. Use console logger only');
    return logger;
  }

  if (!telegramChannel) {
    console.warn('No telegram channel provided. Use console logger only');
    return logger;
  }

  const telegramTransport = new TelegramTransport({
    token: telegramToken,
    chatId: telegramChannel,
    level: environment === 'DEV' ? 'silly' : 'warn',
    disableNotification: false,
  });

  transports.push(telegramTransport);

  return logger;
};
