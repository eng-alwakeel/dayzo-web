// 1. Custom Error Classes
export class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string, id: string) {
    super(`${resource} not found`, "NOT_FOUND", 404, { resource, id });
  }
}

// 2. Result Type Pattern
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function chain<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  return result.ok ? fn(result.value) : result;
}

// 3. Async Error Handling Example
interface Order { id: string; total: number; }
interface User { id: string; name: string; }

// Example usage showing how to handle async tasks gracefully
export async function fetchUserOrders(userId: string): Promise<Order[]> {
  try {
    // Example logic
    throw new Error("Not implemented");
  } catch (error) {
    if (error instanceof NotFoundError) {
      return []; // Return empty array for not found
    }
    // Re-throw unexpected errors
    throw error;
  }
}
