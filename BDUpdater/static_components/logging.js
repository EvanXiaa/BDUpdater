"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
var winston = __importStar(require("winston"));
var winston_1 = require("winston");
var combine = winston_1.format.combine, label = winston_1.format.label, timestamp = winston_1.format.timestamp, printf = winston_1.format.printf;
var myFormat = printf(function (info) {
    var _a = info, level = _a.level, message = _a.message, label = _a.label, timestamp = _a.timestamp;
    return "".concat(timestamp, " [").concat(label, "] ").concat(level, ": ").concat(message);
});
function createLogger(module, level) {
    return (0, winston_1.createLogger)({
        level: level,
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'log.log' })
        ],
        format: combine(timestamp(), label({ label: module }), myFormat)
    });
}
exports.createLogger = createLogger;
//const logger = createLogger('logging.ts', 'info');
//logger.info('foobarbaz');
