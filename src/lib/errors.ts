// Error handling utilities for the application

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500)
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404)
  }
}

export class DuplicateError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} already exists`, 409)
  }
}

// Error handler utility
export function handleError(error: unknown, context: string = 'Operation'): AppError {
  console.error(`Error in ${context}:`, error)

  if (error instanceof AppError) {
    return error
  }

  // Prisma specific errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; message: string }
    
    switch (prismaError.code) {
      case 'P2002':
        return new DuplicateError('Record')
      case 'P2025':
        return new NotFoundError('Record')
      case 'P2003':
        return new ValidationError('Foreign key constraint failed')
      case 'P2016':
        return new NotFoundError('Related record')
      default:
        return new DatabaseError(`Database error: ${prismaError.message}`)
    }
  }

  // Generic error fallback
  if (error instanceof Error) {
    return new AppError(error.message)
  }

  return new AppError(`Unknown error in ${context}`)
}

// Async error wrapper
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      throw handleError(error, fn.name)
    }
  }
}