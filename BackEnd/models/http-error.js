class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Adds a "code" property
    this.code = errorCode; // Add a "message" property
  }
}

module.exports = HttpError;