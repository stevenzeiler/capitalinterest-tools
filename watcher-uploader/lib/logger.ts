
import * as winston from 'winston';

const log = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'capitalinterest-monitor-upload-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export {
  log
}
