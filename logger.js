// logger.js
const winston = require('winston')

const start = Date.now()

const { combine, timestamp, label, printf } = winston.format
const myFormat = printf(({ level, message, label, timestamp }) => {
  let color = '\x1b[32m'
  switch (level) {
    case 'error':
      color = '\x1b[31m'
      break
    case 'warn':
      color = '\x1b[93m'
      break
    case 'debug':
      color = '\x1b[2m'
      break
  }
  const elapsedTime = Date.now() - start
  const elapsedSeconds = Math.floor(elapsedTime / 1000)
  const elapsedMilliseconds = elapsedTime % 1000
  return `${elapsedSeconds}.${elapsedMilliseconds
    .toString()
    .padStart(3, '0')}s [${label}] ${color}${level}: ${message}\x1b[0m`
})

const logger = winston.createLogger({
  level: 'debug',
  format: combine(label({ label: 'this2that' }), timestamp(), myFormat),
  transports: [new winston.transports.Console()]
})

module.exports = logger
