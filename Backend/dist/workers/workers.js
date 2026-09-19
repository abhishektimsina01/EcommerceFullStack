"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const connection = {
    host: "localhost",
    port: 6379,
};
const consoleWoker = new bullmq_1.Worker("console_queue", async (job) => {
    console.log(job.name, job.data);
}, {
    connection: connection,
    concurrency: 1
});
consoleWoker.on("completed", (job) => {
    console.log("done");
});
