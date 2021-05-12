import pino from "pino";

export function getLogger(): pino.Logger {
  const logger = pino();

  logger.debug = (): void => {
    // Silence this to reduce noise.
  };

  logger.error = (): void => {
    // Silence this to reduce noise.
  };

  logger.fatal = (): void => {
    // Silence this to reduce noise.
  };

  logger.info = (): void => {
    // Silence this to reduce noise.
  };

  logger.trace = (): void => {
    // Silence this to reduce noise.
  };

  logger.warn = (): void => {
    // Silence this to reduce noise.
  };

  return logger;
}
