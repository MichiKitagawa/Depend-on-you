export class ServiceError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceError);
    }
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
} 