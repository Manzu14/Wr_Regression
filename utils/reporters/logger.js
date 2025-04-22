const { join } = require('node:path');
const pino = require('pino');

const targets = [{ target: 'pino-pretty', options: { colorize: true }, level: 'info' }];

// first process ID would always be configuration related and would not produce any logs related to tests
if (!process.env.SHARED_LOGGER_SKIP_PID) {
    process.env.SHARED_LOGGER_SKIP_PID = process.pid;
}
// this way we filter first process to not create an emtry log file
if (process.env.SHARED_LOGGER_SKIP_PID !== process.pid.toString()) {
    const destination = join('test-results/logs', `worker_id_${process.pid}_${Date.now().toString()}.log`);
    targets.push({ target: 'pino/file', options: { destination, mkdir: true, append: false }, level: 'trace' });
}

const logger = pino({ transport: { targets } });

module.exports = { logger };
