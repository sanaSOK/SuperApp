// src/utils/logger.js
// Simple colored console logger with timestamps.

const colors = {
  reset:  '\x1b[0m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  cyan:   '\x1b[36m',
  white:  '\x1b[37m',
};

function timestamp() {
  return colors.dim + new Date().toISOString() + colors.reset;
}

export const logger = {
  info:  (...args) => console.log(`${timestamp()} ${colors.cyan}[INFO]${colors.reset}`, ...args),
  warn:  (...args) => console.warn(`${timestamp()} ${colors.yellow}[WARN]${colors.reset}`, ...args),
  error: (...args) => console.error(`${timestamp()} ${colors.red}[ERROR]${colors.reset}`, ...args),
  debug: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${timestamp()} ${colors.dim}[DEBUG]${colors.reset}`, ...args);
    }
  },
  success: (...args) => console.log(`${timestamp()} ${colors.green}[OK]${colors.reset}`, ...args),
};
