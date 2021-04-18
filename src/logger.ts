import pino from "pino";

function getLogger(): pino.Logger {
  let logger: pino.Logger;

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    logger = pino({
      level: "debug",
      prettyPrint: true,
    });
  } else {
    logger = pino(pino.destination({ sync: false }));
  }

  return logger;
}

export default getLogger();
