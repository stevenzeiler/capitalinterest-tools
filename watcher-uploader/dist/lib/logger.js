"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
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
exports.log = log;
//# sourceMappingURL=logger.js.map