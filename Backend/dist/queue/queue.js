"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleQueue = void 0;
const bullmq_1 = require("bullmq");
exports.consoleQueue = new bullmq_1.Queue("console_queue");
