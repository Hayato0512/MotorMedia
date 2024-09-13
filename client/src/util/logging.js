// Define log levels
const logLevels = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
};

/**
 * Logs a message with a consistent format.
 * @param {string} message - The log message.
 * @param {string} level - The log level (INFO, WARN, ERROR).
 * @param {string} context - The context or component name where the log is generated.
 */
export function logMessage(message, level = logLevels.INFO, context = "") {
  const timestamp = new Date().toISOString();
  const logContext = context ? `[${context}]` : "";

  // Format the log output
  const formattedMessage = `[${timestamp}] [${level}] ${logContext} ${message}`;

  // Use appropriate console method based on log level
  switch (level) {
    case logLevels.INFO:
      console.info(formattedMessage);
      break;
    case logLevels.WARN:
      console.warn(formattedMessage);
      break;
    case logLevels.ERROR:
      console.error(formattedMessage);
      break;
    default:
      console.log(formattedMessage);
      break;
  }
}
