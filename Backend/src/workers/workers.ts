import { Worker } from "bullmq";
const connection = {
  host: "localhost",
  port: 6379,
};

const consoleWoker = new Worker("console_queue", 
    async (job) => {
        console.log(job.name, job.data)        
    },
    {
        connection : connection,
        concurrency : 1
    }
)

consoleWoker.on("completed", (job) => {
    console.log("done")
})