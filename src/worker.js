import { parentPort } from "worker_threads";

parentPort.on("message", (num) => {
    console.time("calculation");

    let sum = 0;

    for (let i = 0; i < num * 1e7; i++) {
        sum += i;
    }

    console.timeEnd("calculation");

    parentPort.postMessage(sum);
});